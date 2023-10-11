import React, { useEffect, useState } from "react"
import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow } from "@ionic/react"
import { useIonRouter } from "@ionic/react"
import { useUserContext } from "../../context/UserContext"

export default function ResetPasswordPage(): React.JSX.Element {
  const { sendResetPasswordMail } = useUserContext()
  const [email, setEmail] = useState("")

  const router = useIonRouter()

  useEffect(() => {
    setEmail("")
  }, [])

  const handleEmailInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setEmail(value.toLowerCase())
  }

  return (
    <IonContent className="ion-top" scrollY={false}>
      <div className="authentification">
        <IonGrid>
          <IonRow>
            <IonCol>
              <h1>Reset Password</h1>
            </IonCol>
          </IonRow>

          <IonRow className="form">
            <IonCol>
              <IonItem>
                <IonInput
                  type="email"
                  label="Your Email"
                  labelPlacement="floating"
                  fill="outline"
                  placeholder="Email"
                  value={email}
                  onIonInput={handleEmailInputChange}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center submit-btn">
            <IonButton onClick={(): void => sendResetPasswordMail(email)}>
              Send reset password mail
            </IonButton>
          </IonRow>

          <IonRow className="ion-justify-content-end submit-btn">
            <IonButton fill="clear" onClick={(): void => router.push("/authentification")}>
              Sign In
            </IonButton>
          </IonRow>
        </IonGrid>
      </div>
    </IonContent>
  )
}
