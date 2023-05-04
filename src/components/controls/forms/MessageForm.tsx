import { FunctionComponent, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ImageButton } from "../buttons/ImageButton";
import { Textbox } from "../inputs/Textbox";
import { Message } from "../../../cache/Messages";
import SendImage from "../../../static/images/send.svg"
import CancelImage from "../../../static/images/cancel.svg"

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

    const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>
      = (event) => {
        if (event.code === "Enter" && !event.shiftKey) {
          event.preventDefault()
          handleEnterKey(event)
        }
      }

    const handleEnterKey: React.KeyboardEventHandler<HTMLTextAreaElement> 
      = (event) => {
        const target = event.target as HTMLTextAreaElement
        onSubmit({
          message: target.value
        })
        target.value = ""
      }

    return (
      <form onSubmit={handleSubmit((data) => {
        resetField("message")
        onSubmit(data)
      }, onError)} className="message-form">
        {(editingMessage && true) &&
          <div className="message-form__info">
            {editingMessage &&
              <>
                <span>{editingMessage.content}</span>
                <ImageButton type="button" image={CancelImage} onClick={() => {
                  closeEditingMessage()
                  resetField("message")
                }} alt="Отменить" />
              </>
            }
          </div>
        }
        <div className="message-form__controls">
          <Textbox register={register} params={{required: true, maxLength: 2000, }} 
            placeholder="Введите сообщение" name="message" onKeyDown={onKeyDown} 
            initValue={editingMessage?.content} 
          />
          <ImageButton image={SendImage} onClick={() => { trigger() }} alt="Отправить" />
        </div>
      </form>
    ) 
  }