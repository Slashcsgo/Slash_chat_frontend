import { FunctionComponent, MouseEventHandler, ReactNode } from "react";

type Props = {
  children: ReactNode
  onClick: MouseEventHandler<HTMLButtonElement>
  className?: string
}

export const Button: FunctionComponent<Props> = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className={`active ${className}`}>
      {children}
    </button>
  ) 
}