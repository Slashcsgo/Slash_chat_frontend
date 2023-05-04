import { FunctionComponent } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  placeholder: string,
  name: string,
  register: UseFormRegister<FieldValues>,
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
  params?: {
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    pattern?: RegExp,
  },
  initValue: string | undefined
}

export const Textbox: FunctionComponent<Props> 
  = ({placeholder, name, register, params, onKeyDown, initValue}) => {
    const {ref, ...rest} = register(name, {...params})
    const adjast = (target: EventTarget) => {
      const current = target as HTMLTextAreaElement
      if (current) {
        current.style.height = "1px"
        if (current.scrollHeight > current.offsetHeight) {
          current.style.height = current.scrollHeight + "px"
        }
      }
    }
    return (
      <div className="textbox-wrapper">
        <textarea onKeyDown={onKeyDown}
          onInput={(e) => adjast(e.target)} placeholder={placeholder}
          rows={1} {...rest} ref={(element) => {
            ref(element)
            if (element) {
              element.value = initValue || ""
              adjast(element)
              element.setSelectionRange(
                element.value.length, 
                element.value.length
              )
            }
          }}
        />
      </div>
    )
  }