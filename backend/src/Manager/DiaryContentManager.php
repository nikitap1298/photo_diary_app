<?php

namespace App\Manager;

use App\Entity\Diary;
use App\Entity\DiaryContent;
use App\Repository\DiaryContentRepository;
use Symfony\Component\Uid\Uuid;

class DiaryContentManager
{
    private DiaryContentRepository $diaryContentRepository;
    private ImageManager $imageManager;

    public function __construct(DiaryContentRepository $diaryContentRepository, ImageManager $imageManager)
    {
        $this->diaryContentRepository = $diaryContentRepository;
        $this->imageManager = $imageManager;
    }

    public function create(DiaryContent $diaryContent): void
    {
        $this->diaryContentRepository->save($diaryContent, true);
    }

    public function update(DiaryContent $diaryContent): void
    {
        $this->diaryContentRepository->save($diaryContent, true);
    }

    public function delete(DiaryContent $diaryContent): void
    {
        $this->diaryContentRepository->remove($diaryContent, true);
        $this->imageManager->delete($diaryContent);
    }

    public function updateImage(DiaryContent $diaryContent): void
    {
        $imageName = Uuid::v4() . '.jpg';
        $diaryContent->setImageFileName($imageName);
        $this->diaryContentRepository->save($diaryContent, true);
    }

    public function findByDiary(Diary $diary): array | null
    {
        return $this->diaryContentRepository->findBy(["diary" => $diary]);
    }
}
