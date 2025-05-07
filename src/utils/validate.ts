import { User } from '../models/user.model';
import { InvalidBodyError, InvalidIdError } from './errors';

export function validateUser(user: User): User {
  if (typeof user.username !== 'string' || !user.username.length) {
    throw new InvalidBodyError(
      'Invalid username. Username must be a non-empty string.',
    );
  }
  if (typeof user.age !== 'number' || user.age <= 0) {
    throw new InvalidBodyError('Invalid age. Age must be a positive number.');
  }
  if (
    !Array.isArray(user.hobbies) ||
    user.hobbies.some((hobby) => typeof hobby !== 'string')
  ) {
    throw new InvalidBodyError(
      'Invalid hobbies. Hobbies must be an array of string.',
    );
  }
  return user;
}

export function validateId(id: string): string {
  const idPattern = /^[a-fA-F0-9\-]{36}$/;
  if (!idPattern.test(id)) {
    throw new InvalidIdError(`Invalid ID format: ${id}`);
  }
  return id;
}
