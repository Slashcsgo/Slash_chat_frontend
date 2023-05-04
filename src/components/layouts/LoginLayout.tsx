import { FunctionComponent, ReactNode } from "react";
import { PageLayout } from "./PageLayout";

type Props = {
  children: ReactNode
}

export const LoginLayout: FunctionComponent<Props> = ({ children }) => {
  return <PageLayout>
    <div className="login-wrapper">
      {children}
    </div>
  </PageLayout>
}