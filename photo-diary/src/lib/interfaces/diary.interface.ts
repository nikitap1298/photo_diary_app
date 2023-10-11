import { UserInterface } from "./user.interface"

export interface DiaryInterface {
  id?: number
  owner?: UserInterface
  imageFileName?: string
  title?: string
  description?: string
  createdAt?: Date
  closedAt?: Date
  users?: UserInterface[]
}
