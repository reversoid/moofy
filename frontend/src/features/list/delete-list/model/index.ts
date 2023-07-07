import { createEvent } from 'effector';
import { DeleteListDTO } from '../../_api/list.service';

export const deleteList = createEvent<DeleteListDTO>();
