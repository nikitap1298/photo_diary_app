import React, { useRef, useState } from "react"
import {
  IonButtons,
  IonButton,
  IonModal,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonIcon,
  IonInput,
  IonGrid,
  IonRow,
  IonAvatar,
} from "@ionic/react"
import { closeCircleOutline } from "ionicons/icons"
import { useDiaryContext } from "../../context/DiaryContext"
import { Photo } from "@capacitor/camera"
import { choosePhoto } from "../../utils/ChoosePhoto"
import "./ModalStyle.scss"

export default function NewDiary(): JSX.Element {
  const { addNewDiary } = useDiaryContext()
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [diaryName, setDiaryName] = useState("")
  const [diaryDescription, setDiaryDescription] = useState("")
  const [isModalPageOne, setIsModalPageOne] = useState(true)
  const modal = useRef<HTMLIonModalElement>(null)

  const handleChoosePhoto = async (): Promise<void> => {
    try {
      const getPhoto = await choosePhoto(true)
      setPhoto(getPhoto)
    } catch (err) {
      throw new Error(`Error during handleChoosePhoto: ${err}`)
    }
  }

  const handleDiaryNameInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setDiaryName(value)
  }

  const handleDiaryDescriptionInputChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setDiaryDescription(value)
  }

  const dismiss = (): void => {
    setPhoto(null)
    setDiaryName("")
    setDiaryDescription("")
    setIsModalPageOne(true)
    modal.current?.dismiss()
  }

  const create = (): void => {
    addNewDiary(diaryName, diaryDescription, photo as Photo)
    dismiss()
  }

  return (
    <>
      <IonModal className="custom-modal" ref={modal} trigger="open-new-diary-modal">
        <IonContent scrollY={false}>
          {isModalPageOne ? (
            <>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton color="light" onClick={dismiss}>
                    <IonIcon slot="icon-only" icon={closeCircleOutline} />
                  </IonButton>
                </IonButtons>
                <IonTitle>New Diary</IonTitle>
                <IonButtons slot="end">
                  <IonButton color="light" onClick={(): void => setIsModalPageOne(false)}>
                    Next
                  </IonButton>
                </IonButtons>
              </IonToolbar>
              <IonGrid>
                <IonRow className="ion-justify-content-center">
                  <IonItem>
                    <IonAvatar slot="start" onClick={handleChoosePhoto}>
                      <img
                        src={
                          photo
                            ? `data:image/jpeg;base64,${photo?.base64String}`
                            : "https://ionicframework.com/docs/img/demos/thumbnail.svg"
                        }
                      />
                    </IonAvatar>
                    <IonInput
                      type="text"
                      placeholder="Diary name"
                      autocapitalize="sentences"
                      value={diaryName}
                      onIonInput={handleDiaryNameInputChange}
                    ></IonInput>
                  </IonItem>
                </IonRow>
              </IonGrid>
            </>
          ) : (
            <>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton color="light" onClick={(): void => setIsModalPageOne(true)}>
                    Back
                  </IonButton>
                </IonButtons>
                <IonTitle>Description</IonTitle>
                <IonButtons slot="end">
                  <IonButton color="light" onClick={create}>
                    Create
                  </IonButton>
                </IonButtons>
              </IonToolbar>
              <IonGrid>
                <IonRow className="ion-justify-content-center">
                  <IonItem>
                    <IonInput
                      type="text"
                      placeholder="Diary description"
                      autocapitalize="sentences"
                      value={diaryDescription}
                      onIonInput={handleDiaryDescriptionInputChange}
                    ></IonInput>
                  </IonItem>
                </IonRow>
              </IonGrid>
            </>
          )}
        </IonContent>
      </IonModal>
    </>
  )
}
