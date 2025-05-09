export interface UserDto {
  username: string;
  age: number;
  hobbies: string[];
}

export interface User extends UserDto {
  id: string;
}
