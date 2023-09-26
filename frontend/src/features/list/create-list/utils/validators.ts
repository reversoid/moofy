import { maxLength, required } from "@/shared/utils/forms/validators";

export const requiredName = required('Поле не должно быть пустым')

export const maxLengthName = maxLength(32, 'Слишком длинное название')

export const maxLengthDescription = maxLength(400, 'Слишком длинное описание')