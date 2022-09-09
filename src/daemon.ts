import logger from "./logger";
import { getAccessTokens, OAuthCredentials } from "./providers/oauth";
import { getHomes, MODULE_TYPE_RELAY, MODULE_TYPE_THERMOSTAT } from "./providers/homes";
import { OAuthTokens } from "./schemas/oauth";
import { Home, Module, Relay, Room, RoomStatus, Thermostat, ThermostatStatus } from "./schemas/home";
import { setRoomThermPoint } from "./api";
import { findRoomOfModule, findStatusOfModule, findStatusOfRoom, findThermostat, intersection } from "./utils";
import Clock from './clock';

const UPDATE_INTERVAL_SECONDS: number = parseInt(process.env.NMR_UPDATE_INTERVAL, 10) || 600; // 10min
const UPDATE_INTERVAL_WHEN_ACTIVE_SECONDS: number = 120; // 2min
const DIFF_THRESHOLD_DEGREES: number = parseFloat(process.env.NMR_DIFF_THRESHOLD) || 0.5;

const REQUIRED_ENV_VARIABLES = [
  'NMR_CLIENT_ID',
  'NMR_CLIENT_SECRET',
];

for (let key of REQUIRED_ENV_VARIABLES) {
  if (process.env[key] === undefined) {
    logger.error('The env variable ' + key + ' is required');
  }
}

const CLIENT_ID = process.env.NMR_CLIENT_ID;
const CLIENT_SECRET = process.env.NMR_CLIENT_SECRET;

const isBoilerOn = (home: Home): boolean => {
  const thermostat = findThermostat(home);
  const status = findStatusOfModule(home, thermostat) as ThermostatStatus;

  return status.boiler_status;
};

const isForcedProgramOn = (home: Home): boolean => {
  const thermostat = findThermostat(home);
  const room = findRoomOfModule(home, thermostat);
  const status = findStatusOfRoom(home, room);

  return status.therm_setpoint_mode === 'max';
};

const startForcedProgram = async (home: Home, access_token: string): Promise<void> => {
  const thermostat = findThermostat(home);
  const room = findRoomOfModule(home, thermostat);
  const query = {
    home_id: home.id,
    room_id: room.id,
    mode: 'max',
  };

  logger.info('start forced program', { home: home.name });
  await setRoomThermPoint(query, access_token);
};

const stopForcedProgram = async (home: Home, access_token: string): Promise<void> => {
  const thermostat = findThermostat(home);
  const room = findRoomOfModule(home, thermostat);
  const query = {
    home_id: home.id,
    room_id: room.id,
    mode: 'home',
  };

  logger.info('stop forced program', { home: home.name });
  await setRoomThermPoint(query, access_token);
};

const anotherRelayNeedsHeating = (home: Home): boolean => {
  const relays: Relay[] = home.modules.filter(module => module.type === MODULE_TYPE_RELAY) as Relay[];

  const relaysWithoutThermostat: Relay[] = relays.filter(relay => {
    const relayModules: Module[] = relay.modules_bridged.map(id => home.modules.find(module => module.id === id));
    const relayThermostats: Thermostat[] = relayModules.filter(module => module.type === MODULE_TYPE_THERMOSTAT) as Thermostat[];
    return relayThermostats.length === 0;
  });

  for (let relay of relaysWithoutThermostat) {
    const roomsBridgedWithThisRelay: Room[] = home.rooms.filter(room => intersection(room.module_ids, relay.modules_bridged).length > 0);

    for (let room of roomsBridgedWithThisRelay) {
      const roomStatus: RoomStatus = home.status.rooms.find(status => status.id === room.id);

      if (!roomStatus.reachable || roomStatus.open_window) {
        continue;
      }

      if (roomStatus.therm_measured_temperature <= (roomStatus.therm_setpoint_temperature - DIFF_THRESHOLD_DEGREES)) {
        return true;
      }
    }
  }

  return false;
};

type RoomDescription = {
  id: string;
  name: string;
  reachable: boolean;
  therm_measured_temperature: number;
  therm_setpoint_temperature: number;
};
const getRoomDescription = (room: Room, home: Home): RoomDescription => {
  const roomStatus: RoomStatus = home.status.rooms.find(status => status.id === room.id);

  return {
    id: room.id,
    name: room.name,
    reachable: roomStatus.reachable,
    therm_measured_temperature: roomStatus.therm_measured_temperature,
    therm_setpoint_temperature: roomStatus.therm_setpoint_temperature,
  };
};

const main = async (clock: Clock) => {
  const credentials: OAuthCredentials = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  let isActive: boolean = false;

  try {
    const oauth: OAuthTokens = await getAccessTokens(credentials);
    const homes: Home[] = await getHomes(oauth.access_token);

    for (let home of homes) {
      if (undefined === home.status.rooms || undefined === home.status.modules) {
        logger.error('Status cannot be retrieved, check your modules connectivity.');
        continue;
      }

      let needHeating: boolean = anotherRelayNeedsHeating(home);
      let forcedProgramIsOn: boolean = isForcedProgramOn(home);
      let boilerIsOn: boolean = isBoilerOn(home);

      logger.info('rooms status', {
        home: home.name,
        rooms: home.rooms.map(room => getRoomDescription(room, home)),
      });
      logger.debug('check status', { home: home.name, needHeating, forcedProgramIsOn, boilerIsOn });

      if (!needHeating && forcedProgramIsOn) {
        await stopForcedProgram(home, oauth.access_token);
        continue;
      }

      if (needHeating && !boilerIsOn) {
        await startForcedProgram(home, oauth.access_token);
        isActive = true;
      }

      if (needHeating && forcedProgramIsOn) {
        isActive = true;
      }
    }
  } catch (e) {
    logger.error(e.message);
  }

  if (isActive) {
    clock.setNextExecutionIn(UPDATE_INTERVAL_WHEN_ACTIVE_SECONDS);
  }
};

(new Clock(main, UPDATE_INTERVAL_SECONDS, true)).start();
