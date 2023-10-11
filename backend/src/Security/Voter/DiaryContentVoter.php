<?php

namespace App\Security\Voter;

use App\Entity\DiaryContent;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;


class DiaryContentVoter extends Voter
{
    public const DELETE = 'DIARY_CONTENT_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $subject instanceof DiaryContent;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        switch ($attribute) {
            case self::DELETE:
                return $this->canDelete($subject, $user);
        }

        return false;
    }

    private function canDelete(DiaryContent $diaryContent, User $user): bool
    {
        if ($diaryContent->getDiary()->getClosedAt() !== null) {
            return false;
        }
        return $user === $diaryContent->getUser();
    }
}
