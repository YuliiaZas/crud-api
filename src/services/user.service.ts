import { randomUUID } from 'crypto';
import { User } from '../models/user.model';

const users: User[] = [];

export function getUsers(): User[] {
  return users;
}

export function createUser(data: Omit<User, 'id'>): User {
  const newUser: User = { id: randomUUID(), ...data };
  users.push(newUser);
  return newUser;
}

export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

export function updateUserById(id: string, data: Omit<User, 'id'>): User | undefined {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return undefined;

  const updatedUser: User = { id, ...data };
  users[index] = updatedUser;
  return updatedUser;
}

export function deleteUserById(id: string): boolean {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
}
