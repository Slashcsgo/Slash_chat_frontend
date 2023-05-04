import { FunctionComponent } from "react";

type Props = {
  letter: string,
  colorId: number,
  size?: "small" | "big" | null
}

const colors = [
  "#3A1078",
  "#2F58CD",
  "#3795BD",
  "#43C201",
  "#E3CA00",
  "#D70ED5",
  "#EA0038",
  "#336000"
]

export const UserPicture: FunctionComponent<Props> = ({letter, colorId, size=null}) => {
  const color = colors[colorId % colors.length]
  return <div className={`user-image ${size ? size : ""}`} style={{background: color}}>
    <span className="user-image_letter">{letter.toUpperCase()}</span>
  </div>
}