import { setProfileWithoutLists } from '@/pages/profile/model';
import { useMutation } from '@tanstack/react-query';
import { profileImageService } from '../api/profile-image.service';

export const useUploadAndSaveImage = () => {
  const mutation = useMutation({
    mutationFn: (file: File) => profileImageService.uploadAndSaveImage(file),
    onSuccess: (data) => {
      setProfileWithoutLists(data);
    },
  });

  return mutation;
};
