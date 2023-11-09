import { useFilmModal } from '@/app/utils/use-film-modal';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { Button, Dropdown, Image, Text } from '@nextui-org/react';
import { FC, useState } from 'react';

export const SharedFilmModal: FC = () => {
  const { film, isModalOpen, setIsModalOpen } = useFilmModal();

  const [selected, setSelected] = useState<string[]>([]);

  if (!film) {
    return null;
  }

  return (
    <Modal closeButton open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalHeader>
        <Text h3>Добавить фильм в коллекцию</Text>
      </ModalHeader>
      <ModalBody>
        <Image src={film.posterPreviewUrl} />
        <Dropdown>
          <Dropdown.Button flat color="secondary" css={{ tt: 'capitalize' }}>
            Выберите коллекцию
          </Dropdown.Button>
          <Dropdown.Menu
            aria-label="Multiple selection actions"
            color="secondary"
            disallowEmptySelection
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={(v) =>
              setSelected([...(v as unknown as string[])])
            }
          >
            <Dropdown.Item key="text">Имя мое</Dropdown.Item>
            <Dropdown.Item key="number">Как много ты знаешь</Dropdown.Item>
            <Dropdown.Item key="date">О чем ты, майкл?</Dropdown.Item>
            <Dropdown.Item key="single_date">to watch</Dropdown.Item>
            <Dropdown.Item key="iteration">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iteration">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iteration">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iteration">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iteration">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iteration">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iteration">Kooo ekekekekek</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ModalBody>
      <ModalFooter>
        <Button
          css={{ '@xsMax': { width: '100%' } }}
          size={'lg'}
          color={'gradient'}
        >
          Добавить
        </Button>
      </ModalFooter>
    </Modal>
  );
};
