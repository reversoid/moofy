import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { UserErrors } from 'src/errors/user.errors';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';
import { List } from '../list/entities/list.entity';
import { FavoriteList } from '../list/entities/favoriteList.entity';
import { ListRepository } from '../list/repositories/list.repository';
import { FavoriteListRepository } from '../list/repositories/favoriteList.repository';
import { EditProfileDTO } from './dtos/EditProfile.dto';
import { AuthErrors } from 'src/errors/auth.errors';
import { ImageErrors } from 'src/errors/image.errors';
import * as sharp from 'sharp';
import { getS3 } from 'src/shared/libs/S3/s3';
import { ManagedUpload } from 'aws-sdk/clients/s3';

export interface Profile {
  id: number;
  username: string;
  description: string | null;
  image_url: string | null;
  created_at: Date;
  allLists: {
    count: number;
    lists: IterableResponse<List>;
  };
  favLists?: {
    count: number;
    lists: IterableResponse<FavoriteList>;
  };
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly listRepository: ListRepository,
    private readonly favListRepository: FavoriteListRepository,
  ) {}
  /** Get full data of profile, including private and favorite lists */
  async getOwnerProfile(id: number, listsLimit: number): Promise<Profile> {
    const user = await this.userRepository.getUserInfoById(id);

    if (!user) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }

    const [lists, favLists, listsCount, favListsCount] = await Promise.all([
      this.listRepository.getUserLists(id, listsLimit),
      this.favListRepository.getUserFavoriteLists(id, listsLimit),
      this.listRepository.getAmountOfUserLists(id),
      this.favListRepository.getAmountOfUserFavLists(id),
    ]);

    return {
      id,
      allLists: {
        count: listsCount,
        lists: lists,
      },
      image_url: user.image_url,
      created_at: user.created_at,
      description: user.description,
      username: user.username,
      favLists: {
        count: favListsCount,
        lists: favLists,
      },
    };
  }

  /** Get guest data for profile, excluding private and favorite lists */
  async getUserProfile(id: number, listsLimit: number): Promise<Profile> {
    const user = await this.userRepository.getUserInfoById(id);
    if (!user) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }
    const [lists, listsCount] = await Promise.all([
      this.listRepository.getUserLists(id, listsLimit, true),
      this.listRepository.getAmountOfUserLists(id, true),
    ]);

    return {
      id,
      allLists: {
        count: listsCount,
        lists: lists,
      },
      image_url: user.image_url,
      created_at: user.created_at,
      description: user.description,
      username: user.username,
    };
  }

  async editProfile(
    userId: number,
    dto: EditProfileDTO,
  ): Promise<Omit<Profile, 'allLists' | 'favLists'>> {
    const user = await this.userRepository.getUserInfoById(userId);

    if (!user) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }

    if (Object.keys(dto).length === 0) {
      return user;
    }
    if (dto.description !== undefined) {
      user.description = dto.description;
    }
    if (dto.imageUrl !== undefined) {
      user.image_url = dto.imageUrl;
    }
    if (dto.username !== undefined) {
      const usernameExists = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (usernameExists || dto.username !== user.username) {
        throw new HttpException(AuthErrors.USERNAME_ALREADY_TAKEN, 409);
      }
      user.username = dto.username;
    }
    await this.userRepository.save(user);
    return {
      created_at: user.created_at,
      description: user.description,
      id: user.id,
      image_url: user.image_url,
      username: user.username,
    };
  }

  async uploadImage(file: Express.Multer.File) {
    const MAX_INPUT_FILE_SIZE = 10 * 1024 * 1024;
    const MAX_COMPRESSED_FILE_SIZE = 50 * 1024;
    const supportedImageFormats = ['jpg', 'png', 'jpeg', 'webp', 'heif'];

    if (
      !supportedImageFormats.includes(
        file.originalname.toLocaleLowerCase().split('.').at(-1),
      )
    ) {
      throw new HttpException(ImageErrors.IMAGE_WRONG_FORMAT, 422);
    }

    if (file.size > MAX_INPUT_FILE_SIZE) {
      throw new HttpException(ImageErrors.IMAGE_TOO_LARGE, 413);
    }

    const compressedImage = await sharp(file.buffer)
      .webp({ quality: 75 })
      .resize({ width: 500, height: 500, fit: 'cover' })
      .toBuffer();

    if (compressedImage.byteLength > MAX_COMPRESSED_FILE_SIZE) {
      throw new HttpException(ImageErrors.IMAGE_TOO_LARGE, 413);
    }

    const s3 = getS3();

    const response = (await s3.Upload(
      { buffer: compressedImage },
      '/profile-images/',
    )) as ManagedUpload.SendData | false;
    if (!response) {
      throw new HttpException(ImageErrors.IMAGE_LOAD_ERROR, 500);
    }

    return { link: response.Location };
  }
}
