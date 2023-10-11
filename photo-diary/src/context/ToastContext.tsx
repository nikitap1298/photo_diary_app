import React, { useContext, useState } from "react"
import { ToastInterface } from "../lib/interfaces/toast.interface"
import { ContextProviderProps } from "../lib/custom-types/custom-types"

interface ToastContextInterface {
  toast: ToastInterface | undefined
  addToast: (toast: ToastInterface) => void
  deleteToast: () => void
}

const ToastContext = React.createContext<ToastContextInterface>({
  toast: { message: "", variant: "", isAutohide: false },
  addToast: () => void {},
  deleteToast: () => void {},
})

export const ToastContextProvider = ({ children }: ContextProviderProps): JSX.Element => {
  const [toast, setToast] = useState<ToastInterface>()

  const addToast = (toast: ToastInterface): void => {
    setToast(toast)
  }

  const deleteToast = (): void => {
    setToast(undefined)
  }

  return (
    <ToastContext.Provider
      value={{
        toast,
        addToast,
        deleteToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export const useToastContext = (): ToastContextInterface => useContext(ToastContext)
