import React, { useEffect, useMemo, useState } from "react"
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
  RefresherEventDetail,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react"
import { Route } from "react-router"
import DiaryPage from "../diary-page/DiaryPage"
import ProtectedRoute from "../../utils/ProtectedRoute"
import { useUserContext } from "../../context/UserContext"
import { useDiaryContext } from "../../context/DiaryContext"
import NewDiary from "../../components/modals/NewDiary"
import DiaryRows from "../../components/diary-row/DiaryRows"
import { warningOutline, createOutline, ellipsisHorizontalOutline } from "ionicons/icons"
import { DiaryContentContextProvider } from "../../context/DiaryContentContext"
import { UserHandlingContextProvider } from "../../context/UserHandlingContext"
import Verification from "../../components/modals/verification-modal/Verification"
import FilterDiaries from "../../components/modals/filter-diaries-modal/FilterDiaries"
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed,
} from "@capacitor/push-notifications"
import { UserInterface } from "../../lib/interfaces/user.interface"

export default function DiariesPage(): React.JSX.Element {
  const { currentUser, updateUser } = useUserContext()
  const { fetchDiariesFromDB } = useDiaryContext()
  const [refreshCounter, setRefreshCounter] = useState(0)
  const key = useMemo(() => refreshCounter, [refreshCounter])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setNotifications] = useState<any[]>([])

  useEffect(() => {
    fetchDiariesFromDB()
  }, [])

  useEffect(() => {
    PushNotifications.checkPermissions().then((res) => {
      if (res.receive !== "granted") {
        PushNotifications.requestPermissions().then((res) => {
          if (res.receive !== "denied") {
            register()
          }
        })
      } else {
        register()
      }
    })
  }, [])

  const register = (): void => {
    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register()

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token: Token) => {
      const updatedUser = currentUser as UserInterface
      updatedUser.fcmToken = token.value
      updateUser(updatedUser)
    })

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error) => {
      alert("Error on registration: " + JSON.stringify(error))
    })

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {
        setNotifications((notifications) => [
          ...notifications,
          {
            id: notification.id,
            title: notification.title,
            body: notification.body,
            type: "foreground",
          },
        ])
      }
    )

    // Method called when tapping on a notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: ActionPerformed) => {
        setNotifications((notifications) => [
          ...notifications,
          {
            id: notification.notification.data.id,
            title: notification.notification.data.title,
            body: notification.notification.data.body,
            type: "action",
          },
        ])
      }
    )
  }

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>): void => {
    setTimeout(() => {
      setRefreshCounter(refreshCounter + 1)
      event.detail.complete()
    }, 750)
  }

  return (
    <IonPage key={key}>
      <IonRouterOutlet>
        <Route
          exact
          path="/diaries"
          render={(): React.JSX.Element => (
            <ProtectedRoute>
              <IonPage>
                <IonHeader translucent={true}>
                  <IonToolbar>
                    {currentUser?.verified ? null : (
                      <>
                        <IonButtons slot="start">
                          <IonButton id="open-verification-modal" expand="block">
                            <IonIcon slot="icon-only" color="warning" icon={warningOutline} />
                          </IonButton>
                        </IonButtons>
                      </>
                    )}
                    <IonTitle>Diaries</IonTitle>
                    <IonButtons slot="end">
                      <IonButton id="open-filter-diaries-modal" expand="block">
                        <IonIcon slot="icon-only" icon={ellipsisHorizontalOutline} />
                      </IonButton>
                      <IonButton id="open-new-diary-modal" expand="block">
                        <IonIcon slot="icon-only" icon={createOutline} />
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>

                <IonContent fullscreen={true}>
                  <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                  </IonRefresher>
                  <IonHeader collapse="condense">
                    <IonToolbar>
                      <IonTitle size="large">Diaries</IonTitle>
                    </IonToolbar>
                  </IonHeader>

                  <Verification />
                  <FilterDiaries />
                  <NewDiary />
                  <IonList>
                    <DiaryRows />
                  </IonList>
                </IonContent>
              </IonPage>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/diaries/:id"
          render={(): React.JSX.Element => (
            <ProtectedRoute>
              <DiaryContentContextProvider>
                <UserHandlingContextProvider>
                  <DiaryPage />
                </UserHandlingContextProvider>
              </DiaryContentContextProvider>
            </ProtectedRoute>
          )}
        />
      </IonRouterOutlet>
    </IonPage>
  )
}
