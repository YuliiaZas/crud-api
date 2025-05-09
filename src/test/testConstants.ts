import { UserDto } from "../models/user.model";

export const userDto: UserDto = {
  username: 'Jane',
  age: 25,
  hobbies: ['hiking', 'reading', 'cycling'],
};

export const updatedUserDto: UserDto = {
  username: 'Jane Updated',
  age: 26,
  hobbies: ['hiking', 'reading', 'cycling'],
};

export const apiUrl = '/api/users/';
