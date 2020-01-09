import { Home, Module, ModuleStatus, Room, RoomStatus, Thermostat } from "./schemas/home";
import { MODULE_TYPE_THERMOSTAT } from "./providers/homes";

export const intersection = <T>(a: T[], b: T[]): T[] => {
  return a.filter(x => b.includes(x));
};

export const findRoomOfModule = (home: Home, module: Module): Room => {
  return home.rooms.find(room => room.module_ids.includes(module.id));
};

export const findStatusOfRoom = (home: Home, room: Room): RoomStatus => {
  return home.status.rooms.find(status => status.id === room.id);
};

export const findStatusOfModule = (home: Home, module: Module): ModuleStatus => {
  return home.status.modules.find(status => status.id === module.id);
};

export const findThermostat = (home: Home): Thermostat | undefined => {
  return home.modules.find(module => module.type === MODULE_TYPE_THERMOSTAT) as Thermostat;
};
