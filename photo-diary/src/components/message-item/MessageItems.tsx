import React, { createRef, useEffect } from "react"
import MessageItem from "./MessageItem"
import { DiaryContentInterface } from "../../lib/interfaces/diary-content.interface"
import { useDiaryContentContext } from "../../context/DiaryContentContext"
import { useUserContext } from "../../context/UserContext"
import { IonContent } from "@ionic/react"

export default function MessageItems(): JSX.Element {
  const { currentUser } = useUserContext()
  const { diaryContents } = useDiaryContentContext()
  const contentRef = createRef<HTMLIonContentElement>()

  useEffect(() => {
    scrollToBottom()
  }, [diaryContents])

  const scrollToBottom = (): void => {
    contentRef.current?.scrollToBottom(1)
  }

  return (
    <IonContent fullscreen={true} ref={contentRef}>
      {diaryContents.map((diaryContent: DiaryContentInterface) => (
        <MessageItem
          key={diaryContent.id}
          diaryContent={diaryContent}
          isOwnMessage={currentUser?.id === diaryContent.user?.id}
        />
      ))}
    </IonContent>
  )
}
