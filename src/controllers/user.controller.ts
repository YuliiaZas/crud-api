import { ServerResponse } from 'http';
import {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from '../services/user.service';
import { sendJson, sendEmpty, sendNotFound } from '../utils/response';
import { validateUser } from '../utils/validate';
import { User } from '../models/user.model';
import { Status } from '../utils/status.enum';

export async function handleGetAllUsers(res: ServerResponse) {
  sendJson(res, Status.OK, await getUsers());
}

export async function handleGetUserById(res: ServerResponse, id: string) {
  const user = await getUserById(id);
  if (!user) {
    sendNotFound(res, id);
    return;
  }
  sendJson(res, Status.OK, user);
}

export async function handleCreateUser(res: ServerResponse, body: User) {
  const newUser = await createUser(validateUser(body));
  sendJson(res, Status.CREATED, newUser);
}

export async function handleUpdateUserById(
  res: ServerResponse,
  id: string,
  body: User,
) {
  const updatedUser = await updateUserById(id, validateUser(body));
  if (!updatedUser) {
    sendNotFound(res, id);
    return;
  }
  sendJson(res, Status.OK, updatedUser);
}

export async function handleDeleteUserById(res: ServerResponse, id: string) {
  if (!(await deleteUserById(id))) {
    sendNotFound(res, id);
    return;
  }
  sendEmpty(res, Status.NO_CONTENT);
}
