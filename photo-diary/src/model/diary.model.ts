import { DiaryInterface } from "../lib/interfaces/diary.interface"
import { Serializable } from "../lib/interfaces/serializable.interface"
import { UserInterface } from "../lib/interfaces/user.interface"

export class Diary implements Serializable<DiaryInterface> {
  id?: number
  owner?: UserInterface
  imageFileName?: string
  title?: string
  description?: string
  createdAt?: Date
  closedAt?: Date
  users?: UserInterface[]

  constructor() {
    this.id = undefined
    this.owner = undefined
    this.imageFileName = undefined
    this.title = undefined
    this.description = undefined
    this.createdAt = undefined
    this.closedAt = undefined
    this.users = undefined
  }

  deserialize(input: DiaryInterface): DiaryInterface {
    this.id = input.id
    this.owner = input.owner
    this.imageFileName = input.imageFileName
    this.title = input.title
    this.description = input.description
    this.createdAt = input.createdAt
    this.closedAt = input.closedAt
    this.users = input.users
    return this
  }
}
