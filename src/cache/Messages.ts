import { makeVar, ReactiveVar } from "@apollo/client";
import { User } from "./Auth";

export type ChatsPreviews = {
  id: number,
  title: string,
  description: string
}

export type Chat = {
  id: number,
  title: string,
  description: string,
  admin_id: number,
  users: User[]
}

export type Message = {
  id: number,
  content: string,
  created_at: Date,
  chat_id: number,
  user: {
    id: number,
    name: string
  }
}

export type Messages = Message[]

type Chats = {
  [index: number]: Chat
}

export type MessagesByChat = {
  [index: number]: Messages
}

export const chatsPreviews: ReactiveVar<ChatsPreviews[] | null>
  = makeVar<ChatsPreviews[] | null>(null)

export const selectedChatId: ReactiveVar<number | null>
  = makeVar<number | null>(null)

export const chats: ReactiveVar<Chats>
  = makeVar<Chats>({})

export const messageList: ReactiveVar<MessagesByChat>
  = makeVar<MessagesByChat>({})
  
export const deleteMessageFromState = (messageId: number, chatId: number) => {
  const messagesByChat = messageList()
  let chatMessages = [...messagesByChat[chatId]]

  if (chatMessages) {
    const messageIndex = chatMessages.findIndex(e => e.id === messageId)
    if (messageIndex !== -1) {
      chatMessages.splice(messageIndex, 1)
      messageList({...messageList(), [chatId]: chatMessages})
    }
  }
}