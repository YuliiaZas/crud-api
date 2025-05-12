import { ServerResponse } from 'http';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from '../services/user.service.mono';
import { sendJson, sendEmpty, sendNotFound } from '../utils/response';
import { validateUser } from '../utils/validate';
import { User } from '../models/user.model';
import { Status } from '../utils/status.enum';

export function handleGetAllUsers(res: ServerResponse) {
  sendJson(res, Status.OK, getAllUsers());
}

export function handleGetUserById(res: ServerResponse, id: string) {
  const user = getUserById(id);
  if (!user) {
    sendNotFound(res, id);
    return;
  }
  sendJson(res, Status.OK, user);
}

export function handleCreateUser(res: ServerResponse, body: User) {
  const newUser = createUser(validateUser(body));
  sendJson(res, Status.CREATED, newUser);
}

export function handleUpdateUserById(
  res: ServerResponse,
  id: string,
  body: User,
) {
  const updatedUser = updateUserById(id, validateUser(body));
  if (!updatedUser) {
    sendNotFound(res, id);
    return;
  }
  sendJson(res, Status.OK, updatedUser);
}

export function handleDeleteUserById(res: ServerResponse, id: string) {
  if (!deleteUserById(id)) {
    sendNotFound(res, id);
    return;
  }
  sendEmpty(res, Status.NO_CONTENT);
}
