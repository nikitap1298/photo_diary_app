<?php

namespace App\Security\Voter;

use App\Entity\Diary;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class DiaryVoter extends Voter
{
    public const UPDATE = 'DIARY_UPDATE';
    public const DELETE = 'DIARY_DELETE';
    public const INVITE = 'DIARY_INVITE';
    public const VIEW = 'DIARY_VIEW';

    public const VIEW_CONTENT = 'DIARY_VIEW_CONTENT';
    public const ADD_CONTENT = 'DIARY_ADD_CONTENT';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $subject instanceof Diary;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        $diary = $subject;

        switch ($attribute) {
            case self::UPDATE:
            case self::DELETE:
            case self::INVITE:
                return $this->isOwner($diary, $user);
            case self::VIEW:
            case self::VIEW_CONTENT:
                return $this->isDiaryUserOrOwner($diary, $user);
            case self::ADD_CONTENT:
                return $this->canAddContent($diary, $user);
        }

        return false;
    }

    private function isOwner(Diary $diary, User $user): bool
    {
        return $user === $diary->getOwner();
    }

    public function isDiaryUserOrOwner(Diary $diary, User $user): bool
    {
        $diaryUsers = $diary->getUsers()->toArray();

        if ($user === $diary->getOwner()) {
            return true;
        } else if (in_array($user, $diaryUsers)) {
            return true;
        }
        return false;
    }

    public function canAddContent(Diary $diary, User $user): bool
    {
        if ($diary->getClosedAt() !== null) {
            return false;
        }

        $diaryUsers = $diary->getUsers()->toArray();

        if ($user === $diary->getOwner()) {
            return true;
        } else if (in_array($user, $diaryUsers)) {
            return true;
        }

        return false;
    }
}
