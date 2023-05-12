import { useReactiveVar } from "@apollo/client";
import { FunctionComponent } from "react";
import { selectedChatId } from "../../api/Cache";
import { ChatList } from "./ChatList";
import { CurrentUser } from "./CurrentUser";
import { SideBarFooter } from "./SideBarFooter";

export const SideBar: FunctionComponent = () => {
  const chatId = useReactiveVar(selectedChatId)

  const selectChat = (id: number) => {
    if (id !== chatId) {
      selectedChatId(id)
    }
  }

  return <div className="messages-sidebar">
    <CurrentUser />
    <ChatList selectChat={selectChat} selectedChatId={chatId || undefined} />
    <SideBarFooter selectChat={selectChat} />
  </div>
}