import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { IonReactRouter } from "@ionic/react-router"
import { UserContextProvider } from "./context/UserContext"
import { DiaryContextProvider } from "./context/DiaryContext"
import { ToastContextProvider } from "./context/ToastContext"
import App from "./App"

const rootElement = document.getElementById("root") as HTMLBaseElement
const root = createRoot(rootElement)

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <IonReactRouter>
      <ToastContextProvider>
        <UserContextProvider>
          <DiaryContextProvider>
            <App />
          </DiaryContextProvider>
        </UserContextProvider>
      </ToastContextProvider>
    </IonReactRouter>
  </BrowserRouter>
  // </React.StrictMode>
)
