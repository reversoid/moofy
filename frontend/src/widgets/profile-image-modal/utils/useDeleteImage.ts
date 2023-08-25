import { setProfileWithoutLists } from '@/pages/profile/model';
import { useMutation } from '@tanstack/react-query';
import { profileImageService } from '../api/profile-image.service';

export const useDeleteImage = () => {
  const mutation = useMutation({
    mutationFn: () => profileImageService.deleteImage(),
    onSuccess: (data) => {
      setProfileWithoutLists(data);
    },
  });

  return mutation;
};
