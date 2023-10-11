import React from "react"
import { useDiaryContentContext } from "../../context/DiaryContentContext"
import ImagePreview from "./ImagePreview"
import { v4 as uuidv4 } from "uuid"

export default function ImagePreviews(): JSX.Element {
  const { diaryContents } = useDiaryContentContext()

  const images = (): string[] => {
    const imageArray: string[] = []
    diaryContents.forEach((i) => {
      if (i.imageFileName) {
        imageArray.push(i.imageFileName as string)
      }
    })
    return imageArray
  }

  return (
    <>
      {images()
        .reverse()
        .map((image: string) => (
          <>
            <ImagePreview key={uuidv4()} imageFileName={image} />
          </>
        ))}
    </>
  )
}
