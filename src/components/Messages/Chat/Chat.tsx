import { useMutation, useReactiveVar, useSubscription } from "@apollo/client";
import { FunctionComponent } from "react";
import { chats, deleteMessageFromState, Message, messageList, Messages, selectedChatId } from "../../../cache/Messages";
import { ChatNotSelected } from "./ChatNotSelected";
import { ChatLoading } from "./ChatLoading";
import { ChatSelected } from "./ChatSelected";
import { FieldValues, SubmitHandler } from "react-hook-form";
import SendMessageSchema from "../../../api/schemas/mutations/SendMessage.graphql"
import DeleteMessageSchema from "../../../api/schemas/mutations/DeleteMessage.graphql"
import EditMessageSchema from "../../../api/schemas/mutations/EditMessage.graphql"
import MessageCreatedSchema from "../../../api/schemas/subscriptions/MessageCreated.graphql"
import MessageEditedSchema from "../../../api/schemas/subscriptions/MessageEdited.graphql"
import MessageDeletedSchema from "../../../api/schemas/subscriptions/MessageDeleted.graphql"
import UserAddedToChatSchema from "../../../api/schemas/subscriptions/UserAddedToChat.graphql"
import UserRemovedFromChatSchema from "../../../api/schemas/subscriptions/UserRemovedFromChat.graphql"
import { User } from "../../../cache/Auth";

export const Chat: FunctionComponent = () => {
  const chatId = useReactiveVar(selectedChatId)
  const chatsList = useReactiveVar(chats)
  const MessagesByChatsList = useReactiveVar(messageList)
  const selectedChat = chatId ? chatsList[chatId] : null
  const selectedChatMessages = chatId ? MessagesByChatsList[chatId] : null
  const [sendMessage] = useMutation(SendMessageSchema)
  const [deleteMessage] = useMutation(DeleteMessageSchema)
  const [editMessage] = useMutation(EditMessageSchema)

  useSubscription(MessageCreatedSchema, {
    variables: {
      chatId: chatId
    },
    onData(result) {
      if (
        result && 
        result.data && 
        result.data.data && 
        result.data.data.messageCreated
      ) {
        const data = result.data.data.messageCreated
        insertOrUpdateMessage(data)
      }
    },
  })

  useSubscription(MessageEditedSchema, {
    variables: {
      chatId: chatId
    },
    onData(result) {
      if (
        result &&
        result.data &&
        result.data.data &&
        result.data.data.messageEdited
      ) {
        const data = result.data.data.messageEdited
        insertOrUpdateMessage(data)
      }
    }
  })

  useSubscription(MessageDeletedSchema, {
    variables: {
      chatId: chatId
    },
    onData(result) {
      if (
        result &&
        result.data &&
        result.data.data &&
        result.data.data.messageDeleted
      ) {
        const data = result.data.data.messageDeleted
        deleteMessageFromState(Number(data.id), Number(data.chat_id))
      }
    }
  })

  useSubscription(UserAddedToChatSchema, {
    variables: {
      chatId: chatId
    },
    onData(result) {
      if (
        result && result.data && result.data.data &&
        result.data.data.userAddedToChat
      ) {
        const data = result.data.data.userAddedToChat
        appendUser({...data, id: Number(data.id)})
      }
    }
  })

  useSubscription(UserRemovedFromChatSchema, {
    variables: {
      chatId: chatId
    },
    onData(result) {
      if (
        result && result.data && result.data.data &&
        result.data.data.userRemovedFromChat
      ) {
        const data = result.data.data.userRemovedFromChat
        removeUser(Number(data.id))
      }
    }
  })

  const onSendMessage: SubmitHandler<FieldValues> = (formData) => {
    const message = formData.message
    if (message) {
      sendMessage({
        variables: {
          chatId: Number(chatId),
          content: message
        },
      })
    }
  }

  const appendUser = (
    user: {
      id: number,
      name: string
    }
  ) => {
    console.log(user)
    let newChatsList = {...chatsList}
    newChatsList[chatId as number]
      .users.push(user as User)

    chats(newChatsList)
  }

  const removeUser = (userId: number) => {
    if (chatId) {
      let newChatsList = {...chatsList}
      newChatsList[chatId].users = 
        newChatsList[chatId].users.filter(e => e.id !== userId)
    }
  }

  const insertMessage
    = (message: Message) => {
      if (chatId) {
        const newMessages: Messages = Array.from(MessagesByChatsList[chatId])
        newMessages.push({
          id: message.id,
          content: message.content,
          user: message.user,
          created_at: message.created_at,
          chat_id: message.chat_id
        })
        MessagesByChatsList[chatId] = newMessages
        messageList(MessagesByChatsList)
      }
    }

  const updateMessage
    = (message: Message, index: number) => {
      if (chatId) {
        const newMessages: Messages = Array.from(MessagesByChatsList[chatId])
        newMessages[index] = message
        MessagesByChatsList[chatId] = newMessages
        messageList(MessagesByChatsList)
      }
    }

  const insertOrUpdateMessage = (message: Message) => {
    const messageData: Message = {
      id: Number(message.id),
      chat_id: Number(message.chat_id),
      content: message.content,
      created_at: message.created_at,
      user: {
        id: Number(message.user.id),
        name: message.user.name
      }
    }
    const messageIndex = MessagesByChatsList[message.chat_id]
      .findIndex((element) => element.id === messageData.id)

    if (messageIndex === -1) {
      insertMessage(messageData)
    } else {
      updateMessage(messageData, messageIndex)
    }
  }

  const onDeleteMessage
    = (messageId: number) => {
      deleteMessage({
        variables: {
          id: messageId
        }
      }).then((result) => {
        if (result && result.data && result.data.deleteMessage) {
          const message: { id: string, chat_id: string } = result.data.deleteMessage
          deleteMessageFromState(Number(message.id), Number(message.chat_id))
        }
      })
    }

  const onEditMessage
    = (formData: FieldValues, messageId: number) => {
      editMessage({
        variables: {
          id: messageId,
          content: formData.message
        }
      })
      if (chatId) {
        const messageIndex = MessagesByChatsList[chatId]
          .findIndex(element => element.id === messageId)
        const newMessage = MessagesByChatsList[chatId][messageIndex]
        newMessage.content = formData.message
        if (messageIndex !== -1) {
          updateMessage(newMessage, messageIndex)
        }
      }
    }

  if (chatId) {
    if (selectedChat && selectedChatMessages) {
      return (
          <ChatSelected 
            onSendMessage={onSendMessage}
            onDeleteMessage={onDeleteMessage} 
            onEditMessage={onEditMessage}
            chat={selectedChat} 
            messages={selectedChatMessages} />
        )
    } else {
      return <ChatLoading />
    }
  } else {
    return <ChatNotSelected />
  }
}