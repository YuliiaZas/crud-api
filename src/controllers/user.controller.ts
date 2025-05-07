import { ServerResponse } from 'http';
import {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from '../services/user.service';
import { sendJson, sendEmpty } from '../utils/response';
import { validateUser } from '../utils/validate';
import { User } from '../models/user.model';

export function handleGetAllUsers(res: ServerResponse) {
  sendJson(res, 200, getUsers());
}

export function handleGetUserById(res: ServerResponse, id: string) {
  const user = getUserById(id);
  if (!user) {
    sendJson(res, 404, { message: 'User not found' });
    return;
  }
  sendJson(res, 200, user);
}

export function handleCreateUser(res: ServerResponse, body: User) {
  const newUser = createUser(validateUser(body));
  sendJson(res, 201, newUser);
}

export function handleUpdateUserById(
  res: ServerResponse,
  id: string,
  body: User,
) {
  const updatedUser = updateUserById(id, validateUser(body));
  if (!updatedUser) {
    sendJson(res, 404, { message: 'User not found' });
    return;
  }
  sendJson(res, 200, updatedUser);
}

export function handleDeleteUserById(res: ServerResponse, id: string) {
  if (!deleteUserById(id)) {
    sendJson(res, 404, { message: 'User not found' });
    return;
  }
  sendEmpty(res, 204);
}
