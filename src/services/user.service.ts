import { User } from '../models/user.model';

export function getUsers(): User[] {
  console.log('getUsers');
  return [];
}

export function createUser(user: User): User {
  console.log('createUser', user);
  return {} as User;
}

export function getUserById(userId: string): User | null {
  console.log('getUserById', userId);
  return null;
}

export function updateUserById(userId: string, user: User): User | null {
  console.log('updateUserById', userId, user);
  return null;
}

export function deleteUserById(userId: string): User | null {
  console.log('deleteUserById', userId);
  return null;
}
