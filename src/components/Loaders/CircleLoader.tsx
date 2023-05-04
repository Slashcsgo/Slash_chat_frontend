import { FunctionComponent } from "react";
import LoadingCircle from "../../static/images/loading-circle.svg" 
import "../../styles/loaders.scss"

export const CircleLoader: FunctionComponent = () => {
  return (
    <div className="loader-wrap">
      <img className="loader circle" src={LoadingCircle}></img>
    </div>
  )
}