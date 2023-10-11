import React from "react"
import { IonImg } from "@ionic/react"
import "./ImagePreview.scss"

interface ImagePreviewProps {
  imageFileName: string | undefined
}

export default function ImagePreview(props: ImagePreviewProps): JSX.Element {
  const { imageFileName } = props
  return (
    <div className="image-preview">
      <IonImg
        src={
          imageFileName
            ? `data:image/jpeg;base64,${imageFileName}`
            : "https://ionicframework.com/docs/img/demos/thumbnail.svg"
        }
      ></IonImg>
    </div>
  )
}
