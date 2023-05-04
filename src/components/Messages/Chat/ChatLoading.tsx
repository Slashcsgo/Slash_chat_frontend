import { FunctionComponent } from "react";
import { CircleLoader } from "../../Loaders/CircleLoader";

export const ChatLoading: FunctionComponent = () => {
  return (
    <div className="chat">
      <CircleLoader />
    </div>
  ) 
}