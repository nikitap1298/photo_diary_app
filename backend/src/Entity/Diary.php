<?php

namespace App\Entity;

use App\Interface\ImageHandlingInterface;
use App\Repository\DiaryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DiaryRepository::class)]
class Diary implements ImageHandlingInterface
{
    use TimestampableEntity;
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['api_diary'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'ownedDiaries')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotBlank]
    #[Groups(['api_diary'])]
    private ?User $owner = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['api_diary'])]
    private $imageFileName = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['api_diary'])]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['api_diary'])]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['api_diary'])]
    private ?\DateTime $closedAt = null;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'diaries')]
    #[Groups(['api_diary'])]
    private Collection $users;

    #[ORM\OneToMany(mappedBy: 'diary', targetEntity: DiaryContent::class, orphanRemoval: true)]
    private Collection $diaryContents;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->diaryContents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(User $owner): self
    {
        $this->owner = $owner;

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

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getClosedAt(): ?\DateTime
    {
        return $this->closedAt;
    }

    public function setClosedAt(?\DateTime $closeAt): self
    {
        $this->closedAt = $closeAt;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->addDiary($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->removeElement($user)) {
            $user->removeDiary($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, DiaryContent>
     */
    public function getDiaryContents(): Collection
    {
        return $this->diaryContents;
    }

    public function addDiaryContent(DiaryContent $diaryContent): self
    {
        if (!$this->diaryContents->contains($diaryContent)) {
            $this->diaryContents->add($diaryContent);
            $diaryContent->setDiary($this);
        }

        return $this;
    }

    public function removeDiaryContent(DiaryContent $diaryContent): self
    {
        if ($this->diaryContents->removeElement($diaryContent)) {
            // set the owning side to null (unless already changed)
            if ($diaryContent->getDiary() === $this) {
                $diaryContent->setDiary(null);
            }
        }

        return $this;
    }

    public function getDiaryId(): int
    {
        return $this->id;
    }

    public function getFilename(): ?string
    {
        return $this->getImageFileName();
    }
}
