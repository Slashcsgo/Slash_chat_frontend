export type User = {
  id: number,
  name: string,
  description: string,
  email: string,
}

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
  users_chats: [{
    user: User
  }],
  messages: Messages
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

export type Chats = {
  [index: number]: Chat
}