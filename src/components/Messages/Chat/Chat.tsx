import { useApolloClient, useMutation, useQuery, useReactiveVar, useSubscription } from "@apollo/client";
import { FunctionComponent, useMemo } from "react";
import { selectedChatId } from "../../../api/Cache";
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
import ChatSchema from "../../../api/schemas/queries/Chat.graphql"
import ChatFullSchema from "../../../api/schemas/queries/ChatFull.graphql"
import { Message, Chat as ChatType } from "../../../types";

export const Chat: FunctionComponent = () => {
  const client = useApolloClient()

  const chatId = useReactiveVar(selectedChatId)

  useQuery(ChatSchema, {
    variables: {
      id: chatId
    },
    refetchWritePolicy: 'overwrite',
    fetchPolicy: 'network-only'
  })
  
  const selectedChat: ChatType = client.readQuery({
    query: ChatFullSchema,
    variables: {
      id: chatId
    }
  })?.chat

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
        removeMessage(data)
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
    const appendedUser = client.cache.identify({ id: user.id, __typename: 'users' })

    client.cache.modify({
      id: client.cache.identify({ id: chatId, __typename: 'chats' }),
      fields: {
        users_chats(value) {
          return [
            ...value,
            {
              __typename: 'users_chats',
              user: {
                __ref: appendedUser
              }
            }
          ]
        }
      }
    })
  }

  const removeUser = (userId: number) => {
    const userToRemove = client.cache.identify({ id: userId, __typename: 'users' })

    client.cache.modify({
      id: client.cache.identify({ id: chatId, __typename: 'chats' }),
      fields: {
        users_chats(value: {user: {__ref: string}}[]) {
          return value.filter(e => e.user.__ref !== userToRemove)
        }
      }
    })
  }

  const insertMessage = (message: Message) => {
    const cachedMessage = client.cache.identify(message)
    client.cache.modify({
      id: client.cache.identify(selectedChat),
      fields: {
        messages: (value) => [...value, {__ref: cachedMessage}]
      }
    })
  }

  const updateMessage = (message: Message) => {
    client.cache.modify({
      id: client.cache.identify(message),
      fields: {
        content() {
          return message.content
        }
      }
    })
  }

  const removeMessage = (message: Message) => {
    const messageId =  client.cache.identify(message)
    client.cache.modify({
      id: client.cache.identify({id: chatId, __typename: "chats"}),
      fields: {
        messages(value: any[]) {
          return value.filter(e => e.__ref !== messageId)
        }
      }
    })
    client.cache.evict({id: client.cache.identify(message)})
    client.cache.gc()
  }

  const insertOrUpdateMessage = (message: Message) => {
    const isMessageInChat = selectedChat.messages
      .find(e => e.id === Number(message.id))
    if (isMessageInChat) {
      updateMessage(message)
    } else {
      insertMessage(message)
    }
  }

  const onDeleteMessage
    = (messageId: number) => {
      deleteMessage({
        variables: {
          id: messageId
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
    }

  if (chatId) {
    if (selectedChat && selectedChat.messages) {
      return (
          <ChatSelected 
            onSendMessage={onSendMessage}
            onDeleteMessage={onDeleteMessage} 
            onEditMessage={onEditMessage}
            chat={selectedChat} 
            messages={selectedChat.messages} />
        )
    } else {
      return <ChatLoading />
    }
  } else {
    return <ChatNotSelected />
  }
}