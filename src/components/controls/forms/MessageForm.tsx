import { FunctionComponent, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ImageButton } from "../buttons/ImageButton";
import { Textbox } from "../inputs/Textbox";
import SendImage from "../../../static/images/send.svg"
import CancelImage from "../../../static/images/cancel.svg"
import { Message } from "../../../types";

type Props = {
  onSubmit: SubmitHandler<FieldValues>
  editingMessage: Message | undefined
  closeEditingMessage: () => void
}

export const MessageForm: FunctionComponent<Props> 
  = ({ onSubmit, editingMessage, closeEditingMessage}) => {
    const {
      register, handleSubmit, trigger, 
      resetField, setFocus
    } = useForm()
    const [error, setError] = useState<string>("")

    useEffect(() => {
      setFocus("message")
    }, [setFocus, editingMessage])

    const onError: SubmitHandler<FieldValues> = (errors) => {
      if (errors.message) {
        if (errors.message.type === 'maxLength') {
          setError("Максимальная длина сообщения 2000 символов")
          setTimeout(() => {
            setError("")
          }, 2000)
        }
      }
    }

    const handleEnterKey: React.KeyboardEventHandler<HTMLTextAreaElement> 
      = (event) => {
        const target = event.target as HTMLTextAreaElement
        onSubmit({
          message: target.value
        })
      }

    return (
      <form onSubmit={handleSubmit((data) => {
        resetField("message")
        onSubmit(data)
      }, onError)} className="message-form">
        {editingMessage &&
          <div className="message-form__info">
            <span>{editingMessage.content}</span>
            <ImageButton type="button" image={CancelImage} onClick={() => {
              closeEditingMessage()
              resetField("message")
            }} alt="Отменить" />
          </div>
        }
        <div className="message-form__controls">
          <Textbox register={register} params={{required: true, maxLength: 2000, }} 
            placeholder="Введите сообщение" name="message" onEnter={handleEnterKey}
            initValue={editingMessage?.content || ""} clearOnEsc={true} clearOnEnter={true}
          />
          <ImageButton image={SendImage} onClick={() => { trigger() }} alt="Отправить" />
        </div>
      </form>
    ) 
  }