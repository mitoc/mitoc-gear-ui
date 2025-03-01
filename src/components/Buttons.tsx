import styled from "styled-components";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SquareButton(props: Props) {
  const { className, ...otherProps } = props;
  const btnClassName = "btn btn-outline-secondary " + (className ?? "");
  return <StyledButton className={btnClassName} {...otherProps} />;
}

export function ArchiveButton(props: Omit<Props, "children">) {
  return <SquareButton {...props}>⬇</SquareButton>;
}

export function ToggleExpandButton(
  props: Omit<Props, "children"> & { isOpen: boolean },
) {
  const content = props.isOpen ? "－" : "＋";
  return <SquareButton {...props}>{content}</SquareButton>;
}

export function RemoveButton(props: Omit<Props, "children">) {
  return <SquareButton {...props}>⨉</SquareButton>;
}

const StyledButton = styled.button`
  height: 40px;
  width: 40px;
`;
