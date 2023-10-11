/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { Route, Redirect } from "react-router-dom"
import Authentification from "./pages/authentification/Authentification"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"

/* Theme variables */
import "./theme/variables.css"
import "./App.scss"
import DiariesPage from "./pages/diaries-page/DiariesPage"
import SettingsPage from "./pages/settings-page/SettingsPage"
import { bookOutline, cogOutline } from "ionicons/icons"
import { useUserContext } from "./context/UserContext"
import ProtectedRoute from "./utils/ProtectedRoute"
import { useDiaryContext } from "./context/DiaryContext"
import ResetPasswordPage from "./pages/reset-password-page/ResetPasswordPage"
import { useToastContext } from "./context/ToastContext"
import Toast from "./components/toast/Toast"
import Hammer from "hammerjs"

setupIonicReact({ mode: "ios" })

Hammer.defaults.touchAction = "auto"

export default function App(): React.JSX.Element {
  const { toast } = useToastContext()
  const { currentUser } = useUserContext()
  const { currentDiary } = useDiaryContext()
  
  const isAuthPage = (): boolean => {
    return currentUser == null
  }

  const isTabBarShown = (): boolean => {
    return currentDiary.title == null
  }

  return (
    <div className="app">
      <IonApp>
        {toast ? <Toast /> : null}
        <IonReactRouter>
          {isAuthPage() ? (
            <>
              <Redirect exact path="/" to="/authentification" />
              <Route
                path="/authentification"
                render={(): React.JSX.Element => <Authentification />}
                exact={true}
              />
              <Route
                path="/reset/password"
                render={(): React.JSX.Element => <ResetPasswordPage />}
                exact={true}
              />
            </>
          ) : (
            <>
              <Redirect exact path="/" to="/diaries" />
              <IonTabs>
                <IonRouterOutlet>
                  <Route
                    path="/diaries"
                    render={(): React.JSX.Element => (
                      <ProtectedRoute>
                        <DiariesPage />
                      </ProtectedRoute>
                    )}
                  />
                  <Route
                    path="/settings"
                    render={(): React.JSX.Element => (
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    )}
                  />
                </IonRouterOutlet>
                {isTabBarShown() ? (
                  <IonTabBar slot="bottom">
                    <IonTabButton tab="diaries" href="/diaries">
                      <IonIcon icon={bookOutline} />
                      <IonLabel>Diaries</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="settings" href="/settings">
                      <IonIcon icon={cogOutline} />
                      <IonLabel>Settings</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                ) : (
                  <IonTabBar></IonTabBar>
                )}
              </IonTabs>
            </>
          )}
        </IonReactRouter>
      </IonApp>
    </div>
  )
}
