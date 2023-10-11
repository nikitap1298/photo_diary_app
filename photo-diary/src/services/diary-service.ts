import { DiaryInterface } from "../lib/interfaces/diary.interface"
import { APIService } from "./api-service"

export class DiaryService extends APIService {
  readDiaries(): Promise<unknown> {
    return this.methodGET(`/api/diaries`)
  }

  addDiary(diary: DiaryInterface): Promise<unknown> {
    return this.methodPOST(`/api/diaries`, diary)
  }

  updateDiary(diary: DiaryInterface): Promise<unknown> {
    return this.methodPATCH(`/api/diaries/${diary.id}`, diary)
  }

  closeDiary(diary: DiaryInterface): Promise<unknown> {
    return this.methodPATCH(`/api/diaries/${diary.id}/close`, diary)
  }

  deleteDiary(diary: DiaryInterface): Promise<unknown> {
    return this.methodDELETE(`/api/diaries/${diary.id}`, {})
  }

  getImage(diary: DiaryInterface): Promise<unknown> {
    return this.methodGET(`/api/diaries/${diary.id}/image`)
  }
}
