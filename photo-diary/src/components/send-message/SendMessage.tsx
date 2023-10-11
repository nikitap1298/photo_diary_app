import React, { useRef, useState } from "react"
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonTextarea,
  IonToolbar,
} from "@ionic/react"
import { attach, paperPlane } from "ionicons/icons"
import { Photo } from "@capacitor/camera"
import { choosePhoto } from "../../utils/ChoosePhoto"
import "./SendMessage.scss"
import { useDiaryContentContext } from "../../context/DiaryContentContext"
import PhotoGalleryActionSheet from "../photo-gallery-action-sheet/PhotoGalleryActionSheet"

export default function SendMessage(): React.JSX.Element {
  const { addDiaryContent } = useDiaryContentContext()
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [message, setMessage] = useState<string>("")
  const actionSheet = useRef<HTMLIonActionSheetElement>(null)
  const [actionSheetIsOpen, setActionSheetIsOpen] = useState(false)

  const handleChoosePhoto = async (isCamera: boolean): Promise<void> => {
    try {
      const getPhoto = await choosePhoto(false, isCamera)
      setPhoto(getPhoto)
    } catch (err) {
      throw new Error(`Error during handleChoosePhoto: ${err}`)
    }
  }

  const handleInputMessageChange = (event: Event): void => {
    const value = (event.target as HTMLIonInputElement).value as string
    setMessage(value)
  }

  const send = (): void => {
    addDiaryContent(message, photo as Photo)
    setPhoto(null)
    setMessage("")
  }

  return (
    <div className="send-message">
      <IonToolbar>
        <IonGrid>
          <IonRow className="ion-align-items-end">
            <IonCol>
              <IonButtons>
                <IonButton onClick={(): void => setActionSheetIsOpen(true)}>
                  {photo ? (
                    <IonAvatar slot="start">
                      <img
                        src={
                          photo
                            ? `data:image/jpeg;base64,${photo.base64String}`
                            : "https://ionicframework.com/docs/img/demos/thumbnail.svg"
                        }
                      />
                    </IonAvatar>
                  ) : (
                    <IonIcon slot="icon-only" icon={attach}></IonIcon>
                  )}
                </IonButton>
              </IonButtons>
            </IonCol>
            <IonCol>
              <IonTextarea
                style={{ width: window.innerWidth - 160 }}
                className="custom"
                placeholder="Message"
                autocapitalize="sentences"
                value={message}
                autoGrow={true}
                rows={1}
                onIonInput={handleInputMessageChange}
              ></IonTextarea>
            </IonCol>
            <IonCol>
              <IonButtons>
                <IonButton onClick={send}>
                  <IonIcon slot="icon-only" icon={paperPlane}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonCol>
          </IonRow>
          <PhotoGalleryActionSheet
            actionSheet={actionSheet}
            isOpen={actionSheetIsOpen}
            onDidDismiss={(): void => setActionSheetIsOpen(false)}
            handleChoosePhoto={handleChoosePhoto}
          />
        </IonGrid>
      </IonToolbar>
    </div>
  )
}
