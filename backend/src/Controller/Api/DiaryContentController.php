<?php

namespace App\Controller\Api;

use App\Entity\Diary;
use App\Entity\DiaryContent;
use App\Manager\DiaryContentManager;
use App\Manager\ImageManager;
use App\Manager\PushNotificationManager;
use App\Security\Voter\DiaryContentVoter;
use App\Security\Voter\DiaryVoter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class DiaryContentController extends AbstractController
{
    private DiaryContentManager $diaryContentManager;
    private ImageManager $imageManager;
    private PushNotificationManager $pushNotificationManager;

    public function __construct(DiaryContentManager $diaryContentManager, ImageManager $imageManager, PushNotificationManager $pushNotificationManager)
    {
        $this->diaryContentManager = $diaryContentManager;
        $this->imageManager = $imageManager;
        $this->pushNotificationManager = $pushNotificationManager;
    }

    #[Route('/api/diaries/{id}/diary_contents', methods: 'GET')]
    #[OA\Response(
        response: 200,
        description: 'Returns diary contents',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: DiaryContent::class, groups: ['api_user', 'api_diary', 'api_diary_content']))
        ),
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized'
    )]
    #[OA\Tag(name: 'DiaryContent')]
    #[IsGranted(DiaryVoter::VIEW_CONTENT, 'diary')]
    public function getCollection(Diary $diary): Response
    {
        $diaryContents = $this->diaryContentManager->findByDiary($diary);
        return $this->json($diaryContents, Response::HTTP_OK, [], ['groups' => ['api_user', 'api_diary', 'api_diary_content', 'api_timestampable']]);
    }

    #[Route('/api/diaries/{id}/diary_contents', methods: 'POST')]
    #[OA\Response(
        response: 200,
        description: 'Create new diary content',
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during addDiaryContent',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
    )]
    #[OA\Parameter(
        name: 'diary content',
        in: 'query',
        description: 'Used to create new diary content',
        required: 'true',
        content: new Model(type: DiaryContent::class, groups: ['api_user', 'api_diary', 'api_diary_content'])
    )]
    #[OA\Tag(name: 'DiaryContent')]
    #[IsGranted(DiaryVoter::ADD_CONTENT, 'diary')]
    public function create(Diary $diary, Request $request, ValidatorInterface $validator): Response
    {
        $user = $this->getUser();

        $requestData = json_decode($request->getContent(), true);

        $diaryContent = new DiaryContent;

        try {
            $diaryContent
                ->setDiary($diary)
                ->setText(isset($requestData['text']) ? $requestData['text'] : null)
                ->setUser($user);

            $errors = $validator->validate($diaryContent);

            if (count($errors) > 0) {
                $errorsString = (string) $errors;
                return $this->json(['code' => 400, 'message' => $errorsString], Response::HTTP_BAD_REQUEST);
            }

            $this->diaryContentManager->create($diaryContent);

            if (isset($requestData['imageFileName'])) {
                $base64ImageData = $requestData['imageFileName'];
                $this->diaryContentManager->updateImage($diaryContent);
                $this->imageManager->create($base64ImageData, $diaryContent);
            }
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during addDiaryContent'], Response::HTTP_BAD_REQUEST);
        }

        if (count($diary->getUsers()) > 0) {
            $this->pushNotificationManager->sendAboutNewContent($diary);
        }

        return $this->json(['code' => 200, 'message' => 'Successfully addDiaryContent'], Response::HTTP_OK);
    }

    #[Route('/api/diaries/{diary}/diary_contents/{diaryContent}', methods: 'DELETE')]
    #[OA\Response(
        response: 200,
        description: 'Delete diaryContent',
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during diaryContent',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
    )]
    #[OA\Tag(name: 'DiaryContent')]
    #[IsGranted(DiaryContentVoter::DELETE, 'diaryContent')]
    public function delete(DiaryContent $diaryContent): Response
    {
        try {
            $this->diaryContentManager->delete($diaryContent);
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during deleteDiaryContent'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json(['code' => 200, 'message' => 'Successfully deleteDiaryContent'], Response::HTTP_OK);
    }

    #[Route('/api/diaries/{diary}/diary_contents/{diaryContent}/image', methods: 'GET')]
    #[OA\Response(
        response: 200,
        description: 'Returns diaryContent image (base64)',
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
    #[OA\Tag(name: 'DiaryContent')]
    #[IsGranted(DiaryVoter::VIEW_CONTENT, 'diary')]
    public function getImage(Diary $diary, DiaryContent $diaryContent): Response
    {
        try {
            $imageData = $this->imageManager->get($diaryContent);
        } catch (\Exception $e) {
            return $this->json('Image not found', Response::HTTP_NOT_FOUND);
        }

        return $this->json($imageData, Response::HTTP_OK);
    }
}
