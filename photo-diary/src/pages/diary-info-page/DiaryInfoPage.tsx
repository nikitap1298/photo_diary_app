import React, { useState } from "react"
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonRow,
  IonToolbar,
} from "@ionic/react"
import { addCircle } from "ionicons/icons"
import { useDiaryContext } from "../../context/DiaryContext"
import "./DiaryInfoPage.scss"
import { useUserContext } from "../../context/UserContext"
import InviteUser from "../../components/modals/InviteUser"
import UserRows from "../../components/user-row/UserRows"
import { useUserHandlingContext } from "../../context/UserHandlingContext"
import { UserInterface } from "../../lib/interfaces/user.interface"
import { isOwner } from "../../utils/IsOwner"
import { Photo } from "@capacitor/camera"
import { choosePhoto } from "../../utils/ChoosePhoto"

export default function DiaryInfoPage(): React.JSX.Element {
  const { currentUser } = useUserContext()
  const { currentDiary, updateDiary, closeDiary } = useDiaryContext()
  const { removeUserFromDiary } = useUserHandlingContext()
  const [isEditMode, setIsEditMode] = useState(false)
  const [photo, setPhoto] = useState<Photo | string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleChoosePhoto = async (): Promise<void> => {
    try {
      const getPhoto = await choosePhoto(true)
      setPhoto(getPhoto as Photo)
    } catch (err) {
      throw new Error(`Error during handleChoosePhoto: ${err}`)
    }
  }

  const handleTitleInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setTitle(value)
  }

  const handleDescriptionInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setDescription(value)
  }

  const editDiary = (): void => {
    if (isEditMode) {
      setPhoto("")
      setTitle("")
      setDescription("")
      setIsEditMode(false)
    } else {
      setPhoto(`data:image/jpeg;base64,${currentDiary.imageFileName}`)
      setTitle(currentDiary.title as string)
      setDescription(currentDiary.description as string)
      setIsEditMode(true)
    }
  }

  const saveDiary = (): void => {
    const updatedDiary = currentDiary
    updatedDiary.imageFileName = (photo as Photo).base64String
    updatedDiary.title = title
    updatedDiary.description = description

    if (photo || title !== "" || description !== "") {
      updateDiary(updatedDiary)
      setIsEditMode(false)
    }
  }

  const clickCloseDiary = (): void => {
    closeDiary(currentDiary)
  }

  const clickLeaveDiary = (): void => {
    removeUserFromDiary(currentUser as UserInterface)
  }

  return (
    <div className="diary-info-page">
      <IonPage>
        {isEditMode ? (
          <>
            <IonHeader translucent={true}>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={editDiary}>Cancel</IonButton>
                </IonButtons>
                <IonButtons slot="end">
                  <IonButton onClick={saveDiary}>Save</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonGrid>
                <IonRow className="ion-justify-content-center">
                  <IonAvatar onClick={handleChoosePhoto}>
                    <img
                      src={
                        typeof photo == "string"
                          ? photo
                          : `data:image/jpeg;base64,${photo.base64String}`
                      }
                    />
                  </IonAvatar>
                </IonRow>
                <IonRow className="ion-justify-content-center row-2 row-form">
                  <IonItem>
                    <IonInput
                      label="title"
                      labelPlacement="stacked"
                      autocapitalize="sentences"
                      placeholder={currentDiary.title}
                      value={title}
                      onIonInput={handleTitleInputChange}
                    ></IonInput>
                  </IonItem>
                </IonRow>
                <IonRow className="ion-justify-content-center row-form">
                  <IonItem>
                    <IonInput
                      label="description"
                      labelPlacement="stacked"
                      autocapitalize="sentences"
                      placeholder={
                        currentDiary.description ? currentDiary.description : "Description is empty"
                      }
                      value={description}
                      onIonInput={handleDescriptionInputChange}
                    ></IonInput>
                  </IonItem>
                </IonRow>
              </IonGrid>
              <InviteUser />
            </IonContent>
          </>
        ) : (
          <>
            <IonHeader translucent={true}>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonBackButton></IonBackButton>
                </IonButtons>
                {currentDiary.closedAt ? null : isOwner(currentDiary, currentUser) ? (
                  <IonButtons slot="end">
                    <IonButton onClick={editDiary}>Edit</IonButton>
                  </IonButtons>
                ) : null}
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonGrid>
                <IonRow className="ion-justify-content-center">
                  <IonAvatar>
                    <img
                      src={
                        currentDiary.imageFileName
                          ? `data:image/jpeg;base64,${currentDiary.imageFileName}`
                          : "https://ionicframework.com/docs/img/demos/thumbnail.svg"
                      }
                    />
                  </IonAvatar>
                </IonRow>
                <IonRow className="ion-justify-content-center row-2">
                  <h3>{currentDiary.title}</h3>
                </IonRow>
                <IonRow>
                  <hr className="hr-row-3" />
                </IonRow>
                <IonRow
                  className={
                    isOwner(currentDiary, currentUser)
                      ? "ion-justify-content-between row-4"
                      : "ion-justify-content-end row-4"
                  }
                >
                  {currentDiary.closedAt ? null : isOwner(currentDiary, currentUser) ? (
                    <>
                      {currentUser?.verified ? (
                        <IonButton
                          size="small"
                          fill="clear"
                          id="open-add-user-modal"
                          expand="block"
                        >
                          <IonIcon slot="start" icon={addCircle} />
                          Invite User
                        </IonButton>
                      ) : (
                        <div></div>
                      )}

                      <IonButton size="small" color="danger" onClick={clickCloseDiary}>
                        Close
                      </IonButton>
                    </>
                  ) : (
                    <IonButton size="small" color="danger" onClick={clickLeaveDiary}>
                      Leave
                    </IonButton>
                  )}
                </IonRow>
                <IonRow className="ion-justify-content-center row-form">
                  <IonItem>
                    <IonInput
                      readonly={true}
                      label="description"
                      labelPlacement="stacked"
                      placeholder={
                        currentDiary.description ? currentDiary.description : "Description is empty"
                      }
                    ></IonInput>
                  </IonItem>
                </IonRow>
                <IonRow className="ion-justify-content-center row-list">
                  <IonList>
                    <UserRows isOwner={isOwner(currentDiary, currentUser)} />
                  </IonList>
                </IonRow>
              </IonGrid>
              <InviteUser />
            </IonContent>
          </>
        )}
      </IonPage>
    </div>
  )
}
