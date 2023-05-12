import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { MainLayout } from "../components/layouts/MainLayout";
import { Chat } from "../components/Messages/Chat/Chat";
import { SideBar } from "../components/Messages/SideBar";
import { selectedChatId } from "../api/Cache";
import ChatsSchema from "../api/schemas/queries/ChatsPreviews.graphql";
import UsersSchema from "../api/schemas/queries/Users.graphql";
import ChatModifiedSchema from "../api/schemas/subscriptions/ChatModified.graphql"
import ChatAddedSchema from "../api/schemas/subscriptions/ChatAdded.graphql"
import ChatRemovedSchema from "../api/schemas/subscriptions/ChatRemoved.graphql"
import { ChatsPreviews } from "../types";

export default function Messages() {
  const client = useApolloClient()

  useQuery(ChatsSchema)

  useQuery(UsersSchema)

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

  const updateChat = (chatPreview: ChatsPreviews) => {
    client.cache.modify({
      id: client.cache.identify({ id: Number(chatPreview.id), __typename: 'chats'}),
      fields: {
        title: () => chatPreview.title,
        description: () => chatPreview.description
      }
    })
  }

  const insertChat = (chatPreview: ChatsPreviews) => {
    client.writeQuery({
      query: ChatsSchema,
      data: {
        chats: [
          chatPreview
        ]
      }
    })
  }

  const deleteChat = (id: number) => {
    const normalizedId = client.cache.identify({ id, __typename: 'chats' })
    client.cache.evict({id: normalizedId})
    client.cache.gc()
    selectedChatId(null)
  }

  return <MainLayout>
    <div className="messages-wrap">
      <SideBar />
      <Chat />
    </div>
  </MainLayout>
}