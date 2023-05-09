import { useQuery, useReactiveVar, useSubscription } from "@apollo/client";
import { MainLayout } from "../components/layouts/MainLayout";
import { Chat } from "../components/Messages/Chat/Chat";
import { SideBar } from "../components/Messages/SideBar";
import { chats, ChatsPreviews, chatsPreviews, selectedChatId } from "../cache/Messages";
import { users } from "../cache/Users";
import ChatsSchema from "../api/schemas/queries/ChatsPreviews.graphql";
import UsersSchema from "../api/schemas/queries/Users.graphql";
import ChatModifiedSchema from "../api/schemas/subscriptions/ChatModified.graphql"
import ChatAddedSchema from "../api/schemas/subscriptions/ChatAdded.graphql"
import ChatRemovedSchema from "../api/schemas/subscriptions/ChatRemoved.graphql"

export default function Messages() {
  const previews = useReactiveVar(chatsPreviews)
  const chatsList = useReactiveVar(chats)
  const chatId = useReactiveVar(selectedChatId)

  useQuery(ChatsSchema, {
    onCompleted(data) {
      chatsPreviews(data.chats)
    },
  })

  useSubscription(ChatModifiedSchema, {
    onData(payload) {
      if (
        payload && payload.data &&
        payload.data.data && payload.data.data.chatModified
      ) {
        const data = payload.data.data.chatModified
        updateChat(data)
      }
    }
  })

  useSubscription(ChatAddedSchema, {
    onData(payload) {
      if (
        payload && payload.data &&
        payload.data.data && payload.data.data.chatAdded
      ) {
        const data = payload.data.data.chatAdded
        insertChat(data)
      }
    }
  })

  useSubscription(ChatRemovedSchema, {
    onData(payload) {
      if (
        payload && payload.data &&
        payload.data.data && payload.data.data.chatRemoved
      ) {
        const data = payload.data.data.chatRemoved
        deleteChat(Number(data.id))
      }
    }
  })

  useQuery(UsersSchema, {
    onCompleted(data) {
      users(data.users)
    }
  })

  const updateChat = (chatPreview: ChatsPreviews) => {
    const newPreview = Array.from(previews as ChatsPreviews[])
    const previewIndex = newPreview.findIndex(e => e.id === Number(chatPreview.id))
    newPreview[previewIndex] = {
      id: Number(chatPreview.id),
      description: chatPreview.description,
      title: chatPreview.title
    }

    if (chatsList[chatPreview.id]) {
      const newChat = {
        ...chatsList[chatPreview.id],
        title: chatPreview.title,
        description: chatPreview.description
      }

      chats({...chatsList, [chatPreview.id]: newChat})
    }

    chatsPreviews(newPreview)
  }

  const insertChat = (chatPreview: ChatsPreviews) => {
    const newPreview = Array.from(previews as ChatsPreviews[])
    newPreview.push({...chatPreview, id: Number(chatPreview.id)})
    chatsPreviews(newPreview)
  }

  const deleteChat = (id: number) => {
    const newPreviews = previews?.filter(e => e.id !== id)
    chatsPreviews(newPreviews)
    if (chatId === id) {
      selectedChatId(undefined)
    }
  }

  return <MainLayout>
    <div className="messages-wrap">
      <SideBar />
      <Chat />
    </div>
  </MainLayout>
}