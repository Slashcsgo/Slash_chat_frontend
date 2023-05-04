import { FunctionComponent } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

export type InputProps = {
  placeholder: string,
  name: string,
  size?: "small" | "medium" | "big"
  width?: "initial" | "full"
  type?: "text" | "number" | "email" | "password"
  register: UseFormRegister<FieldValues>
  params?: {
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    pattern?: RegExp
  }
  error?: string
}

export const Input: FunctionComponent<InputProps> = 
  ({ placeholder, name, type, register, params, size="small", width="initial", error }) => {
    return (
      <div className="input-wrapper">
        <input className={`${size} ${width === 'full' ? width : ''}`} 
          type={type} placeholder={placeholder} {...register(name, { ...params })} />
        { error && <span className="error">{error}</span> }
      </div>
    )
  }