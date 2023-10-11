import React, { useEffect, useState } from "react"
import {
  IonAvatar,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonRow,
} from "@ionic/react"
import { DiaryInterface } from "../../lib/interfaces/diary.interface"
import dayjs from "dayjs"
import { useDiaryContext } from "../../context/DiaryContext"
import { useIonRouter } from "@ionic/react"
import "./DiaryRow.scss"
import { trash } from "ionicons/icons"
import { isOwner } from "../../utils/IsOwner"
import { useUserContext } from "../../context/UserContext"

interface DiaryRowProps {
  diary: DiaryInterface
  onDelete: (diary: DiaryInterface) => void
}

export default function DiaryRow(props: DiaryRowProps): JSX.Element {
  const { diary, onDelete } = props
  const { currentUser } = useUserContext()
  const { fillCurrentDiary, getImage } = useDiaryContext()
  const [photo, setPhoto] = useState("")

  const router = useIonRouter()

  useEffect(() => {
    loadImage()
  }, [])

  const loadImage = async (): Promise<void> => {
    setPhoto(await getImage(diary))
  }

  const chooseDiary = (): void => {
    diary.imageFileName = photo
    fillCurrentDiary(diary)
    router.push(`/diaries/${diary.id}`)
  }

  return (
    <div className="diary-row">
      <IonItemSliding>
        <IonItem detail={true} onClick={chooseDiary}>
          <IonGrid>
            <IonRow class="ion-justify-content-between">
              <IonRow class="ion-align-items-center">
                <IonCol>
                  <IonAvatar>
                    <img
                      src={
                        diary.imageFileName
                          ? `data:image/jpeg;base64,${photo}`
                          : "https://ionicframework.com/docs/img/demos/thumbnail.svg"
                      }
                    />
                  </IonAvatar>
                </IonCol>

                <IonCol>
                  <IonLabel>
                    <h3>{diary.title}</h3>
                  </IonLabel>
                  <IonLabel>
                    <p>{diary.description}</p>
                  </IonLabel>
                </IonCol>
              </IonRow>

              <IonCol className="date-col" size="auto">
                <IonLabel>
                  <p>{dayjs(diary.createdAt).format("D MMM")}</p>
                </IonLabel>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

        {diary.closedAt && isOwner(diary, currentUser) ? (
          <IonItemOptions side="end">
            <IonItemOption color="danger" onClick={(): void => onDelete(diary)}>
              <IonIcon slot="icon-only" icon={trash}></IonIcon>
            </IonItemOption>
          </IonItemOptions>
        ) : null}
      </IonItemSliding>
    </div>
  )
}
