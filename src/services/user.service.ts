import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'crypto';
import { User } from '../models/user.model';

const FILE_PATH = join(__dirname, '../data/db.json');

export async function getUsers(): Promise<User[]> {
  const data = await readFile(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function createUser(data: Omit<User, 'id'>): Promise<User> {
  const users = await getUsers();
  const newUser: User = { id: randomUUID(), ...data };
  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((user) => user.id === id);
}

export async function updateUserById(
  id: string,
  data: Omit<User, 'id'>,
): Promise<User | undefined> {
  const users = await getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return undefined;

  const updatedUser: User = { id, ...data };
  users[index] = updatedUser;
  await writeUsers(users);
  return updatedUser;
}

export async function deleteUserById(id: string): Promise<boolean> {
  const users = await getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return false;

  users.splice(index, 1);
  await writeUsers(users);
  return true;
}

async function writeUsers(users: User[]): Promise<void> {
  await writeFile(FILE_PATH, JSON.stringify(users, null, 2));
}
