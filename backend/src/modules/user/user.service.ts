import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async userExists({ email, username }: { email?: string; username?: string }) {
    if (!(email || username)) return false;

    if (username) {
      const user = await this.userRepository.findUserByUsername(username);
      return Boolean(user);
    }
    const user = await this.userRepository.findUserByEmail(email);
    return Boolean(user);
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        created_at: true,
        description: true,
        id: true,
        image_url: true,
        username: true,
      },
    });
  }
}
