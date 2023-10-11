import React, { useEffect, useState } from "react"
import { IonToast } from "@ionic/react"
import { useToastContext } from "../../context/ToastContext"

export default function Toast(): JSX.Element {
  const { toast, deleteToast } = useToastContext()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  return (
    <IonToast
      isOpen={isOpen}
      message={toast?.message}
      duration={toast?.isAutohide ? 2000 : undefined}
      position="top"
      color={toast?.variant}
      buttons={
        toast?.isAutohide
          ? []
          : [
              {
                text: "Close",
                role: "cancel",
                handler: (): void => {
                  deleteToast()
                },
              },
            ]
      }
      onDidDismiss={(): void => deleteToast()}
    ></IonToast>
  )
}
