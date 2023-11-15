import { Injectable } from '@nestjs/common';
import { User } from './models/user';
import { CreateUserProps } from './types';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: User['id']): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }

  async createUser(props: CreateUserProps): Promise<User | null> {
    return this.userRepository.createUser(props);
  }
}
