import { useApolloClient } from "@apollo/client";
import { FunctionComponent } from "react";
import { ChatPreview } from "./ChatPreview";
import ChatPreviewsSchema from "../../api/schemas/queries/ChatsPreviews.graphql"
import { ChatsPreviews } from "../../types";

type Props = {
  selectChat: (id: number) => void
  selectedChatId?: number
}

export const ChatList: FunctionComponent<Props> 
  = ({ selectChat, selectedChatId }) => {
    const client = useApolloClient()

    const chatsPreviews: ChatsPreviews[] = client.readQuery({
      query: ChatPreviewsSchema
    })?.chats

    return <div className="chat-list">
      <h4 className="hide-sm">Список чатов</h4>
      <h4 className="show-sm">Чаты</h4>
      {chatsPreviews?.map((chat) => {
        return <ChatPreview onClick={() => { selectChat(chat.id) }} 
          key={chat.id} chat={{name: chat.title, ...chat}} isSelected={chat.id === selectedChatId}/>
      })}
    </div>
  }