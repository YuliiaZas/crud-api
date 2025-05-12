import { User } from '../models/user.model';
import { InvalidBodyError, InvalidIdError } from './errors';
import { VALIDATION_MESSAGES } from './messages';

export function validateUser(user: User): User {
  if (typeof user.username !== 'string' || !user.username.length) {
    throw new InvalidBodyError(VALIDATION_MESSAGES.INVALID_USERNAME);
  }
  if (typeof user.age !== 'number' || user.age <= 0) {
    throw new InvalidBodyError(VALIDATION_MESSAGES.INVALID_AGE);
  }
  if (
    !Array.isArray(user.hobbies) ||
    user.hobbies.some((hobby) => typeof hobby !== 'string')
  ) {
    throw new InvalidBodyError(VALIDATION_MESSAGES.INVALID_HOBBIES);
  }
  return user;
}

export function validateId(id: string | undefined): string {
  const idPattern = /^[a-fA-F0-9\-]{36}$/;
  if (!id || !idPattern.test(id)) {
    throw new InvalidIdError(VALIDATION_MESSAGES.INVALID_ID(id));
  }
  return id;
}
