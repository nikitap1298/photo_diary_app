import React, { useEffect, useState } from "react"
import { DiaryContentInterface } from "../../lib/interfaces/diary-content.interface"
import "./MessageItem.scss"
import { IonCol, IonGrid, IonImg, IonRow, IonAlert } from "@ionic/react"
import dayjs from "dayjs"
import LongPressGesture from "../../utils/LongPressGesture"
import { useDiaryContentContext } from "../../context/DiaryContentContext"
import { useIonRouter } from "@ionic/react"
import { useDiaryContext } from "../../context/DiaryContext"

interface MessageItemProps {
  diaryContent: DiaryContentInterface
  isOwnMessage: boolean
}

export default function MessageItem(props: MessageItemProps): JSX.Element {
  const { diaryContent, isOwnMessage } = props
  const { currentDiary } = useDiaryContext()
  const { deleteDiaryContent, getImage, fillCurrentDiaryContent } = useDiaryContentContext()
  const [username, setUsername] = useState("")
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const [photo, setPhoto] = useState("")
  const additionalMessageClass = isOwnMessage ? "own-message" : "other-message"

  const router = useIonRouter()

  useEffect(() => {
    setUsername(diaryContent.user?.userName as string)

    if (diaryContent.imageFileName) {
      loadImage()
    }
  }, [])

  const handleLongPress = (): void => {
    if (!currentDiary.closedAt) {
      isOwnMessage ? setIsOpenAlert(true) : null
    }
  }

  const openImage = async (): Promise<void> => {
    const image = await getImage(diaryContent)
    diaryContent.imageFileName = image
    fillCurrentDiaryContent(diaryContent)
    router.push(`/diaries/${currentDiary.id}/images/${diaryContent.id}`)
  }

  const loadImage = async (): Promise<void> => {
    const image = await getImage(diaryContent)
    setPhoto(image)
    diaryContent.imageFileName = image
  }

  const textMessage = (
    <div className="fix-width">
      <b>{isOwnMessage ? "Me" : username}</b>
      <br />
      <span>{diaryContent.text}</span>
      <div className="time">
        <br />
        {dayjs(diaryContent.createdAt).format("D MMM")}
      </div>
    </div>
  )

  const imageMessage = (
    <div className="fix-width" onClick={openImage}>
      <b>{isOwnMessage ? "Me" : username}</b>
      <IonImg
        src={
          diaryContent.imageFileName
            ? `data:image/jpeg;base64,${photo}`
            : "https://ionicframework.com/docs/img/demos/thumbnail.svg"
        }
      ></IonImg>
      <span>{diaryContent.text}</span>
      <div className="time">
        <br />
        {dayjs(diaryContent.createdAt).format("D MMM")}
      </div>
    </div>
  )

  const columnOffset = (): string | undefined => {
    return isOwnMessage ? "4" : undefined
  }

  return (
    <div>
      <IonGrid>
        {diaryContent.imageFileName ? (
          <IonRow>
            <IonCol
              offset={columnOffset()}
              size="8"
              className={`message-item ${additionalMessageClass}`}
            >
              <LongPressGesture onLongPress={handleLongPress}>{imageMessage}</LongPressGesture>
            </IonCol>
          </IonRow>
        ) : (
          <IonRow>
            <IonCol
              offset={columnOffset()}
              size="8"
              className={`message-item ${additionalMessageClass}`}
            >
              <LongPressGesture onLongPress={handleLongPress}>{textMessage}</LongPressGesture>
            </IonCol>
          </IonRow>
        )}
        <IonAlert
          isOpen={isOpenAlert}
          header="Message"
          message="Are you sure you want to delete this message?"
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "Delete",
              role: "destructive",
              handler: (): void => {
                deleteDiaryContent(diaryContent)
              },
            },
          ]}
          onDidDismiss={(): void => setIsOpenAlert(false)}
        ></IonAlert>
      </IonGrid>
    </div>
  )
}
