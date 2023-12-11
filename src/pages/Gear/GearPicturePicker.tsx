import { useState } from 'react';

import { GearItem } from 'apiClient/gear';

import { faCamera } from '@fortawesome/free-solid-svg-icons';

import { PicturePickerModal } from './PicturePickerModal';
import { PicturePlaceholder } from './PicturePlaceholder';

type Props = {
  item: GearItem;
  refreshGear: () => void;
};

export function GearPicturePicker({ item, refreshGear }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <PicturePlaceholder
        onClick={() => setIsModalOpen(true)}
        icon={faCamera}
        text="Add picture"
        fontSize={3}
      />
      {isModalOpen && (
        <PicturePickerModal
          isOpen={isModalOpen}
          close={() => setIsModalOpen(false)}
          item={item}
          refreshGear={refreshGear}
        />
      )}
    </div>
  );
}
