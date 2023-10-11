import React, { ReactNode } from "react"
import { Redirect } from "react-router"
import { useUserContext } from "../context/UserContext"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useUserContext()

  if (!currentUser?.userName) {
    return <Redirect to="/authentification" />
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default ProtectedRoute
