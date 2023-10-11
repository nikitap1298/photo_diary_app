import React from "react"
import { useDiaryContext } from "../../context/DiaryContext"
import DiaryRow from "./DiaryRow"
import { DiaryInterface } from "../../lib/interfaces/diary.interface"

export default function DiaryRows(): JSX.Element {
  const { diaries, deleteDiary } = useDiaryContext()

  return (
    <>
      {diaries.map((diary: DiaryInterface) => (
        <DiaryRow key={diary.id} diary={diary} onDelete={deleteDiary} />
      ))}
    </>
  )
}
