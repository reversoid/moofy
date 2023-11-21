import { Injectable, PipeTransform } from '@nestjs/common';
import { PrimitiveCollectionService } from '../../services/primitive-collection.service';
import { WrongCollectionIdException } from '../../exceptions/wrong-collection-id.exception';
import { z } from 'zod';

const numericIdSchema = z.number().int();

@Injectable()
export class CollectionExistsPipe implements PipeTransform {
  constructor(
    private readonly primitiveCollectionService: PrimitiveCollectionService,
  ) {}

  async transform(value: any) {
    const id = numericIdSchema.parse(value);

    const collection = await this.primitiveCollectionService.getCollection(id);
    if (!collection) {
      throw new WrongCollectionIdException();
    }

    return id;
  }
}
