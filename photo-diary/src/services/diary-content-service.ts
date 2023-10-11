import { DiaryContentInterface } from "../lib/interfaces/diary-content.interface"
import { DiaryInterface } from "../lib/interfaces/diary.interface"
import { APIService } from "./api-service"

export class DiaryContentService extends APIService {
  readDiaryContent(diary: DiaryInterface): Promise<unknown> {
    return this.methodGET(`/api/diaries/${diary.id}/diary_contents`)
  }

  addDiaryContent(diary: DiaryInterface, diaryContent: DiaryContentInterface): Promise<unknown> {
    return this.methodPOST(`/api/diaries/${diary.id}/diary_contents`, diaryContent)
  }

  deleteDiaryContent(diary: DiaryInterface, diaryContent: DiaryContentInterface): Promise<unknown> {
    return this.methodDELETE(
      `/api/diaries/${diary.id}/diary_contents/${diaryContent.id}`,
      diaryContent
    )
  }

  getImage(diary: DiaryInterface, diaryContent: DiaryContentInterface): Promise<unknown> {
    return this.methodGET(`/api/diaries/${diary.id}/diary_contents/${diaryContent.id}/image`)
  }
}
