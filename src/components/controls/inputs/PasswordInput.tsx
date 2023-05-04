import { FunctionComponent } from "react";
import { Input, InputProps } from "./Input";

export const PasswordInput: FunctionComponent<InputProps> = (props) => {
  return <Input {...props} type="password" />
}