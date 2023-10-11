import React, { useState } from "react"
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import { useUserContext } from "../../context/UserContext"
import { logOutOutline } from "ionicons/icons"
import ChangePassword from "../../components/modals/change-password-modal/ChangePassword"

export default function SettingsPage(): React.JSX.Element {
  const { currentUser, logOut, deleteUser } = useUserContext()
  const [isOpenAlert, setIsOpenAlert] = useState(false)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{currentUser?.userName}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={(): void => logOut()}>
              <IonIcon slot="icon-only" color="danger" icon={logOutOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonButton
              className="change-password-btn"
              fill="clear"
              id="open-change-password-modal"
              expand="block"
            >
              Change Password
            </IonButton>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonButton fill="clear" color="danger" onClick={(): void => setIsOpenAlert(true)}>
              Delete Account
            </IonButton>
          </IonRow>
          <IonAlert
            isOpen={isOpenAlert}
            header="Delete account"
            message="Are you sure you want to delete your account?"
            buttons={[
              {
                text: "Cancel",
                role: "cancel",
              },
              {
                text: "Delete",
                role: "destructive",
                handler: (): void => {
                  deleteUser()
                },
              },
            ]}
            onDidDismiss={(): void => setIsOpenAlert(false)}
          ></IonAlert>
        </IonGrid>
        <ChangePassword />
      </IonContent>
    </IonPage>
  )
}
