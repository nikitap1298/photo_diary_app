<?php

namespace App\Controller\Api;

use App\Entity\Diary;
use App\Entity\User;
use App\Manager\DiaryManager;
use App\Manager\PushNotificationManager;
use App\Manager\UserManager;
use App\Security\Voter\DiaryVoter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserHandlingController extends AbstractController
{

    private UserManager $userManager;
    private DiaryManager $diaryManager;
    private PushNotificationManager $pushNotificationManager;

    public function __construct(UserManager $userManager, DiaryManager $diaryManager, PushNotificationManager $pushNotificationManager)
    {
        $this->userManager = $userManager;
        $this->diaryManager = $diaryManager;
        $this->pushNotificationManager = $pushNotificationManager;
    }

    #[Route('/api/diaries/{id}/users', methods: 'GET')]
    #[OA\Response(
        response: 200,
        description: 'Returns diary users',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: User::class, groups: ['api_user', 'api_diary_content']))
        ),
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized'
    )]
    #[OA\Tag(name: 'UserHandling')]
    public function readDiaryUsers(Diary $diary): Response
    {
        $diaryUsers = $diary->getUsers();
        return $this->json($diaryUsers, Response::HTTP_OK, [], ['groups' => ['api_user', 'api_diary_content']]);
    }

    #[Route('/api/diaries/{id}/invite', methods: 'PATCH')]
    #[OA\Response(
        response: 200,
        description: 'Invite user to the diary',
    )]
    #[OA\Response(
        response: 400,
        description: 'Email not provided',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
    )]
    #[OA\Response(
        response: 404,
        description: 'Invited user not found or not verified',
    )]
    #[OA\Parameter(
        name: 'email',
        in: 'query',
        description: 'Used to invite user',
        required: 'true',
        schema: new OA\Schema(type: 'string',)
    )]
    #[OA\Tag(name: 'UserHandling')]
    #[IsGranted(DiaryVoter::INVITE, 'diary')]
    public function inviteUser(Request $request, Diary $diary): Response
    {
        $content = json_decode($request->getContent(), true);
        $email = $content['email'] ?? null;

        if (!$email) {
            return $this->json(['code' => 400, 'message' => 'Email not provided'], Response::HTTP_BAD_REQUEST);
        }

        $invitedUser = $this->userManager->findOneByEmail($email);

        if (!$invitedUser || !$invitedUser->isVerified()) {
            return $this->json(['code' => 404, 'message' => 'Invited user not found or not verified'], Response::HTTP_NOT_FOUND);
        }

        $diary->addUser($invitedUser);
        $this->diaryManager->update($diary);
        $this->pushNotificationManager->sendAboutAddUser($invitedUser, $diary);

        return $this->json(['code' => 200, 'message' => 'Successfully inviteUser'], Response::HTTP_OK);
    }

    #[Route('/api/diaries/{id}/remove', methods: 'PATCH')]
    #[OA\Response(
        response: 200,
        description: 'Remove user from the diary',
    )]
    #[OA\Response(
        response: 400,
        description: 'userId not provided',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
    )]
    #[OA\Response(
        response: 404,
        description: 'Removed user not found',
    )]
    #[OA\Parameter(
        name: 'userId',
        in: 'query',
        description: 'Used to remove user',
        required: 'true',
        schema: new OA\Schema(type: 'string',)
    )]
    #[OA\Tag(name: 'UserHandling')]
    public function removeUserFromDiary(Request $request, Diary $diary): Response
    {
        $content = json_decode($request->getContent(), true);
        $removedUserId = $content['userId'] ?? null;

        if (!$removedUserId) {
            return $this->json(['code' => 400, 'message' => 'userId not provided'], Response::HTTP_BAD_REQUEST);
        }

        $removedUser = $this->userManager->findById($removedUserId);

        if (!$removedUser) {
            return $this->json(['code' => 404, 'message' => 'Removed user not found'], Response::HTTP_NOT_FOUND);
        }

        $diary->removeUser($removedUser);
        $this->diaryManager->update($diary);

        return $this->json(['code' => 200, 'message' => 'Successfully removeUserFromDiary'], Response::HTTP_OK);
    }
}
