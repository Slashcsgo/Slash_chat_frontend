import { FunctionComponent, useState } from "react";
import { Button } from "../controls/buttons/Button";
import ReactModal from "react-modal"
import { NewChatForm } from "../controls/forms/NewChatForm";
import { ImageButton } from "../controls/buttons/ImageButton";
import SendMessageIcon from "../../static/images/new-chat.svg";

type Props = {
  selectChat: (id: number) => void
}

export const SideBarFooter: FunctionComponent<Props> = ({ selectChat }) => {
  const [isOpen, setOpen] = useState(false)

  const onSuccess = (id: number) => {
    setOpen(false)
    selectChat(id)
  }

  return (
    <div className="sidebar-footer">
      <Button className="hide-xs" onClick={() => setOpen(true)}>Создать чат</Button>
      <ImageButton image={SendMessageIcon} alt="Создать" className="show-xs" onClick={() => setOpen(true)} />
      <ReactModal className="modal" overlayClassName="overlay" isOpen={isOpen} contentLabel="Создать чат"
        parentSelector={() => document.querySelector('.wrapper') as HTMLElement}
        onRequestClose={() => setOpen(false)} ariaHideApp={false}
      >
         <NewChatForm onSuccessCallback={onSuccess} />
      </ReactModal>
    </div>
  )
}