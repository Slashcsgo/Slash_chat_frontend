import { FunctionComponent, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Chat, Message, Messages } from "../../../cache/Messages";
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

    const beforeDelete = (messageId: number) => {
      if (messageId === editingMessage?.id) {
        setEditingMessage(undefined)
        onDeleteMessage(messageId)
      } else {
        onDeleteMessage(messageId)
      }
    }

    const onSubmit: SubmitHandler<FieldValues> = (formData) => {
      if (editingMessage) {
        onEditMessage(formData, editingMessage.id)
        setEditingMessage(undefined)
      } else {
        onSendMessage(formData)
      }
    }

    return (
      <div className="chat">
          <ChatHeader chat={chat}/>
          <ChatMessages 
            messages={messages} 
            onDeleteMessage={beforeDelete} 
            setEditingMessage={(message: Message) => setEditingMessage(message)} 
          />
          <ChatInput onSubmit={onSubmit} 
            closeEditingMessage={() => setEditingMessage(undefined)} 
            editingMessage={editingMessage}
          />
      </div>
    )
  }