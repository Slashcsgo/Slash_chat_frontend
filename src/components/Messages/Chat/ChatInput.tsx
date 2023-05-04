import { FunctionComponent } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Message } from "../../../cache/Messages";
import { MessageForm } from "../../controls/forms/MessageForm";

type Props = {
  onSubmit: SubmitHandler<FieldValues>
  closeEditingMessage: () => void
  editingMessage: Message | undefined
}

export const ChatInput: FunctionComponent<Props> = ({ onSubmit, closeEditingMessage, editingMessage }) => {
  return (
    <div className="chat-input">
      <MessageForm onSubmit={ onSubmit } 
        closeEditingMessage={closeEditingMessage} 
        editingMessage={editingMessage} 
      />
    </div>
  )
}