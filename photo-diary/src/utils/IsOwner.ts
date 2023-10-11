import { DiaryInterface } from "../lib/interfaces/diary.interface"
import { UserInterface } from "../lib/interfaces/user.interface"

export const isOwner = (diary: DiaryInterface, currentUser: UserInterface | undefined): boolean => {
  const ownerId = diary.owner?.id  
  return currentUser?.id === ownerId
}
