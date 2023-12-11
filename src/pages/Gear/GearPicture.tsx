import { GearItem } from 'apiClient/gear';
import { useState } from 'react';

import { PicturePickerModal } from './PicturePickerModal';
import { PicturePlaceholder } from './PicturePlaceholder';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';

type Props = {
  gearItem: GearItem;
  refreshGear: () => void;
};

export function GearPicture({ gearItem, refreshGear }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      {gearItem.picture ? (
        <PictureButton onClick={() => setIsModalOpen(true)}>
          <GearPic src={gearItem.picture} alt="Gear item" />
        </PictureButton>
      ) : (
        <div className="border rounded-2 p-2 mb-3 bg-light">
          <PicturePlaceholder
            onClick={() => setIsModalOpen(true)}
            icon={faCamera}
            text="Add picture"
            fontSize={3}
          />
        </div>
      )}
      {isModalOpen && (
        <PicturePickerModal
          isOpen={isModalOpen}
          close={() => setIsModalOpen(false)}
          item={gearItem}
          refreshGear={refreshGear}
        />
      )}
    </>
  );
}

const PictureButton = styled.button`
  padding: 0;
  border: none;
`;

const GearPic = styled.img`
  width: 100%;
`;
