import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { PersonalReview } from './models/personal-review';
import { PersonalReviewRepository } from './personal-review.repository';
import { Film } from '../film/models/film';

@Injectable()
export class PersonalReviewService {
  constructor(
    private readonly personalReviewRepository: PersonalReviewRepository,
  ) {}

  async getUserPersonalReviews(
    userId: User['id'],
    limit: number,
    type: 'all' | 'hidden' | 'visible',
    nextKey?: string,
  ): Promise<PaginatedData<PersonalReview>> {
    return this.personalReviewRepository.getUserPersonalReviews(
      userId,
      limit,
      type,
      nextKey,
    );
  }

  async createPersonalReview(
    userId: User['id'],
    filmId: Film['id'],
    description?: string,
    score?: number,
  ): Promise<PersonalReview> {
    return this.personalReviewRepository.createPersonalReview(
      userId,
      filmId,
      description,
      score,
    );
  }

  async updatePersonalReview(
    id: PersonalReview['id'],
    description?: string | null,
    score?: number | null,
  ): Promise<PersonalReview> {
    return this.personalReviewRepository.updatePersonalReview(
      id,
      description,
      score,
    );
  }

  async getPersonalReview(
    id: PersonalReview['id'],
  ): Promise<PersonalReview | null> {
    return this.personalReviewRepository.getPersonalReview(id);
  }

  async getPersonalReviewAmount(userId: User['id']): Promise<number> {
    return this.personalReviewRepository.getPersonalReviewAmount(userId);
  }

  async deletePersonalReview(
    id: PersonalReview['id'],
  ): Promise<{ id: PersonalReview['id'] }> {
    return this.personalReviewRepository.deletePersonalReview(id);
  }
}
