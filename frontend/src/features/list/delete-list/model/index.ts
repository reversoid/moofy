import { createEvent } from 'effector';
import { DeleteListDTO } from '../../api/list.service';

export const deleteList = createEvent<DeleteListDTO>();
