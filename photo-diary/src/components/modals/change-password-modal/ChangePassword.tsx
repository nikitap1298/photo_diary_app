import React, { useRef, useState } from "react"
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import { useUserContext } from "../../../context/UserContext"
import "./ChangePassword.scss"

export default function ChangePassword(): JSX.Element {
  const { changePassword } = useUserContext()
  const modal = useRef<HTMLIonModalElement>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleNewPasswordInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setNewPassword(value)
  }

  const handleConfirmPasswordInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setConfirmPassword(value)
  }

  const dismiss = (): void => {
    setNewPassword("")
    setConfirmPassword("")
    modal.current?.dismiss()
  }

  const confirm = (): void => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      changePassword(newPassword)
      dismiss()
    }
  }

  return (
    <IonModal className="change-password-modal" ref={modal} trigger="open-change-password-modal">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={dismiss}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Change Password</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false} className="ion-padding">
        <div className="content">
          <>
            <IonLabel position="stacked">New password</IonLabel>
            <IonInput
              type="password"
              placeholder="Password"
              counter={true}
              maxlength={25}
              value={newPassword}
              onIonInput={handleNewPasswordInputChange}
            />
          </>
          <>
            <IonLabel position="stacked">Confirm new password</IonLabel>
            <IonInput
              type="password"
              placeholder="Password"
              counter={true}
              maxlength={25}
              value={confirmPassword}
              onIonInput={handleConfirmPasswordInputChange}
            />
          </>
        </div>
      </IonContent>
    </IonModal>
  )
}
