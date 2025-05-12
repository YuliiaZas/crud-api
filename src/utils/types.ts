import { UserDto } from "../models/user.model";

export interface WorkerInfo {
  id: number;
  port: number;
  attempts: number;
}

export interface ForkData {
  ROLE: 'http' | 'data';
  PORT: string;
}

export interface WorkerMessage {
  action: string;
  payload?: ClientUserPayload;
  requestId: string;
}

export interface ClientUserPayload {
  id?: string;
  data?: UserDto;
}