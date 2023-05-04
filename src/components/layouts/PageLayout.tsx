import { FunctionComponent, ReactNode } from "react"
import "../../styles/base.scss"
import "../../styles/text.scss"
import "../../styles/inputs.scss"
import "../../styles/buttons.scss"
import "../../styles/forms.scss"
import "../../styles/lists.scss"
import "../../styles/modal.scss"

type Props = {
  children: ReactNode
}

export const PageLayout: FunctionComponent<Props> = ({children}) => {
  return <div className="wrapper">
    {children}
  </div>
}