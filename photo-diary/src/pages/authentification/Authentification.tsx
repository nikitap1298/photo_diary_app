import React, { useEffect, useState } from "react"
import { IonContent, IonButton, IonItem, IonInput, IonGrid, IonRow, IonCol } from "@ionic/react"
import { useUserContext } from "../../context/UserContext"
import { useIonRouter } from "@ionic/react"
import "./Authentification.scss"

export default function Authentification(): React.JSX.Element {
  const { signIn, signUp } = useUserContext()

  const [username, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [registerComponentIsActive, setRegisterComponentIsActive] = useState(false)

  const router = useIonRouter()

  useEffect(() => {
    setUserName("")
    setEmail("")
    setPassword("")
  }, [registerComponentIsActive])

  const handleUsernameInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setUserName(value)
  }

  const handleEmailInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setEmail(value.toLowerCase())
  }

  const handlePasswordInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setPassword(value)
  }

  return (
    <IonContent className="ion-top" scrollY={false}>
      <div className="authentification">
        {registerComponentIsActive ? (
          <IonGrid>
            <IonRow>
              <IonCol>
                <h1>Sign Up</h1>
              </IonCol>
            </IonRow>

            <IonRow className="form">
              <IonCol>
                <IonItem>
                  <IonInput
                    type="text"
                    label="Username"
                    labelPlacement="floating"
                    autocapitalize="sentences"
                    fill="outline"
                    placeholder="Enter username"
                    value={username}
                    onIonInput={handleUsernameInputChange}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    type="email"
                    label="Email"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="Enter email"
                    value={email}
                    onIonInput={handleEmailInputChange}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    type="password"
                    label="Password"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="Enter password"
                    value={password}
                    onIonInput={handlePasswordInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow className="ion-justify-content-center submit-btn">
              <IonButton onClick={(): void => signUp(username, email, password)}>Sign Up</IonButton>
            </IonRow>

            <IonRow className="ion-justify-content-end submit-btn">
              <IonButton fill="clear" onClick={(): void => setRegisterComponentIsActive(false)}>
                Sign In
              </IonButton>
            </IonRow>
          </IonGrid>
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol>
                <h1>Welcome!</h1>
              </IonCol>
            </IonRow>

            <IonRow className="form">
              <IonCol>
                <IonItem>
                  <IonInput
                    type="email"
                    label="Email"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="Enter email"
                    value={email}
                    onIonInput={handleEmailInputChange}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    type="password"
                    label="Password"
                    labelPlacement="floating"
                    fill="outline"
                    placeholder="Enter password"
                    value={password}
                    onIonInput={handlePasswordInputChange}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow className="ion-justify-content-center submit-btn">
              <IonButton onClick={(): void => signIn(email, password)}>Sign In</IonButton>
            </IonRow>

            <IonRow className="ion-justify-content-between submit-btn">
              <IonButton fill="clear" onClick={(): void => router.push("/reset/password")}>
                Forgot Password?
              </IonButton>
              <IonButton fill="clear" onClick={(): void => setRegisterComponentIsActive(true)}>
                Sign Up
              </IonButton>
            </IonRow>
          </IonGrid>
        )}
      </div>
    </IonContent>
  )
}
