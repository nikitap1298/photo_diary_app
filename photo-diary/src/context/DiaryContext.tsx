import React, { useContext, useEffect, useState } from "react"
import { ContextProviderProps } from "../lib/custom-types/custom-types"
import { DiaryInterface } from "../lib/interfaces/diary.interface"
import { useUserContext } from "./UserContext"
import { DiaryService } from "../services/diary-service"
import { Diary } from "../model/diary.model"
import { isOwner } from "../utils/IsOwner"
import { Photo } from "@capacitor/camera"
import { Storage } from "@ionic/storage"
import { StorageKeys } from "../lib/enums/StorageKeys"

interface DiaryContextInterface {
  diaries: DiaryInterface[]
  fetchDiariesFromDB: () => void
  addNewDiary: (title: string, description: string, photo?: Photo) => void
  updateDiary: (diary: DiaryInterface) => void
  closeDiary: (diary: DiaryInterface) => void
  deleteDiary: (diary: DiaryInterface) => void
  getImage: (diary: DiaryInterface) => Promise<string>
  refreshDiary: () => void
  showPrivateDiaries: () => void
  showClosedDiaries: () => void
  currentDiary: DiaryInterface
  fillCurrentDiary: (diary: DiaryInterface) => void
}

const DiaryContext = React.createContext<DiaryContextInterface>({
  diaries: [],
  fetchDiariesFromDB: () => void {},
  addNewDiary: () => void {},
  updateDiary: () => void {},
  closeDiary: () => void {},
  deleteDiary: () => void {},
  getImage: async () => "",
  refreshDiary: () => void {},
  showPrivateDiaries: () => void {},
  showClosedDiaries: () => void {},
  currentDiary: {},
  fillCurrentDiary: () => void {},
})

export const DiaryContextProvider = ({ children }: ContextProviderProps): JSX.Element => {
  const { currentUser } = useUserContext()
  const [diaries, setDiaries] = useState<DiaryInterface[]>([])
  const [currentDiary, setCurrentDiary] = useState<DiaryInterface>({})
  const [isRefreshDiary, setIsRefreshDiary] = useState<boolean>(false)
  const [isPrivateDiaries, setIsPrivateDiaries] = useState<boolean>(false)
  const [isClosedDiaries, setIsClosedDiaries] = useState<boolean>(false)

  const diaryService = new DiaryService()
  const storage = new Storage()
  storage.create()

  useEffect(() => {
    fetchDiariesFromDB()
    showPrivateDiaries()
    showClosedDiaries()
  }, [isRefreshDiary])

  const fetchDiariesFromDB = async (): Promise<void> => {
    try {
      await diaryService.readDiaries().then((d) => {
        const data = JSON.parse(d as string) as DiaryInterface[]
        const diaries: DiaryInterface[] = []
        data.forEach((i) => {
          const diary = new Diary().deserialize(i)
          diaries.push(diary)
        })
        setDiaries(diaries)
      })
    } catch (err) {
      throw new Error(`Error with readDiaries: ${err}`)
    }
  }

  const addNewDiary = async (title: string, description: string, photo?: Photo): Promise<void> => {
    const base64Data = photo?.base64String
    if (title !== "") {
      try {
        await diaryService
          .addDiary({
            owner: currentUser,
            title: title,
            description: description,
            imageFileName: base64Data,
          })
          .then(() => {
            setIsRefreshDiary(!isRefreshDiary)
          })
      } catch (err) {
        throw new Error(`Error with addDiary: ${err}`)
      }
    }
  }

  const updateDiary = async (diary: DiaryInterface): Promise<void> => {
    try {
      await diaryService.updateDiary(diary).then(async (data) => {
        const diary = new Diary().deserialize(data as DiaryInterface)
        diary.imageFileName = await getImage(diary)
        setCurrentDiary(diary)
      })
    } catch (err) {
      throw new Error(`Error with updateDiary: ${err}`)
    }
  }

  const closeDiary = async (diary: DiaryInterface): Promise<void> => {
    try {
      await diaryService.closeDiary(diary).then(() => {
        window.location.reload()
      })
    } catch (err) {
      throw new Error(`Error with closeDiary: ${err}`)
    }
  }

  const deleteDiary = async (diary: DiaryInterface): Promise<void> => {
    const deletedDiary = diaries.find((element) => element.id === diary.id) as DiaryInterface
    if (isOwner(deletedDiary, currentUser)) {
      try {
        await diaryService.deleteDiary(deletedDiary).then(() => {
          window.location.reload()
        })
      } catch (err) {
        throw new Error(`Error with deleteDiary: ${err}`)
      }
    }
  }

  const getImage = async (diary: DiaryInterface): Promise<string> => {
    try {
      return (await diaryService.getImage(diary)) as string
    } catch (err) {
      throw new Error(`Error with getImage: ${err}`)
    }
  }

  const refreshDiary = (): void => {
    setIsRefreshDiary(!isRefreshDiary)
  }

  const showPrivateDiaries = async (): Promise<void> => {
    const diariesPrivateToggleStorage = await storage.get(StorageKeys.DIARIES_PRIVATE_TOGGLE)
    setIsPrivateDiaries(diariesPrivateToggleStorage as boolean)
  }

  const showClosedDiaries = async (): Promise<void> => {
    const diariesClosedToggleStorage = await storage.get(StorageKeys.DIARIES_CLOSED_TOGGLE)
    setIsClosedDiaries(diariesClosedToggleStorage as boolean)
  }

  const fillCurrentDiary = (diary: DiaryInterface): void => {
    setCurrentDiary(diary)
  }

  const filteredPrivateDiaries = isPrivateDiaries
    ? diaries.filter((diary) => diary.owner?.id === currentUser?.id && !diary.users?.length)
    : diaries

  const filteredClosedDiaries = isClosedDiaries
    ? filteredPrivateDiaries.filter((diary) => diary.closedAt !== null)
    : filteredPrivateDiaries.filter((diary) => diary.closedAt === null)

  return (
    <DiaryContext.Provider
      value={{
        diaries: filteredClosedDiaries,
        fetchDiariesFromDB,
        addNewDiary,
        updateDiary,
        closeDiary,
        deleteDiary,
        getImage,
        refreshDiary,
        showPrivateDiaries,
        showClosedDiaries,
        currentDiary,
        fillCurrentDiary,
      }}
    >
      {children}
    </DiaryContext.Provider>
  )
}

export const useDiaryContext = (): DiaryContextInterface => useContext(DiaryContext)
