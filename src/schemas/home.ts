/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ModuleStatus = RelayStatus | ValveStatus | ThermostatStatus;
export type Module = Relay | Valve | Thermostat;

export interface Home {
  id: string;
  name: string;
  therm_setpoint_default_duration: number;
  therm_mode: string;
  therm_mode_endtime?: string;
  status?: HomeStatus;
  rooms: Room[];
  modules: Module[];
  schedules: Schedule[];
}
export interface HomeStatus {
  modules: ModuleStatus[];
  rooms: RoomStatus[];
  [k: string]: any;
}
export interface RelayStatus {
  id: string;
  type: string;
  [k: string]: any;
}
export interface ValveStatus {
  id: string;
  type: string;
  reachable: boolean;
  [k: string]: any;
}
export interface ThermostatStatus {
  id: string;
  type: string;
  reachable: boolean;
  boiler_status: boolean;
  anticipating: boolean;
  [k: string]: any;
}
export interface RoomStatus {
  id: string;
  reachable: boolean;
  therm_measured_temperature: number;
  heating_power_request?: number;
  therm_setpoint_temperature: number;
  therm_setpoint_mode: string;
  therm_setpoint_start_time: number;
  therm_setpoint_end_time: number;
  anticipating?: boolean;
  open_window?: boolean;
  [k: string]: any;
}
export interface Room {
  id: string;
  name: string;
  type: string;
  module_ids: string[];
  [k: string]: any;
}
export interface Relay {
  id: string;
  type: string;
  name: string;
  setup_date: number;
  modules_bridged: string[];
  [k: string]: any;
}
export interface Valve {
  id: string;
  type: string;
  name: string;
  setup_date: number;
  room_id: string;
  bridge: string;
  [k: string]: any;
}
export interface Thermostat {
  id: string;
  type: string;
  name: string;
  setup_date: number;
  room_id: string;
  bridge: string;
  [k: string]: any;
}
export interface Schedule {
  id: string;
  name: string;
  type: string;
  default: boolean;
  selected: boolean;
  away_temp: number;
  hg_temp: number;
  timetable: TimeSlot[];
  zones: Zone[];
  [k: string]: any;
}
export interface TimeSlot {
  zone_id: number;
  m_offset: number;
  [k: string]: any;
}
export interface Zone {
  id: number;
  name: string;
  type: number;
  rooms: RoomTemperature[];
  [k: string]: any;
}
export interface RoomTemperature {
  id: string;
  therm_setpoint_temperature: number;
  [k: string]: any;
}