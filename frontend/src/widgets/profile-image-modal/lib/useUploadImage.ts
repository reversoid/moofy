import { profileImageService } from '@/features/profile/edit-image/api/profile-image.service';
import { setProfileWithoutLists } from '@/pages/profile/model/profile';
import { useMutation } from '@tanstack/react-query';

export const useUploadAndSaveImage = () => {
  const mutation = useMutation({
    mutationFn: (file: File) => profileImageService.uploadAndSaveImage(file),
    onSuccess: (data) => {
      setProfileWithoutLists(data);
    },
  });

  return mutation;
};
