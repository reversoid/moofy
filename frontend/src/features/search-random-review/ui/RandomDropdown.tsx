import { Dropdown } from '@nextui-org/react';
import { Critarea } from '../api';
import { useEffect, useState } from 'react';

interface RandomReviewControlProps {
  setType: (type: Critarea) => void;
  handleSearch: () => void;
  isLoading: boolean;
}

const RandomDropDown: React.FC<RandomReviewControlProps> = ({
  setType,
  handleSearch,
  isLoading,
}) => {
  const [DropDownName, setDropDownName] = useState('Выбери обзор');

  useEffect(() => {
    if (isLoading) {
      setDropDownName('Загрузка...');
    } else {
      setDropDownName('Выбери обзор');
    }
  }, [isLoading]);

  const handleDropdownAction = (key: React.Key) => {
    switch (key) {
      case 'RANKED':
        setType('RANKED');
        handleSearch();
        break;
      case 'UNRANKED':
        setType('UNRANKED');
        handleSearch();
        break;
      case 'ALL':
        setType('ALL');
        handleSearch();
        break;
    }
  };
  return (
    <Dropdown>
      <Dropdown.Button color="success" size={'lg'} css={{ width: '18rem' }}>
        {DropDownName}
      </Dropdown.Button>
      <Dropdown.Menu
        variant="solid"
        color="success"
        aria-label="Actions"
        onAction={handleDropdownAction}
      >
        <Dropdown.Item key="ALL">Любой обзор</Dropdown.Item>
        <Dropdown.Item key="RANKED">Обзор с оценкой</Dropdown.Item>
        <Dropdown.Item key="UNRANKED">Обзор без оценки</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RandomDropDown;
