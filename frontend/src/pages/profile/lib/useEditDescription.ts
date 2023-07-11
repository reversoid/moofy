import { useMutation } from '@tanstack/react-query';
import { profileService } from '../api/profile.service';
import { setProfileWithoutLists } from '../model/profile';

export const useEditDescription = () => {
  const mutation = useMutation({
    mutationFn: (newDescription: string) =>
      profileService.editProfileDescription(newDescription),
    onSuccess(data) {
      setProfileWithoutLists(data);
    },
  });

  return mutation;
};
