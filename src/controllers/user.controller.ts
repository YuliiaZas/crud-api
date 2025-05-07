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
  sendJson(res, 200, await getUsers());
}

export async function handleGetUserById(res: ServerResponse, id: string) {
  const user = await getUserById(id);
  if (!user) {
    sendJson(res, 404, { message: 'User not found' });
    return;
  }
  sendJson(res, 200, user);
}

export async function handleCreateUser(res: ServerResponse, body: User) {
  const newUser = await createUser(validateUser(body));
  sendJson(res, 201, newUser);
}

export async function handleUpdateUserById(
  res: ServerResponse,
  id: string,
  body: User,
) {
  const updatedUser = await updateUserById(id, validateUser(body));
  if (!updatedUser) {
    sendJson(res, 404, { message: 'User not found' });
    return;
  }
  sendJson(res, 200, updatedUser);
}

export async function handleDeleteUserById(res: ServerResponse, id: string) {
  if (!await deleteUserById(id)) {
    sendJson(res, 404, { message: 'User not found' });
    return;
  }
  sendEmpty(res, 204);
}
