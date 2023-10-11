import React from "react"
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonToolbar,
} from "@ionic/react"
import { useDiaryContentContext } from "../../context/DiaryContentContext"
import "./FullImagePage.scss"

export default function FullImagePage(): JSX.Element {
  const { fillCurrentDiaryContent, currentDiaryContent } = useDiaryContentContext()

  return (
    <div className="full-image-page">
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start" onClick={(): void => fillCurrentDiaryContent({})}>
              <IonBackButton></IonBackButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent scrollY={false}>
          <div className="content">
            <IonImg src={`data:image/jpeg;base64,${currentDiaryContent.imageFileName}`}></IonImg>
          </div>
        </IonContent>
      </IonPage>
    </div>
  )
}
