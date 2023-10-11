import React, { useRef, useState } from "react"
import {
  IonButtons,
  IonButton,
  IonModal,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonIcon,
  IonInput,
  IonGrid,
  IonRow,
} from "@ionic/react"
import { closeCircleOutline } from "ionicons/icons"
import { useUserHandlingContext } from "../../context/UserHandlingContext"
import "./ModalStyle.scss"

export default function InviteUser(): JSX.Element {
  const { inviteUser } = useUserHandlingContext()
  const [userEmail, setUserEmail] = useState("")
  const modal = useRef<HTMLIonModalElement>(null)

  const handleUserEmailInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setUserEmail(value)
  }

  const dismiss = (): void => {
    setUserEmail("")
    modal.current?.dismiss()
  }

  const invite = (): void => {
    inviteUser(userEmail)
    dismiss()
  }

  return (
    <>
      <IonModal className="custom-modal" ref={modal} trigger="open-add-user-modal">
        <IonContent scrollY={false}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="light" onClick={dismiss}>
                <IonIcon slot="icon-only" icon={closeCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>Invite User</IonTitle>
            <IonButtons slot="end">
              <IonButton color="light" onClick={invite}>
                Done
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="User email"
                  value={userEmail}
                  onIonInput={handleUserEmailInputChange}
                ></IonInput>
              </IonItem>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    </>
  )
}
