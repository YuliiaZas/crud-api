import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'crypto';
import { User } from '../models/user.model';
import { removeLock, setLock } from '../data/lock';

const FILE_PATH = join(__dirname, '../data/db.json');

export async function getUsers(): Promise<User[]> {
  await setLock();
  const users = await readUsers();
  await removeLock();
  return users;
}

export async function createUser(data: Omit<User, 'id'>): Promise<User> {
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
  data: Omit<User, 'id'>,
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
  const data = await readFile(FILE_PATH, 'utf-8');
  return JSON.parse(data || '[]');
}

async function writeUsers(users: User[]): Promise<void> {
  await writeFile(FILE_PATH, JSON.stringify(users, null, 2));
}

export async function initEmptyDb(): Promise<void> {
  console.log('Initializing empty database...');
  try {
    await setLock();
    await writeUsers([]);
    await removeLock();
  } catch (err: unknown) {
    console.error('Error initializing database:', err);
  }
}
