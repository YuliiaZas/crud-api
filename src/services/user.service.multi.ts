import { sendToDataWorker } from '../database/dataClient';
import { UserDto } from '../models/user.model';

export async function getAllUsers() {
  return sendToDataWorker('getAllUsers');
}

export async function createUser(data: UserDto) {
  return sendToDataWorker('createUser', { data });
}

export async function getUserById(id: string) {
  return sendToDataWorker('getUserById', { id });
}

export async function updateUserById(id: string, data: UserDto) {
  return sendToDataWorker('updateUserById', { id, data });
}

export async function deleteUserById(id: string) {
  return sendToDataWorker('deleteUserById', { id });
}
