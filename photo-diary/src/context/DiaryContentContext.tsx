import React, { useContext, useEffect, useState } from "react"
import { DiaryContentInterface } from "../lib/interfaces/diary-content.interface"
import { ContextProviderProps } from "../lib/custom-types/custom-types"
import { DiaryContentService } from "../services/diary-content-service"
import { useUserContext } from "./UserContext"
import { useDiaryContext } from "./DiaryContext"
import { DiaryContent } from "../model/diary-content.model"
import { Photo } from "@capacitor/camera"
import { useToastContext } from "./ToastContext"

interface DiaryContentContextInterface {
  diaryContents: DiaryContentInterface[]
  addDiaryContent: (text?: string, photo?: Photo) => void
  deleteDiaryContent: (diaryContent: DiaryContentInterface) => void
  getImage: (diaryContent: DiaryContentInterface) => Promise<string>
  fillCurrentDiaryContent: (diaryContent: DiaryContentInterface) => void
  currentDiaryContent: DiaryContentInterface
}

const DiaryContentContext = React.createContext<DiaryContentContextInterface>({
  diaryContents: [],
  addDiaryContent: () => void {},
  deleteDiaryContent: () => void {},
  getImage: async () => "",
  fillCurrentDiaryContent: () => void {},
  currentDiaryContent: {},
})

export const DiaryContentContextProvider = ({ children }: ContextProviderProps): JSX.Element => {
  const { addToast } = useToastContext()
  const { currentUser } = useUserContext()
  const { currentDiary } = useDiaryContext()
  const [diaryContents, setDiaryContents] = useState<DiaryContentInterface[]>([])
  const [refreshDiaryContents, setRefreshDiaryContents] = useState<boolean>(false)
  const [currentDiaryContent, setCurrentDiaryContent] = useState<DiaryContentInterface>({})

  const diaryContentService = new DiaryContentService()

  useEffect(() => {
    fetchDiaryContents()
  }, [refreshDiaryContents])

  const fetchDiaryContents = async (): Promise<void> => {
    try {
      await diaryContentService.readDiaryContent(currentDiary).then((d) => {
        const data = d as DiaryContentInterface[]
        const diaryContents: DiaryContentInterface[] = []
        data.forEach((i) => {
          const diaryContent = new DiaryContent().deserialize(i)
          diaryContents.push(diaryContent)
        })
        setDiaryContents(diaryContents)
      })
    } catch (err) {
      throw new Error(`Error with fetchDiariesContent: ${err}`)
    }
  }

  const addDiaryContent = async (text?: string, photo?: Photo): Promise<void> => {
    const base64Data = photo?.base64String

    if (text !== "" || base64Data != null) {
      try {
        await diaryContentService
          .addDiaryContent(currentDiary, {
            diary: currentDiary,
            user: currentUser,
            text: text,
            imageFileName: base64Data,
          })
          .then(() => {
            setRefreshDiaryContents(!refreshDiaryContents)
          })
      } catch (err) {
        addToast({
          message: "Unable to send message",
          variant: "danger",
          isAutohide: true,
        })
        throw new Error(`Error with addDiaryContent: ${err}`)
      }
    }
  }

  const deleteDiaryContent = async (diaryContent: DiaryContentInterface): Promise<void> => {
    const deletedDiaryContent = diaryContents.find(
      (element) => element.id === diaryContent.id
    ) as DiaryContentInterface
    const newDiaryContentArray = diaryContents.filter((element) => element.id !== diaryContent.id)

    try {
      await diaryContentService.deleteDiaryContent(currentDiary, deletedDiaryContent).then(() => {
        setDiaryContents(newDiaryContentArray)
      })
    } catch (err) {
      addToast({
        message: "Unable to delete message",
        variant: "danger",
        isAutohide: true,
      })
      throw new Error(`Error with deleteDiary: ${err}`)
    }
  }

  const getImage = async (diaryContent: DiaryContentInterface): Promise<string> => {
    try {
      return (await diaryContentService.getImage(currentDiary, diaryContent)) as string
    } catch (err) {
      throw new Error(`Error with getImage: ${err}`)
    }
  }

  const fillCurrentDiaryContent = (diaryContent: DiaryContentInterface): void => {
    setCurrentDiaryContent(diaryContent)
  }

  return (
    <DiaryContentContext.Provider
      value={{
        diaryContents,
        addDiaryContent,
        deleteDiaryContent,
        getImage,
        fillCurrentDiaryContent,
        currentDiaryContent,
      }}
    >
      {children}
    </DiaryContentContext.Provider>
  )
}

export const useDiaryContentContext = (): DiaryContentContextInterface =>
  useContext(DiaryContentContext)
