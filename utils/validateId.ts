import { InvalidIdError } from "./errors";

export function validateId(id: string): string {
  const idPattern = /^[a-fA-F0-9]{24}$/;
  if (!idPattern.test(id)) {
    throw new InvalidIdError(`Invalid ID format: ${id}`);
  }
  return id;
}
