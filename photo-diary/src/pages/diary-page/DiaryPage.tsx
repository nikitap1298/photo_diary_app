import React, { useEffect } from "react"
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonFooter,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import { useDiaryContext } from "../../context/DiaryContext"
import "./DiaryPage.scss"
import SendMessage from "../../components/send-message/SendMessage"
import MessageItems from "../../components/message-item/MessageItems"
import { Route } from "react-router"
import ProtectedRoute from "../../utils/ProtectedRoute"
import { useIonRouter } from "@ionic/react"
import DiaryInfoPage from "../diary-info-page/DiaryInfoPage"
import FullImagePage from "../full-image-page/FullImagePage"

export default function DiaryPage(): React.JSX.Element {
  const { currentDiary, fillCurrentDiary } = useDiaryContext()

  const router = useIonRouter()

  useEffect(() => {
    // This code will run when the component is mounted
    return () => {
      // This code will run when the component is unmounted
      fillCurrentDiary({})
    }
  }, [])

  const openInfo = (): void => {
    router.push(`/diaries/${currentDiary.id}/info`)
  }

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route
          exact
          path="/diaries/:id"
          render={(): React.JSX.Element => (
            <ProtectedRoute>
              <div className="diary-page">
                <IonPage>
                  <IonHeader translucent={true}>
                    <IonToolbar>
                      <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                      </IonButtons>
                      <IonTitle>
                        <div>{currentDiary.title}</div>
                        {(currentDiary.users?.length as number) >= 1 ? (
                          <div className="subtitle">{currentDiary.users?.length + " members"}</div>
                        ) : null}
                      </IonTitle>
                      <IonButtons slot="end">
                        <IonButton id="open-modal" expand="block" onClick={openInfo}>
                          <IonAvatar slot="start">
                            <img
                              src={
                                currentDiary.imageFileName
                                  ? `data:image/jpeg;base64,${currentDiary.imageFileName}`
                                  : "https://ionicframework.com/docs/img/demos/thumbnail.svg"
                              }
                            />
                          </IonAvatar>
                        </IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <MessageItems />
                  <IonFooter>{currentDiary.closedAt ? null : <SendMessage />}</IonFooter>
                </IonPage>
              </div>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/diaries/:id/info"
          render={(): React.JSX.Element => (
            <ProtectedRoute>
              <DiaryInfoPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/diaries/:id/images/:id"
          render={(): React.JSX.Element => (
            <ProtectedRoute>
              <FullImagePage />
            </ProtectedRoute>
          )}
        />
      </IonRouterOutlet>
    </IonPage>
  )
}
