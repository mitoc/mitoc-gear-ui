import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

type Props = {
  onClick: () => void;
  icon: IconProp;
  text: string;
  size?: string;
  fontSize?: number;
};

export function PicturePlaceholder({
  onClick,
  icon,
  text,
  size,
  fontSize = 1,
}: Props) {
  const iconFontSize = Math.min(fontSize * 50, 100);
  const thickness = `${fontSize * 4}px`;
  return (
    <PictureButton onClick={onClick} size={size} thickness={thickness}>
      <div>
        <div style={{ fontSize: iconFontSize }}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <p style={{ fontSize: `${fontSize ?? 1}rem` }}>{text}</p>
      </div>
    </PictureButton>
  );
}

const PictureButton = styled.button.attrs({
  className: "d-flex align-items-center justify-content-center text-center",
})<{ size?: string; thickness: string }>`
  &:hover {
    color: var(--bs-link-color);
    background:
      linear-gradient(
          to right,
          var(--bs-link-color) ${({ thickness }) => thickness},
          transparent ${({ thickness }) => thickness}
        )
        0 0,
      linear-gradient(
          to right,
          var(--bs-link-color) ${({ thickness }) => thickness},
          transparent ${({ thickness }) => thickness}
        )
        0 100%,
      linear-gradient(
          to left,
          var(--bs-link-color) ${({ thickness }) => thickness},
          transparent ${({ thickness }) => thickness}
        )
        100% 0,
      linear-gradient(
          to left,
          var(--bs-link-color) ${({ thickness }) => thickness},
          transparent ${({ thickness }) => thickness}
        )
        100% 100%,
      linear-gradient(
          to bottom,
          var(--bs-link-color) ${({ thickness }) => thickness},
          transparent ${({ thickness }) => thickness}
        )
        0 0,
      linear-gradient(
          to bottom,
          var(--bs-link-color) ${({ thickness }) => thickness},
          transparent ${({ thickness }) => thickness}
        )
        100% 0,
      linear-gradient(
          to top,
          var(--bs-link-color) ${({ thickness }) => thickness},
          transparent ${({ thickness }) => thickness}
        )
        0 100%,
      linear-gradient(
          to top,
          var(--bs-link-color) ${({ thickness }) => thickness},
          transparent ${({ thickness }) => thickness}
        )
        100% 100%;
    background-repeat: no-repeat;
    background-size: 50px 50px;
  }

  color: var(--bs-body-color);
  width: 100%;
  border: none;

  & :focus,
  & :focus-visible {
    border: none;
  }
  aspect-ratio: 1/1;
  background:
    linear-gradient(
        to right,
        var(--bs-body-color) ${({ thickness }) => thickness},
        transparent ${({ thickness }) => thickness}
      )
      0 0,
    linear-gradient(
        to right,
        var(--bs-body-color) ${({ thickness }) => thickness},
        transparent ${({ thickness }) => thickness}
      )
      0 100%,
    linear-gradient(
        to left,
        var(--bs-body-color) ${({ thickness }) => thickness},
        transparent ${({ thickness }) => thickness}
      )
      100% 0,
    linear-gradient(
        to left,
        var(--bs-body-color) ${({ thickness }) => thickness},
        transparent ${({ thickness }) => thickness}
      )
      100% 100%,
    linear-gradient(
        to bottom,
        var(--bs-body-color) ${({ thickness }) => thickness},
        transparent ${({ thickness }) => thickness}
      )
      0 0,
    linear-gradient(
        to bottom,
        var(--bs-body-color) ${({ thickness }) => thickness},
        transparent ${({ thickness }) => thickness}
      )
      100% 0,
    linear-gradient(
        to top,
        var(--bs-body-color) ${({ thickness }) => thickness},
        transparent ${({ thickness }) => thickness}
      )
      0 100%,
    linear-gradient(
        to top,
        var(--bs-body-color) ${({ thickness }) => thickness},
        transparent ${({ thickness }) => thickness}
      )
      100% 100%;

  background-repeat: no-repeat;
  background-size: 50px 50px;

  ${(props) => (props.size != null ? `max-width: ${props.size}` : "")}
`;
