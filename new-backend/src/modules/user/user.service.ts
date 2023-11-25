import { Injectable } from '@nestjs/common';
import { User } from './models/user';
import { ChangeUserDataProps, CreateUserProps } from './types';
import { UserRepository } from './user.repository';
import { FullUser } from './models/full-user';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: User['id']): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }

  async createUser(props: CreateUserProps): Promise<User> {
    return this.userRepository.createUser(props);
  }

  async getUserByUsername(username: User['username']): Promise<User | null> {
    return this.userRepository.getUserByUsername(username);
  }

  async _getUserWithSensetiveDataByUsername(
    username: User['username'],
  ): Promise<FullUser | null> {
    return this.userRepository.getFullUserByUsername(username);
  }

  async changeUserData(
    userId: User['id'],
    props: ChangeUserDataProps,
  ): Promise<User> {
    return this.userRepository.changeUserData(userId, props);
  }
}
