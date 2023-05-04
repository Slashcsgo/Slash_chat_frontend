import { useReactiveVar } from "@apollo/client";
import { ControlledMenu, MenuItem, ClickEvent, MenuDivider } from "@szhsin/react-menu";
import { FunctionComponent, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { currentUser } from "../../../cache/Auth";
import { Message, Messages } from "../../../cache/Messages";
import { MessageRow } from "./MessageRow";

type Props = {
  messages: Messages
  onDeleteMessage: (messageId: number) => void
  setEditingMessage: (message: Message) => void
}

export const ChatMessages: FunctionComponent<Props> 
  = ({ messages, onDeleteMessage, setEditingMessage }) => {
    const user = useReactiveVar(currentUser)
    const [isOpen, setOpen] = useState(false)
    const anchorPoint = useRef({ x: 0, y: 0 })
    const anchorMessage = useRef<Message>()

    const onContextMenu = (
      coordinates: { x: number, y: number },
      message: Message,
    ) => {
      anchorMessage.current = message
      anchorPoint.current = coordinates
      setOpen(true)
    }

    const editMessageOption = (event: ClickEvent) => {
      if (anchorMessage.current?.id) {
        setEditingMessage({...anchorMessage.current})
      }
    }

    const deleteMessageOption = (event: ClickEvent) => {
      if (anchorMessage.current?.id) {
        onDeleteMessage(anchorMessage.current?.id)
      }
    }

    if (user) {
      return (
        <div className="chat-messages">
          { messages.length ?
            <div className="chat-messages-wrap">
              { messages.slice(0).reverse().map((message, index) => {
                return <MessageRow contextCallback={
                  (coordinates) => {
                    if (message.user.id === user.id) {
                      onContextMenu(coordinates, message)
                    }
                  }
                } key={index} message={message} user={user} />
              })}
            </div> :
            <div className="chat-messages-wrap no-messages">
              <span>Нет сообщений</span>
            </div>
          }
          <ControlledMenu
            anchorPoint={anchorPoint.current}
            state={isOpen ? 'open' : 'closed'}
            direction="right"
            onClose={() => setOpen(false)}
          >
            <MenuItem onClick={(e) => editMessageOption(e)}>
              <span>Редактировать</span>
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={(e) => deleteMessageOption(e)}>
              <span className="danger">Удалить</span>
            </MenuItem>
          </ControlledMenu>
        </div>
      )
    } else {
      return <Navigate to={'/login'} />
    }

  }