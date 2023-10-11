<?php

namespace App\Controller\Api;

use App\Entity\Diary;
use App\Manager\DiaryManager;
use App\Manager\ImageManager;
use App\Security\Voter\DiaryVoter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class DiaryController extends AbstractController
{
    private DiaryManager $diaryManager;
    private ImageManager $imageManager;

    public function __construct(DiaryManager $diaryManager, ImageManager $imageManager)
    {
        $this->diaryManager = $diaryManager;
        $this->imageManager = $imageManager;
    }

    #[Route('/api/diaries', methods: 'GET')]
    #[OA\Response(
        response: 200,
        description: 'Returns owned and shared diaries',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: Diary::class, groups: ['api_user', 'api_diary']))
        ),
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized'
    )]
    #[OA\Tag(name: 'Diary')]
    public function getCollection(SerializerInterface $serializer): Response
    {
        $user = $this->getUser();

        $ownedDiaries = $this->diaryManager->findOwned($user);
        $sharedDiaries = $this->diaryManager->findShared($user);

        $combinedDiaries = array_merge($ownedDiaries, $sharedDiaries);

        $serializedCombinedDiaries = $serializer->serialize(
            $combinedDiaries,
            'json',
            ['groups' => ['api_user', 'api_diary', 'api_timestampable']]
        );

        return $this->json($serializedCombinedDiaries, Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }

    #[Route('/api/diaries', methods: 'POST')]
    #[OA\Response(
        response: 200,
        description: 'Create new diary',
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during addDiary',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
    )]
    #[OA\Parameter(
        name: 'diary',
        in: 'query',
        description: 'Used to create new diary',
        required: 'true',
        content: new Model(type: Diary::class, groups: ['api_user', 'api_diary'])
    )]
    #[OA\Tag(name: 'Diary')]
    public function create(Request $request, ValidatorInterface $validator): Response
    {
        $user = $this->getUser();

        $requestData = json_decode($request->getContent(), true);

        $diary = new Diary;

        try {
            $diary
                ->setOwner($user)
                ->setTitle(isset($requestData['title']) ? $requestData['title'] : null)
                ->setDescription(isset($requestData['description']) ? $requestData['description'] : null);

            $errors = $validator->validate($diary);

            if (count($errors) > 0) {
                $errorsString = (string) $errors;
                return $this->json(['code' => 400, 'message' => $errorsString], Response::HTTP_BAD_REQUEST);
            }

            $this->diaryManager->create($diary);

            if (isset($requestData['imageFileName'])) {
                $base64ImageData = $requestData['imageFileName'];
                $this->diaryManager->updateImage($diary);
                $this->imageManager->create($base64ImageData, $diary);
            }
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during addDiary'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json($requestData, Response::HTTP_OK);
    }

    #[Route('/api/diaries/{id}', methods: 'PATCH')]
    #[OA\Response(
        response: 200,
        description: 'Update diary',
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during updateDiary',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
    )]
    #[OA\Tag(name: 'Diary')]
    #[IsGranted(DiaryVoter::UPDATE, 'diary')]
    public function update(Diary $diary, Request $request): Response
    {
        $requestData = json_decode($request->getContent(), true);

        try {
            if (isset($requestData['imageFileName'])) {
                $base64ImageData = $requestData['imageFileName'];

                $this->imageManager->delete($diary);
                $this->diaryManager->updateImage($diary);
                $this->imageManager->create($base64ImageData, $diary);
            }
            $diary
                ->setTitle(isset($requestData['title']) ? $requestData['title'] : null)
                ->setDescription(isset($requestData['description']) ? $requestData['description'] : null);

            $this->diaryManager->update($diary);
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during updateDiary'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json($diary, Response::HTTP_OK, [], ['groups' => ['api_user', 'api_diary', 'api_timestampable']]);
    }

    #[Route('/api/diaries/{id}/close', methods: 'PATCH')]
    #[OA\Response(
        response: 200,
        description: 'Close diary',
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during closeDiary',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
    )]
    #[OA\Tag(name: 'Diary')]
    #[IsGranted(DiaryVoter::UPDATE, 'diary')]
    public function close(Diary $diary): Response
    {
        try {
            $this->diaryManager->close($diary);
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during closeDiary'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json(['code' => 200, 'message' => 'Successfully closeDiary'], Response::HTTP_OK);
    }

    #[Route('/api/diaries/{id}', methods: 'DELETE')]
    #[OA\Response(
        response: 200,
        description: 'Delete diary',
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during deleteDiary',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
    )]
    #[OA\Tag(name: 'Diary')]
    #[IsGranted(DiaryVoter::DELETE, 'diary')]
    public function delete(Diary $diary): Response
    {
        try {
            $this->diaryManager->delete($diary);
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during deleteDiary'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json(['code' => 200, 'message' => 'Successfully deleteDiary'], Response::HTTP_OK);
    }

    #[Route('/api/diaries/{id}/image', methods: 'GET')]
    #[OA\Response(
        response: 200,
        description: 'Returns diary image (base64)',
        content: new OA\JsonContent(
            type: 'string',
        ),
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized'
    )]
    #[OA\Response(
        response: 404,
        description: 'Image not found'
    )]
    #[OA\Tag(name: 'Diary')]
    #[IsGranted(DiaryVoter::VIEW, 'diary')]
    public function getImage(Diary $diary): Response
    {
        try {
            $imageData = $this->imageManager->get($diary);
        } catch (\Exception $e) {
            return $this->json('Image not found', Response::HTTP_NOT_FOUND);
        }

        return $this->json($imageData, Response::HTTP_OK);
    }
}
