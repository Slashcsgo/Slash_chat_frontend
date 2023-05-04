import { FunctionComponent } from "react";

type Props = {
  content: string,
  isForeign: boolean
}

export const MessageBlock: FunctionComponent<Props> = ({content, isForeign}) => {
  return (
    <div className={`message-block${isForeign ? " foreign" : ""}`}>
      <span>
        {content}
      </span>
    </div>
  )
}