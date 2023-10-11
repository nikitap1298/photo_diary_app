import { DiaryInterface } from "./diary.interface"
import { UserInterface } from "./user.interface"

export interface DiaryContentInterface {
  id?: number
  diary?: DiaryInterface
  user?: UserInterface
  text?: string
  imageFileName?: string
  createdAt?: Date
  latitude?: number
  longitude?: number
}
