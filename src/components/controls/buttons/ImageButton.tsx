import { FunctionComponent, MouseEventHandler } from "react";

type Props = {
  image: string,
  alt: string,
  onClick?: MouseEventHandler,
  type?: 'submit' | 'reset' | 'button' | undefined,
  className?: string
}

export const ImageButton: FunctionComponent<Props> = ({ image, onClick, alt, type="submit", className }) => {
  return <button type={type} className={`button button-image ${className}`} onClick={onClick}>
    <img src={image} alt={alt} />
  </button>
}