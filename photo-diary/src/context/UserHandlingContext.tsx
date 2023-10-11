import React, { useContext, useEffect, useState } from "react"
import { ContextProviderProps } from "../lib/custom-types/custom-types"
import { UserHandlingService } from "../services/user-handling-service"
import { useDiaryContext } from "./DiaryContext"
import { UserInterface } from "../lib/interfaces/user.interface"
import { User } from "../model/user.model"
import { useToastContext } from "./ToastContext"
import { useUserContext } from "./UserContext"
import { ApiErrorInterface } from "../lib/interfaces/api-error.interface"

interface UserHandlingContextInterface {
  diaryUsers: UserInterface[]
  inviteUser: (email: string) => void
  removeUserFromDiary: (user: UserInterface) => void
}

const UserHandlingContext = React.createContext<UserHandlingContextInterface>({
  diaryUsers: [],
  inviteUser: () => void {},
  removeUserFromDiary: () => void {},
})

export const UserHandlingContextProvider = ({ children }: ContextProviderProps): JSX.Element => {
  const { addToast } = useToastContext()
  const { currentUser } = useUserContext()
  const { currentDiary, refreshDiary } = useDiaryContext()
  const [diaryUsers, setDiaryUsers] = useState<UserInterface[]>([])

  const userHandlingService = new UserHandlingService()

  useEffect(() => {
    fetchDiaryUsers()
  }, [])

  const fetchDiaryUsers = async (): Promise<void> => {
    try {
      userHandlingService.readDiaryUsers(currentDiary).then((d) => {
        const data = d as UserInterface[]
        const users: UserInterface[] = []
        data.forEach((i) => {
          const user = new User().deserialize(i)
          users.push(user)
        })
        setDiaryUsers(users)
      })
    } catch (err) {
      throw new Error(`Error with fetchDiaryUsers: ${err}`)
    }
  }
  const inviteUser = async (email: string): Promise<void> => {
    try {
      await userHandlingService.inviteUser(currentDiary, email).then(() => {
        fetchDiaryUsers()
        refreshDiary()
      })
    } catch (err) {
      const error = err as ApiErrorInterface
      addToast({
        message: error.resultJSON.message,
        variant: "danger",
        isAutohide: true,
      })
      throw new Error(`Error with inviteUser: ${err}`)
    }
  }

  const removeUserFromDiary = async (user: UserInterface): Promise<void> => {
    try {
      await userHandlingService.removeUserFromDiary(currentDiary, user).then(() => {
        fetchDiaryUsers()
        refreshDiary()

        // Reload the page if user left the diary
        currentUser?.id === user.id ? window.location.reload() : null
      })
    } catch (err) {
      throw new Error(`Error with removeUserFromDiary: ${err}`)
    }
  }

  return (
    <UserHandlingContext.Provider
      value={{
        diaryUsers,
        inviteUser,
        removeUserFromDiary,
      }}
    >
      {children}
    </UserHandlingContext.Provider>
  )
}

export const useUserHandlingContext = (): UserHandlingContextInterface =>
  useContext(UserHandlingContext)
