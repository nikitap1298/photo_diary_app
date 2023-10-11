<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use Gedmo\Timestampable\Traits\TimestampableEntity;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity("userName")]
#[UniqueEntity("email")]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    use TimestampableEntity;
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['api_user'])]
    private ?int $id = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private array $roles = [];

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\Unique(groups: ['string'])]
    #[Groups(['api_user'])]
    private ?string $userName = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\Email]
    #[Groups(['api_user'])]
    private ?string $email = null;


    #[ORM\Column(length: 255)]
    #[
        Assert\NotBlank(message: "Please enter a password"),
        Assert\Length(min: 8, minMessage: "Your password should be at least {{ limit }} characters")
    ]
    private ?string $password = null;

    #[ORM\Column]
    #[Groups(['api_user'])]
    private ?bool $verified = null;

    #[ORM\OneToMany(targetEntity: Diary::class, mappedBy: 'owner', orphanRemoval: true)]
    private Collection $ownedDiaries;

    #[ORM\ManyToMany(targetEntity: Diary::class, inversedBy: 'users')]
    private Collection $diaries;

    #[ORM\OneToMany(targetEntity: DiaryContent::class, mappedBy: 'user',  orphanRemoval: true)]
    private Collection $diaryContent;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $fcmToken = null;

    public function __construct()
    {
        $this->setVerified(false);
        $this->ownedDiaries = new ArrayCollection();
        $this->diaries = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserName(): ?string
    {
        return $this->userName;
    }

    public function setUserName(string $userName): static
    {
        $this->userName = $userName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function isVerified(): ?bool
    {
        return $this->verified;
    }

    public function setVerified(bool $verified): static
    {
        $this->verified = $verified;

        return $this;
    }

    /**
     * @return Collection<int, Diary>
     */
    public function getDiaries(): Collection
    {
        return $this->diaries;
    }

    public function addDiary(Diary $diary): static
    {
        if (!$this->diaries->contains($diary)) {
            $this->diaries->add($diary);
        }

        return $this;
    }

    public function removeDiary(Diary $diary): static
    {
        $this->diaries->removeElement($diary);

        return $this;
    }

    /**
     * The public representation of the user (e.g. a username, an email address, etc.)
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFcmToken(): ?string
    {
        return $this->fcmToken;
    }

    public function setFcmToken(?string $fcmToken): static
    {
        $this->fcmToken = $fcmToken;

        return $this;
    }
}
