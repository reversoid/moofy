import { profileImageService } from '@/features/profile/edit-image/api/profile-image.service';
import { setProfileWithoutLists } from '@/pages/profile/model/profile';
import { useMutation } from '@tanstack/react-query';

export const useDeleteImage = () => {
  const mutation = useMutation({
    mutationFn: () => profileImageService.deleteImage(),
    onSuccess: (data) => {
      setProfileWithoutLists(data);
    },
  });

  return mutation;
};
