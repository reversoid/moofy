import { UseFormSetValue } from 'react-hook-form';
import { FormData } from './UpdateListModal';
import { useEffect } from 'react';

/** When the modal is openned, there must be preset values for current list */
export const useDefaultFormValues = (
  isOpen: boolean,
  setValue: UseFormSetValue<FormData>,
  valuesToSet: FormData,
) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setValue('name', valuesToSet.name);
    setValue('description', valuesToSet.description);
    setValue('isPrivate', valuesToSet.isPrivate);
  }, [isOpen]);
};
