import { faCamera, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styled from "styled-components";

import { GearItem } from "src/apiClient/gear";

import { PicturePickerModal } from "./PicturePickerModal";
import { PicturePlaceholder } from "./PicturePlaceholder";

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
          <TopRightIcon className="top-right-icon">
            <FontAwesomeIcon icon={faEdit} />
          </TopRightIcon>
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
  position: relative;

  &:hover .top-right-icon {
    opacity: 1;
  }
`;

const GearPic = styled.img`
  width: 100%;
`;

const TopRightIcon = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 3rem;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: var(--bs-link-color);
`;
