import { FunctionComponent } from "react";

type Props = {
  label: string,
}

export const Submit: FunctionComponent<Props> = ({ label }) => {
  return <input className="active" type="submit" value={label} />
}