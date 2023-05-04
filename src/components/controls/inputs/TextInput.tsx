import { FunctionComponent } from "react";
import { Input, InputProps } from "./Input";

export const TextInput: FunctionComponent<InputProps> = (props) => {
  return <Input {...props} type="text" />
}