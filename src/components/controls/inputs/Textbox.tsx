import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  placeholder: string,
  name: string,
  register: UseFormRegister<FieldValues>,
  params?: {
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    pattern?: RegExp,
  },
  initValue: string | undefined,
  clearOnEnter?: boolean,
  clearOnEsc?: boolean,
  onEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>
  onEsc?: React.KeyboardEventHandler<HTMLTextAreaElement>
}

export const Textbox: FunctionComponent<Props> = ({
  placeholder, name, register, params,
  initValue, clearOnEnter, clearOnEsc, 
  onEnter, onEsc
}) => {
  const {ref, ...rest} = register(name, {...params})
  const [text, setText] = useState(initValue)

  useEffect(() => {
    setText(initValue)
  }, [initValue])
  
  const adjast = useCallback((target: EventTarget) => {
    const current = target as HTMLTextAreaElement
    if (current) {
      current.style.height = "1px"
      if (current.scrollHeight > current.offsetHeight) {
        current.style.height = current.scrollHeight + "px"
      }
    }
  }, [])

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setText((e.target as HTMLTextAreaElement).value)
    adjast(e.target)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (!e.shiftKey) {
      if (e.code === "Enter") {
        e.preventDefault()
        if (onEnter) onEnter(e)
        if (clearOnEnter) setText("")
      }
      if (e.code === "Escape") {
        e.preventDefault()
        if (onEsc) onEsc(e)
        if (clearOnEsc) setText("")
      }
    }
  }

  return (
    <div className="textbox-wrapper">
      <textarea onKeyDown={handleKeyDown}
        onInput={onInput} placeholder={placeholder}
        value={text}
        rows={1} {...register(name, {...params})}
      />
    </div>
  )
}