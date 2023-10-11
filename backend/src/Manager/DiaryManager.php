<?php

namespace App\Manager;

use App\Entity\Diary;
use App\Entity\User;
use App\Repository\DiaryRepository;
use Symfony\Component\Uid\Uuid;

class DiaryManager
{
    private DiaryRepository $diaryRepository;
    private ImageManager $imageManager;

    public function __construct(DiaryRepository $diaryRepository, ImageManager $imageManager)
    {
        $this->diaryRepository = $diaryRepository;
        $this->imageManager = $imageManager;
    }

    public function create(Diary $diary): void
    {
        $this->diaryRepository->save($diary, true);
    }

    public function update(Diary $diary): void
    {
        $this->diaryRepository->save($diary, true);
    }

    public function close(Diary $diary): void
    {
        $diary->setClosedAt(new \DateTime());
        $this->diaryRepository->save($diary, true);
    }

    public function updateImage(Diary $diary): void
    {
        $imageName = Uuid::v4() . '.jpg';
        $diary->setImageFileName($imageName);
        $this->diaryRepository->save($diary, true);
    }

    public function delete(Diary $diary): void
    {
        $this->imageManager->deleteAll($diary);
        $this->diaryRepository->remove($diary, true);
    }

    public function findOwned(User $user): array | null
    {
        return $this->diaryRepository->findBy(['owner' => $user->getId()]);
    }

    public function findShared(User $user): array | null
    {
        return $this->diaryRepository->findByUserId($user->getId());
    }

    public function findUsersFCMTokens(Diary $diary): array
    {
        return $this->diaryRepository->findFCMTokensByDiary($diary);
    }
}
