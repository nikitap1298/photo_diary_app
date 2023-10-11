import React, { useEffect, useRef, useState } from "react"
import {
  IonButtons,
  IonButton,
  IonModal,
  IonContent,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonGrid,
  IonRow,
  IonToggle,
} from "@ionic/react"
import { closeCircleOutline } from "ionicons/icons"
import { Storage } from "@ionic/storage"
import { useDiaryContext } from "../../../context/DiaryContext"
import { StorageKeys } from "../../../lib/enums/StorageKeys"
import "./FilterDiaries.scss"

export default function FilterDiaries(): JSX.Element {
  const { showPrivateDiaries, showClosedDiaries } = useDiaryContext()
  const modal = useRef<HTMLIonModalElement>(null)
  const [isPrivateToggle, setIsPrivateToggle] = useState(false)
  const [isClosedToggle, setIsClosedToggle] = useState(false)

  const storage = new Storage()
  storage.create()

  useEffect(() => {
    fetchIonicStorageData()
  }, [])

  const fetchIonicStorageData = async (): Promise<void> => {
    const diariesPrivateToggleStorage = await storage.get(StorageKeys.DIARIES_PRIVATE_TOGGLE)
    const diariesClosedToggleStorage = await storage.get(StorageKeys.DIARIES_CLOSED_TOGGLE)
    setIsPrivateToggle(diariesPrivateToggleStorage as boolean)
    setIsClosedToggle(diariesClosedToggleStorage as boolean)
  }

  const dismiss = (): void => {
    modal.current?.dismiss()
  }

  const handlePrivateToggleClick = (): void => {
    setIsPrivateToggle(!isPrivateToggle)
    storage.set(StorageKeys.DIARIES_PRIVATE_TOGGLE, !isPrivateToggle)
    showPrivateDiaries()
  }

  const handleClosedToggleClick = (): void => {
    setIsClosedToggle(!isClosedToggle)
    storage.set(StorageKeys.DIARIES_CLOSED_TOGGLE, !isClosedToggle)
    showClosedDiaries()
  }

  return (
    <>
      <IonModal
        className="custom-modal filter-diaries"
        ref={modal}
        trigger="open-filter-diaries-modal"
      >
        <IonContent scrollY={false}>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton color="light" onClick={dismiss}>
                <IonIcon slot="icon-only" icon={closeCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>Filter Diaries</IonTitle>
          </IonToolbar>
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonToggle
                className="toggle-row"
                labelPlacement="start"
                color="success"
                checked={isPrivateToggle}
                onIonChange={handlePrivateToggleClick}
              >
                Show only private:
              </IonToggle>
            </IonRow>
            <IonRow className="ion-justify-content-center">
              <IonToggle
                className="toggle-row"
                labelPlacement="start"
                color="success"
                checked={isClosedToggle}
                onIonChange={handleClosedToggleClick}
              >
                Show closed diaries:
              </IonToggle>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    </>
  )
}
