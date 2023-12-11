import { GearItem, editGearItem } from 'apiClient/gear';
import Modal from 'react-bootstrap/Modal';
import { useGetGearTypePicturesQuery } from 'redux/api';
import styled from 'styled-components';

import { PicturePlaceholder } from './PicturePlaceholder';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { uploadFile } from 'apiClient/client';
import { useRef, useState } from 'react';

type Props = {
  isOpen: boolean;
  close: () => void;
  item: GearItem;
  refreshGear: () => void;
};

export function PicturePickerModal({ isOpen, close, item, refreshGear }: Props) {
  const { data: pictures, refetch: refetchPictures } = useGetGearTypePicturesQuery(item.type.id);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<string | undefined>(item.picture);

  return (
    <Modal show={isOpen} onHide={close} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Add picture for {item.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <GridContainer>
          <div style={{ width: '200px' }}>
            <PicturePlaceholder
              icon={faUpload}
              onClick={() => {
                if (fileInputRef.current != null) {
                  fileInputRef.current.click();
                }
              }}
              text="Upload picture"
              size="200px"
            />
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file == null) {
                  return;
                }
                uploadFile(`/gear/${item.id}/picture/`, file).then(() => {
                  refreshGear();
                  refetchPictures();
                  close();
                });
              }}
              accept="image/*"
            />
          </div>
          {pictures?.map((pic) => (
            <PicContainer
              key={pic}
              onClick={() => {
                setSelected(pic);
              }}
              selected={selected === pic}
            >
              <Pic src={pic} />
            </PicContainer>
          ))}
        </GridContainer>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={close}>
          Close
        </button>

        <button
          className="btn btn-primary"
          onClick={() => {
            editGearItem(item.id, { picture: selected }).then(() => {
              close();
              refreshGear();
            });
          }}
          disabled={selected == null}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const PicContainer = styled.button<{ selected?: boolean }>`
  width: 200px;
  height: 200px;
  padding: 0;
  outline: grey solid 1px;
  border: none;

  ${({ selected }) => (selected ? 'outline: var(--bs-success) 6px solid !important' : '')}
`;

const Pic = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
