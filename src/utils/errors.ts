export class InvalidBodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBodyError';
  }
}

export class InvalidIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidIdError';
  }
}
