<?php

namespace App\Manager;

use App\Entity\Diary;
use App\Entity\User;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\ApnsConfig;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class PushNotificationManager
{
    private Messaging $messaging;
    private DiaryManager $diaryManager;

    public function __construct(Messaging $messaging, DiaryManager $diaryManager)
    {
        $this->messaging = $messaging;
        $this->diaryManager = $diaryManager;
    }

    private function getDiaryUsersFCMTokens(Diary $diary): array
    {
        return $this->diaryManager->findUsersFCMTokens($diary);
    }

    public function sendAboutAddUser(User $user, Diary $diary): void
    {
        if ($user->getFcmToken()) {
            $deviceToken = $user->getFcmToken();

            $message = CloudMessage::withTarget('token', $deviceToken)
                ->withNotification(Notification::create('Photo Diary', 'You were added to ' . $diary->getTitle()))
                ->withHighestPossiblePriority()
                ->withDefaultSounds();

            $this->messaging->send($message);
        }
    }

    public function sendAboutNewContent(Diary $diary): void
    {
        $deviceTokens = $this->getDiaryUsersFCMTokens($diary);

        $message = CloudMessage::new()
            ->withNotification(Notification::create('Photo Diary', 'New message in ' . $diary->getTitle()))
            ->withHighestPossiblePriority()
            ->withDefaultSounds();

        if (count($deviceTokens) > 0) {
            $this->messaging->sendMulticast($message, $deviceTokens);
        }
    }
}
