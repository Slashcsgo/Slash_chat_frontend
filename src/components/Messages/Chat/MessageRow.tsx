import { FunctionComponent } from "react";
import { LongPressEventType, useLongPress } from "use-long-press";
import { User } from "../../../types";
import { Message } from "../../../types";
import { UserPicture } from "../../UserPicture";
import { MessageBlock } from "./MessageBlock";

type Props = {
  message: Message,
  user: User | null,
  contextCallback: (coordinates: { x: number, y: number }) => void
}

export const MessageRow: FunctionComponent<Props> = ({message, user, contextCallback}) => {
  const bind = useLongPress((event) => {
    const native = event.nativeEvent as PointerEvent
    native.preventDefault()
    contextCallback({ x: native.pageX, y: native.pageY })
  }, {
    detect: LongPressEventType.Touch,
    captureEvent: true
  })

  const onContext: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    contextCallback({x: event.pageX, y: event.pageY})
  }

  const isForeign = message.user.id !== user?.id

  return (
    <div className={`message-row${isForeign ? " foreign" : ""}`} onContextMenu={onContext} {...bind()}>
      {isForeign && 
        <UserPicture letter={message.user.name[0]} size="small"
          colorId={message.user.name.length + message.user.name.charCodeAt(0)} />
      }
      <MessageBlock content={message.content} isForeign={isForeign} />
    </div>
  ) 
}