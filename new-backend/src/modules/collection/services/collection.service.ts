import { Injectable } from '@nestjs/common';
import { CreateCollectionProps, UpdateCollectionProps } from '../types';
import { Collection } from '../models/collection';
import { CollectionRepository } from '../repositories/collection.repository';

@Injectable()
export class CollectionService {
  constructor(private readonly collectionRepository: CollectionRepository) {}

  async createCollection(props: CreateCollectionProps): Promise<Collection> {
    return this.collectionRepository.createCollection(props);
  }

  async getCollection(id: Collection['id']): Promise<Collection | null> {
    return this.collectionRepository.getCollection(id);
  }

  async getFullCollection(id: Collection['id']): Promise<Collection | null> {
    return this.collectionRepository.getCollection(id);
  }

  async updateCollection(props: UpdateCollectionProps): Promise<Collection> {
    return this.collectionRepository.updateCollection(props);
  }

  async deleteCollection(
    id: Collection['id'],
  ): Promise<{ id: Collection['id'] }> {
    return this.collectionRepository.deleteCollection(id);
  }
}
