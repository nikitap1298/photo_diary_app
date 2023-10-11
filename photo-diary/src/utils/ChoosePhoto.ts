import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera"

export async function choosePhoto(
  isDiaryImage: boolean,
  isCamera?: boolean
): Promise<Photo | null> {
  try {
    const libraryPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: isCamera ? CameraSource.Camera : CameraSource.Photos,
      quality: 90,
      width: isDiaryImage ? 500 : undefined,
    })
    return libraryPhoto
  } catch (err) {
    throw new Error(`Error getting photo from library: ${err}`)
  }
}
