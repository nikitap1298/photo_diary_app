import React from "react"
import { IonActionSheet } from "@ionic/react"
import { cameraOutline, imageOutline } from "ionicons/icons"

interface PhotoGalleryActionSheetProps {
  actionSheet: React.RefObject<HTMLIonActionSheetElement>
  isOpen: boolean
  onDidDismiss: () => void
  handleChoosePhoto: (isCamera: boolean) => Promise<void>
}

export default function PhotoGalleryActionSheet(props: PhotoGalleryActionSheetProps): JSX.Element {
  const { actionSheet, isOpen, onDidDismiss, handleChoosePhoto } = props

  return (
    <IonActionSheet
      ref={actionSheet}
      isOpen={isOpen}
      buttons={[
        {
          text: "Gallery",
          icon: imageOutline,
          handler: (): Promise<void> => handleChoosePhoto(false),
        },
        {
          text: "Camera",
          icon: cameraOutline,
          handler: (): Promise<void> => handleChoosePhoto(true),
        },
        {
          text: "Cancel",
          role: "cancel",
          data: {
            action: "cancel",
          },
        },
      ]}
      onDidDismiss={(): void => onDidDismiss()}
    ></IonActionSheet>
  )
}
