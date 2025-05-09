import { access, constants, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'crypto';
import { User, UserDto } from '../models/user.model';
import { removeLock, setLock } from './userDbLock.service';
import { DB_PATH } from '../utils/paths';
import { MESSAGES } from '../utils/messages';

export async function getUsers(): Promise<User[]> {
  await setLock();
  const users = await readUsers();
  await removeLock();
  return users;
}

export async function createUser(data: UserDto): Promise<User> {
  await setLock();
  const users = await readUsers();
  const newUser: User = { id: randomUUID(), ...data };
  users.push(newUser);
  await writeUsers(users);
  await removeLock();
  return newUser;
}

export async function getUserById(id: string): Promise<User | undefined> {
  await setLock();
  const users = await readUsers();
  await removeLock();
  return users.find((user) => user.id === id);
}

export async function updateUserById(
  id: string,
  data: UserDto,
): Promise<User | undefined> {
  await setLock();
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    await removeLock();
    return undefined;
  }

  const updatedUser: User = { id, ...data };
  users[index] = updatedUser;
  await writeUsers(users);
  await removeLock();
  return updatedUser;
}

export async function deleteUserById(id: string): Promise<boolean> {
  await setLock();
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    await removeLock();
    return false;
  }

  users.splice(index, 1);
  await writeUsers(users);
  await removeLock();
  return true;
}

async function readUsers(): Promise<User[]> {
  try {
    const data = await readFile(DB_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'ENOENT') {
      console.log(MESSAGES.DB_NOT_FOUND(DB_PATH));
      await writeUsers([]);
      return [];
    }
    throw error;
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(users, null, 2));
}

export async function ensureDbExists(): Promise<void> {
  try {
    await access(DB_PATH, constants.F_OK);
  } catch {
    console.log(MESSAGES.DB_NOT_FOUND(DB_PATH));
    await writeUsers([]);
  }
}
