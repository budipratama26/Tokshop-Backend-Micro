import { UserRole } from '../entities/user.entity.js';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
