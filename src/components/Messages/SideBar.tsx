import { useLazyQuery, useQuery, useReactiveVar } from "@apollo/client";
import { FunctionComponent } from "react";
import { chats, messageList, selectedChatId } from "../../cache/Messages";
import { Button } from "../controls/buttons/Button";
import { UserPicture } from "../UserPicture";
import { ChatList } from "./ChatList";
import { CurrentUser } from "./CurrentUser";
import { SideBarFooter } from "./SideBarFooter";
import ChatSchema from "../../api/schemas/Chat.graphql"

export const SideBar: FunctionComponent = () => {
  const chatsList = useReactiveVar(chats)
  const messagesList = useReactiveVar(messageList)
  const chatId = useReactiveVar(selectedChatId)
  
  const [getChat] = useLazyQuery(ChatSchema, {
    fetchPolicy: 'network-only'
  })

  const selectChat = (id: number) => {
    if (id !== chatId) {
      selectedChatId(id)
      getChat({
        variables: {
          id: id
        },
        onCompleted(data) {
          if (data && data.chats && data.chats.length) {
            if (data.chats && data.chats.length) {
              const {users_chats, ...chat} = data.chats[0]
              const usersInChat = users_chats.map((e: {user: {id: number, name: string}}) => e.user)
              const newChat = {
                ...chat,
                users: usersInChat
              }

              chats({...chatsList, [id]: newChat})
            }
            if (data.messages && Array.isArray(data.messages)) {
              messageList({...messagesList, [id]: data.messages})
            }
          } 
        },
        onError(error) {
          console.log(error)
        },
      })
    }
  }

  return <div className="messages-sidebar">
    <CurrentUser />
    <ChatList selectChat={selectChat} selectedChatId={chatId || undefined} />
    <SideBarFooter selectChat={selectChat} />
  </div>
}