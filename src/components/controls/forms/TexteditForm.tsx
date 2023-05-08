import { FunctionComponent, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ImageButton } from "../buttons/ImageButton";
import { Textbox } from "../inputs/Textbox";
import CheckmarkImage from "../../../static/images/checkmark.svg"
import CancelImage from "../../../static/images/cancel-red.svg"

type Props = {
  onSubmit: SubmitHandler<FieldValues>
  close: () => void
  placeholder: string
  params?: {
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    pattern?: RegExp,
  },
  name: string,
  value: string
}

export const TexteditForm: FunctionComponent<Props> 
  = ({ onSubmit, close, placeholder, params, name, value}) => {
    const { register, handleSubmit, setFocus } = useForm()

    useEffect(() => {
      setFocus(name)
    }, [setFocus])

    const handleEnterKey: React.KeyboardEventHandler<HTMLTextAreaElement> 
      = (event) => {
        const target = event.target as HTMLTextAreaElement
        onSubmit({
          [name]: target.value
        })
        target.value = ""
      }

    return (
      <form onSubmit={handleSubmit(onSubmit, close)}
        className="textedit-form"
      >
        <Textbox register={register} params={params}
          placeholder={placeholder} name={name} 
          initValue={value} clearOnEnter={true} clearOnEsc={true} 
          onEnter={handleEnterKey} onEsc={() => close()}
        />
        <ImageButton image={CheckmarkImage} 
          alt="Сохранить" />
        <ImageButton image={CancelImage} type="button"
          alt="Сохранить" onClick={() => {close()}} />
      </form>
    )
  }