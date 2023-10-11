/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from "react"
import { UserInterface } from "../lib/interfaces/user.interface"
import { ContextProviderProps } from "../lib/custom-types/custom-types"
import { UserService } from "../services/user-service"
import { useIonRouter } from "@ionic/react"
import { isTokenValid } from "../utils/TokenExpiration"
import { Storage } from "@ionic/storage"
import { User } from "../model/user.model"
import { useToastContext } from "./ToastContext"
import { ApiErrorInterface } from "../lib/interfaces/api-error.interface"
import { StorageKeys } from "../lib/enums/StorageKeys"

interface UserContextInterface {
  currentUser: UserInterface | undefined
  signIn: (email: string, password: string) => void
  signUp: (username: string, email: string, password: string) => void
  logOut: () => void
  verifyUser: () => void
  changePassword: (password: string) => void
  sendResetPasswordMail: (email: string) => void
  updateUser: (user: UserInterface) => void
  deleteUser: () => void
}

const UserContext = React.createContext<UserContextInterface>({
  currentUser: { id: 0, userName: "", email: "", verified: false },
  signIn: () => void {},
  signUp: () => void {},
  logOut: () => void {},
  verifyUser: () => void {},
  changePassword: () => void {},
  sendResetPasswordMail: () => void {},
  updateUser: () => void {},
  deleteUser: () => void {},
})

export const UserContextProvider = ({ children }: ContextProviderProps): JSX.Element => {
  const { addToast } = useToastContext()
  const [currentUser, setCurrentUser] = useState<UserInterface>()

  const userService = new UserService()
  const router = useIonRouter()
  const storage = new Storage()
  storage.create()

  useEffect(() => {
    autoSignIn()
  }, [])

  const autoSignIn = async (): Promise<void> => {
    const signInLocalStorage = await storage.get(StorageKeys.SIGN_IN_DATA)
    if (signInLocalStorage) {
      try {
        const token = signInLocalStorage.token
        if (isTokenValid(token) === true) {
          userService.readUser().then((u) => {
            const user = new User().deserialize(u as UserInterface)
            setCurrentUser(user)
            router.push("/diaries")
          })
        } else {
          router.push("/authentification")
        }
      } catch (err) {
        router.push("/authentification")
        throw new Error(`Error with readUser: ${err}`)
      }
    } else {
      router.push("/authentification")
    }
  }

  const signIn = (email: string, password: string): void => {
    checkAccess(email, password)
  }

  const checkAccess = async (email: string, password: string): Promise<void> => {
    try {
      await userService.checkUserAccess({ email: email, password: password }).then((dataObject) => {
        const data = dataObject as { token: string; user: UserInterface }
        const token = data.token
        const user = data.user
        localStorage.setItem(StorageKeys.ACCESS_TOKEN, JSON.stringify(token))
        storage.set(StorageKeys.SIGN_IN_DATA, { token, user })
        const currentUser = new User().deserialize(user)
        setCurrentUser(currentUser)
        router.push("/diaries")
      })
    } catch (err) {
      const error = err as ApiErrorInterface
      if (error.resultJSON.code === 401) {
        addToast({
          message: error.resultJSON.message,
          variant: "danger",
          isAutohide: false,
        })
      } else {
        addToast({
          message: error.resultJSON.message,
          variant: "danger",
          isAutohide: false,
        })
      }
      throw new Error(`Error with checkAccess: ${error.resultJSON.message}`)
    }
  }

  const signUp = async (userName: string, email: string, password: string): Promise<void> => {
    try {
      await userService
        .registerUser({
          userName: userName,
          email: email,
          password: password,
        })
        .then(() => {
          addToast({
            message: "Check your mailbox and confirm email.",
            variant: "warning",
            isAutohide: false,
          })
        })
    } catch (err) {
      addToast({
        message: "Can't register. Try again.",
        variant: "danger",
        isAutohide: false,
      })
      throw new Error(`Error with registerUser: ${err}`)
    }
  }

  const logOut = async (): Promise<void> => {
    await storage.clear()
    localStorage.removeItem(StorageKeys.ACCESS_TOKEN)
    router.push("/authentification")

    const updatedUser = currentUser as UserInterface
    updatedUser.fcmToken = ""
    updateUser(updatedUser)

    window.location.reload()
  }

  const verifyUser = async (): Promise<void> => {
    try {
      await userService.verifyUser(currentUser as UserInterface).then(() => {
        addToast({
          message: "Email was sent. Check your mailbox.",
          variant: "warning",
          isAutohide: true,
        })
      })
    } catch (err) {
      addToast({
        message: "Can't send email. Try again later.",
        variant: "danger",
        isAutohide: true,
      })
      throw new Error(`Error with verifyUser: ${err}`)
    }
  }

  const changePassword = async (password: string): Promise<void> => {
    const updatedUser = currentUser as UserInterface
    updatedUser.password = password

    try {
      await userService.updateUser(updatedUser).then(() => {
        addToast({
          message: "Password successfully changed",
          variant: "success",
          isAutohide: true,
        })
      })
    } catch (err) {
      addToast({
        message: "Can't change the password. Try again later.",
        variant: "danger",
        isAutohide: true,
      })
      throw new Error(`Error with changePassword: ${err}`)
    }
  }

  const sendResetPasswordMail = async (email: string): Promise<void> => {
    try {
      await userService.sendResetPasswordMail(email).then(() => {
        addToast({
          message: "Email was sent. Check your mailbox.",
          variant: "warning",
          isAutohide: true,
        })
      })
    } catch (err) {
      addToast({
        message: "Can't send email. Try again later.",
        variant: "danger",
        isAutohide: true,
      })
      throw new Error(`Error with changePassword: ${err}`)
    }
  }

  const updateUser = async (user: UserInterface): Promise<void> => {
    try {
      await userService.updateUser(user).then((data) => {
        console.log(data)
      })
    } catch (err) {
      throw new Error(`Error with updateUser: ${err}`)
    }
  }

  const deleteUser = async (): Promise<void> => {
    try {
      await userService.deleteUser(currentUser as UserInterface).then(() => {
        logOut()
      })
    } catch (err) {
      throw new Error(`Error with deleteUser: ${err}`)
    }
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        signIn,
        signUp,
        logOut,
        verifyUser,
        changePassword,
        sendResetPasswordMail,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = (): UserContextInterface => useContext(UserContext)
