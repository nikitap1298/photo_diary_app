import React from "react"
import UserRow from "./UserRow"
import { UserInterface } from "../../lib/interfaces/user.interface"
import { useUserHandlingContext } from "../../context/UserHandlingContext"

interface UserRowsProps {
  isOwner: boolean
}
export default function UserRows(props: UserRowsProps): JSX.Element {
  const { isOwner } = props
  const { diaryUsers, removeUserFromDiary } = useUserHandlingContext()
  
  return (
    <>
      {diaryUsers.map((user: UserInterface) => (
        <UserRow key={user.id} user={user} isOwner={isOwner} onRemove={removeUserFromDiary} />
      ))}
    </>
  )
}
