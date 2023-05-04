import { useReactiveVar } from "@apollo/client";
import { FunctionComponent } from "react";
import { chatsPreviews } from "../../cache/Messages";
import { ChatPreview } from "./ChatPreview";

type Props = {
  selectChat: (id: number) => void
  selectedChatId?: number
}

export const ChatList: FunctionComponent<Props> 
  = ({ selectChat, selectedChatId }) => {
    const chatsPreviewsData = useReactiveVar(chatsPreviews)

    return <div className="chat-list">
      <h4 className="hide-sm">Список чатов</h4>
      <h4 className="show-sm">Чаты</h4>
      {chatsPreviewsData?.map((chat) => {
        return <ChatPreview onClick={() => { selectChat(chat.id) }} 
          key={chat.id} chat={{name: chat.title, ...chat}} isSelected={chat.id === selectedChatId}/>
      })}
    </div>
  }