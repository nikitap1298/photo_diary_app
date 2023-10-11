import { DiaryInterface } from "../lib/interfaces/diary.interface"
import { UserInterface } from "../lib/interfaces/user.interface"
import { APIService } from "./api-service"

export class UserHandlingService extends APIService {
  readDiaryUsers(diary: DiaryInterface): Promise<unknown> {
    return this.methodGET(`/api/diaries/${diary.id}/users`)
  }

  inviteUser(diary: DiaryInterface, email: string): Promise<unknown> {
    return this.methodPATCH(`/api/diaries/${diary.id}/invite`, { email: email })
  }

  removeUserFromDiary(diary: DiaryInterface, user: UserInterface): Promise<unknown> {
    return this.methodPATCH(`/api/diaries/${diary.id}/remove`, {
      userId: user.id,
    })
  }
}
