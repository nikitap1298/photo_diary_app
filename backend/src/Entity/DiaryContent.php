<?php

namespace App\Entity;

use App\Interface\ImageHandlingInterface;
use App\Repository\DiaryContentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DiaryContentRepository::class)]
class DiaryContent implements ImageHandlingInterface
{
    use TimestampableEntity;
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['api_diary_content'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['api_diary_content'])]
    private ?string $text = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['api_diary_content'])]
    private $imageFileName = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['api_diary_content'])]
    private ?string $latitude = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(['api_diary_content'])]
    private ?string $longitude = null;

    #[ORM\ManyToOne(inversedBy: 'diaryContents')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotBlank]
    #[Groups(['api_diary_content'])]
    private ?Diary $diary = null;

    #[ORM\ManyToOne(inversedBy: 'diaryContent')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotBlank]
    #[Groups(['api_diary_content'])]
    private ?User $user = null;

    public function __construct()
    {
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(?string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function getImageFileName()
    {
        return $this->imageFileName;
    }

    public function setImageFileName(?string $imageFileName): self
    {
        $this->imageFileName = $imageFileName;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(?string $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(?string $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getDiary(): ?Diary
    {
        return $this->diary;
    }

    public function setDiary(?Diary $diary): self
    {
        $this->diary = $diary;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getDiaryId(): int
    {
        return $this->getDiary()->getId();
    }

    public function getFilename(): ?string
    {
        return $this->getImageFileName();
    }
}
