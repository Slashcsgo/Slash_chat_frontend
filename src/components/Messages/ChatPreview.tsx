import { FunctionComponent } from "react";
import { UserPicture } from "../UserPicture";

type Props = {
  chat: {
    name: string,
    description: string,
  }
  onClick: () => void
  isSelected: boolean
}

export const ChatPreview: FunctionComponent<Props> = ({chat, onClick, isSelected}) => {
  return <div className={`chat-preview ${isSelected ? "selected" : ""}`} onClick={() => onClick()}>
    <UserPicture letter={chat.name[0]} 
      colorId={chat.name.length + chat.name.charCodeAt(chat.name.length - 1)}/>
    <div className="chat-preview_info">
      <h3>{chat.name}</h3>
      {chat.description 
        ? <span>{chat.description}</span>
        : <span className="no-description">Добавить описание</span>
      }
    </div>
  </div>
}