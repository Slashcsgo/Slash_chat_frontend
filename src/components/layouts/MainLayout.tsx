import { FunctionComponent, ReactNode } from "react";
import { PageLayout } from "./PageLayout";

type Props = {
  children: ReactNode
}

export const MainLayout: FunctionComponent<Props> = ({ children }) => {
  return <PageLayout>
      {children}
  </PageLayout>
}