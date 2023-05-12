import { FunctionComponent, useCallback, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Chat, Message, Messages } from "../../../types";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

type Props = {
  chat: Chat
  messages: Messages
  onSendMessage: SubmitHandler<FieldValues>
  onEditMessage: (formData: FieldValues, messageId: number) => void
  onDeleteMessage: (messageId: number) => void
}

export const ChatSelected: FunctionComponent<Props> 
  = ({
      onSendMessage, onDeleteMessage, onEditMessage,
      chat, messages
    }) => {
    const [editingMessage, setEditingMessage] = useState<Message>()

    const closeEditing = useCallback(() => {
      setEditingMessage(undefined)
    }, [])

    const beforeDelete = useCallback((messageId: number) => {
      if (messageId === editingMessage?.id) {
        setEditingMessage(undefined)
        onDeleteMessage(messageId)
      } else {
        onDeleteMessage(messageId)
      }
    }, [editingMessage?.id])

    const onSubmit = useCallback<SubmitHandler<FieldValues>>((formData) => {
      if (editingMessage) {
        onEditMessage(formData, editingMessage.id)
        setEditingMessage(undefined)
      } else {
        onSendMessage(formData)
      }
    }, [editingMessage?.id])

    return (
      <div className="chat">
          <ChatHeader chat={chat}/>
          <ChatMessages 
            messages={messages} 
            onDeleteMessage={beforeDelete} 
            setEditingMessage={(message: Message) => setEditingMessage(message)} 
          />
          <ChatInput onSubmit={(data) => onSubmit(data)} 
            closeEditingMessage={closeEditing} 
            editingMessage={editingMessage}
          />
      </div>
    )
  }