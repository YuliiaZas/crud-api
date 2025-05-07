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

export async function handleGetAllUsers(res: ServerResponse) {
  sendJson(res, 200, getUsers());
}

export async function handleGetUserById(res: ServerResponse, id: string) {
  const user = getUserById(id);
  if (!user) return sendJson(res, 404, { message: 'User not found' });
  sendJson(res, 200, user);
}

export async function handleCreateUser(res: ServerResponse, body: User) {
  const newUser = createUser(validateUser(body));
  sendJson(res, 201, newUser);
}

export async function handleUpdateUserById(
  res: ServerResponse,
  id: string,
  body: User,
) {
  const updatedUser = updateUserById(id, validateUser(body));
  if (!updatedUser) return sendJson(res, 404, { message: 'User not found' });
  sendJson(res, 200, updatedUser);
}

export async function handleDeleteUserById(res: ServerResponse, id: string) {
  if (!deleteUserById(id))
    return sendJson(res, 404, { message: 'User not found' });
  sendEmpty(res, 204);
}
