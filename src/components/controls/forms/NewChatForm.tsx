import { FunctionComponent, useState } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Submit } from "../buttons/Submit";
import { TextInput } from "../inputs/TextInput";
import AddChatSchema from "../../../api/schemas/mutations/AddChat.graphql"
import { useMutation, useReactiveVar } from "@apollo/client";
import { chats, chatsPreviews } from "../../../cache/Messages";

type Props = {
  onSuccessCallback: (id: number) => void
}

type Errors = {
  title?: string,
  description?: string
}

interface IObject<T> {
  [index: string]: T | undefined
}

export const NewChatForm: FunctionComponent<Props>
  = ({ onSuccessCallback }) => {
    const { register, handleSubmit} = useForm()
    const [mainError, setMainError] = useState<String>()
    const [errors, setErrors] = useState<Errors>({})
    const [addChat] = useMutation(AddChatSchema)
    const chatsPreviewsList = useReactiveVar(chatsPreviews)

    const onSuccess: SubmitHandler<FieldValues> = (formData) => {
      setErrors({})
      const optimisticChatsPreviews = Array.from(chatsPreviewsList || [])
      optimisticChatsPreviews.push({
        title: formData.title,
        description: formData.description,
        id: 0
      })
      chatsPreviews(optimisticChatsPreviews)
      addChat({
        variables: {
          title: formData.title,
          description: formData.description
        }
      }).then(result => {
        if (result && result.data && result.data.addChat) {
          const payload = result.data.addChat

          const newChat = {...payload, id: Number(payload.id)}
          const newChatsPreviews = Array.from(chatsPreviewsList || [])
          newChatsPreviews.push(newChat)
          chatsPreviews(newChatsPreviews)
          onSuccessCallback(newChat.id)
        }
      }).catch(() => {
        setMainError("Неопознанная ошибка, попробуйте позже")
      })
    }

    const onError: SubmitErrorHandler<FieldValues> = (errors) => {
      const messages: IObject<IObject<string>> = {
        "title": {
          "required": "Введите название чата",
          "maxLength": "Название должно быть менее 255 символов"
        },
        "description": {
          "required": "Введите описание чата",
          "maxLength": "Описание чата должно быть менее 255 символов"
        }
      }
      let errorMessages: IObject<string> = {}
      for (let error in errors) {
        errorMessages[error] = messages[error]?.[String(errors[error]?.type)] || undefined
      }
      setErrors(errorMessages)
    }

    return (
      <form onSubmit={handleSubmit(onSuccess, onError)} className="chat-form">
        <h2>Создать чат</h2>
        <div className="chat-form__inputs">
          { mainError && <span className="error">{mainError}</span> }
          <TextInput placeholder="Название" name="title" register={register}
            params={{required: true, maxLength: 255}} error={errors.title}/>
          <TextInput placeholder="Описание" name="description" register={register}
            params={{required: true, maxLength: 255}} error={errors.description}/>
        </div>
        <Submit label="Создать" />
      </form>
    )
  }