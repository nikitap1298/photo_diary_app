import { DiaryContentInterface } from "../lib/interfaces/diary-content.interface"
import { DiaryInterface } from "../lib/interfaces/diary.interface"
import { Serializable } from "../lib/interfaces/serializable.interface"
import { UserInterface } from "../lib/interfaces/user.interface"

export class DiaryContent implements Serializable<DiaryContentInterface> {
  id?: number
  diary?: DiaryInterface
  user?: UserInterface
  text?: string
  imageFileName?: string
  createdAt?: Date
  latitude?: number
  longitude?: number

  constructor() {
    this.id = undefined
    this.diary = undefined
    this.user = undefined
    this.text = undefined
    this.imageFileName = undefined
    this.createdAt = undefined
    this.latitude = undefined
    this.longitude = undefined
  }

  deserialize(input: DiaryContentInterface): DiaryContentInterface {
    this.id = input.id
    this.diary = input.diary
    this.user = input.user
    this.text = input.text
    this.imageFileName = input.imageFileName
    this.createdAt = input.createdAt
    this.latitude = input.latitude
    this.longitude = input.longitude
    return this
  }
}
