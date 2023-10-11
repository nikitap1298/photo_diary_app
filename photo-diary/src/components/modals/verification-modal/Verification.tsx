import { IonButton, IonContent, IonModal } from "@ionic/react"
import React, { useRef } from "react"
import "./Verification.scss"
import { useUserContext } from "../../../context/UserContext"

export default function Verification(): JSX.Element {
  const { verifyUser } = useUserContext()
  const modal = useRef<HTMLIonModalElement>(null)

  const sendLink = (): void => {
    verifyUser()
    modal.current?.dismiss()
  }

  return (
    <>
      <IonModal
        className="verification-modal"
        ref={modal}
        trigger="open-verification-modal"
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <IonContent scrollY={false}>
          <div className="content">
            <h3 className="title">To share diaries, you need to verify your email address.</h3>
            <IonButton fill="clear" onClick={sendLink}>
              Send verification link
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </>
  )
}
