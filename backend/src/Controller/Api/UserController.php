<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Manager\UserManager;
use App\Security\Voter\UserVoter;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserController extends AbstractController
{
    private UserManager $userManager;

    public function __construct(UserManager $userManager)
    {
        $this->userManager = $userManager;
    }

    #[Route('/api/users/current', methods: 'GET')]
    #[OA\Response(
        response: 200,
        description: 'Returns user',
        content: new Model(type: User::class, groups: ['api_user'])
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
        content: new Model(type: User::class, groups: ['api_user'])
    )]
    #[OA\Tag(name: 'User')]
    public function get(): Response
    {
        $user = $this->getUser();

        return $this->json($user, Response::HTTP_OK, [], ['groups' => 'api_user']);
    }

    #[Route('/api/users/{id}', methods: 'PATCH')]
    #[OA\Response(
        response: 200,
        description: 'Remove user from the diary',
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during updateUser',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
    )]
    #[OA\Parameter(
        name: 'user',
        in: 'query',
        description: 'Used to update user',
        required: 'true',
        content: new Model(type: User::class, groups: ['api_user'])
    )]
    #[OA\Tag(name: 'User')]
    #[IsGranted(UserVoter::UPDATE, 'user')]
    public function update(User $user, Request $request): Response
    {
        $requestData = json_decode($request->getContent(), true);

        try {
            if (isset($requestData['password'])) {
                $user->setPassword(isset($requestData['password']));

                $this->userManager->updatePassword($user);
            } else if (isset($requestData['fcmToken'])) {
                $user->setFcmToken($requestData['fcmToken']);

                $this->userManager->update($user);
            }
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during updateUser'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json($user, Response::HTTP_OK, [], ['groups' => 'api_user']);
    }

    #[Route('/api/users/{id}', methods: 'DELETE')]
    #[OA\Response(
        response: 200,
        description: 'Delete user',
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during updateUser',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
    )]
    #[OA\Tag(name: 'User')]
    #[IsGranted(UserVoter::DELETE, 'user')]
    public function delete(User $user): Response
    {
        try {
            $this->userManager->delete($user);
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during deleteUser'], Response::HTTP_BAD_REQUEST);
        }
        return $this->json(['code' => 200, 'message' => 'Successfully deleteUser'], Response::HTTP_OK);
    }
}
