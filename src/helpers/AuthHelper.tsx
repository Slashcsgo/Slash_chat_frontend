import { useQuery } from "@apollo/client"
import { FunctionComponent, ReactNode } from "react"
import { Navigate } from "react-router-dom"
import MeSchema from "../api/schemas/queries/Me.graphql"
import { PageLayout } from "../components/layouts/PageLayout"
import { CircleLoader } from "../components/Loaders/CircleLoader"

type Props = {
  children: ReactNode
}


export const AuthMiddleware: FunctionComponent<Props> = ({children}) => {
  let {loading, error} = useQuery(MeSchema)

  if (loading) {
    return <PageLayout>
      <CircleLoader />
    </PageLayout>
  }

  if (error) {
    return <Navigate to={'/login'} />
  }

  return <>
    {children}
  </>
}

export const setToken = (token: string) => {
  localStorage.setItem("token", token)
}