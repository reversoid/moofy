import { useFilmModal } from '@/app/utils/use-film-modal';
import { FilmItem } from '@/entities/film';
import { useMount } from '@/shared/hooks/useMount';
import { useUnmount } from '@/shared/hooks/useUnmount';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { Button, Dropdown, Image, Text } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';

export const SharedFilmModal: FC = () => {
  const { film, isModalOpen, setIsModalOpen } = useFilmModal();

  const [selected, setSelected] = useState<string[]>([]);

  useMount(() => {
    const body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
  });

  useUnmount(() => {
    const body = document.getElementsByTagName('body')[0];
    body.style.overflow = '';
  });

  if (!film) {
    return null;
  }

  return (
    <Modal
      width="20rem"
      closeButton
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <ModalHeader>
        <Text h3>Добавить фильм в коллекцию</Text>
      </ModalHeader>
      <ModalBody>
        <FilmItem film={film} />
        <Dropdown>
          <Dropdown.Button
            size={'lg'}
            flat
            color="secondary"
            css={{ tt: 'capitalize', mt: '$5' }}
          >
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
            <Dropdown.Item css={{ h: 'auto' }} key="text">
              <Image
                src={film.posterPreviewUrl}
                width={'3rem'}
                height={'3rem'}
              />
              <Text>Some text</Text>
            </Dropdown.Item>
            <Dropdown.Item key="number">Как много ты знаешь</Dropdown.Item>
            <Dropdown.Item key="date">О чем ты, майкл?</Dropdown.Item>
            <Dropdown.Item key="single_date">to watch</Dropdown.Item>
            <Dropdown.Item key="iterati2on">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iteratio2n">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iteratiwon">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iteraetion">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iterawtison">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iteratieon">Kooo ekekekekek</Dropdown.Item>
            <Dropdown.Item key="iterawtion">Kooo ekekekekek</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ModalBody>
      <ModalFooter>
        <Button css={{ width: '100%' }} size={'lg'} color={'gradient'}>
          Добавить
        </Button>
      </ModalFooter>
    </Modal>
  );
};
