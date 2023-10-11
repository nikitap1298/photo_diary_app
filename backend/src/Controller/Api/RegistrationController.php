<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Manager\UserManager;
use App\Security\EmailVerifier;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use OpenApi\Attributes as OA;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegistrationController extends AbstractController
{
    private EmailVerifier $emailVerifier;
    private UserManager $userManager;

    public function __construct(EmailVerifier $emailVerifier, UserManager $userManager)
    {
        $this->emailVerifier = $emailVerifier;
        $this->userManager = $userManager;
    }

    #[Route('/api/users', methods: 'POST')]
    #[OA\Response(
        response: 200,
        description: 'Create new user',
        content: new Model(type: User::class, groups: ['api_user'])
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during registerUser',
    )]
    #[OA\Parameter(
        name: 'user',
        in: 'query',
        description: 'Used to create new user',
        required: 'true',
        content: new Model(type: User::class, groups: ['api_user'])
    )]
    #[OA\Tag(name: 'User')]
    public function registerUser(Request $request, ValidatorInterface $validator): Response
    {
        $requestData = json_decode($request->getContent(), true);

        $user = new User;

        try {
            $user
                ->setRoles(['ROLE_USER'])
                ->setUserName(isset($requestData['userName']) ? $requestData['userName'] : null)
                ->setEmail(isset($requestData['email']) ? $requestData['email'] : null)
                ->setPassword(isset($requestData['password']) ? $requestData['password'] : null);

            $errors = $validator->validate($user);

            if (count($errors) > 0) {
                $errorsString = (string) $errors;
                return $this->json(['code' => 400, 'message' => $errorsString], Response::HTTP_BAD_REQUEST);
            }

            $this->userManager->create($user);
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during registerUser'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json(['code' => 200, 'message' => 'Successfully registered'], Response::HTTP_OK);
    }

    #[Route('/api/users/{id}/verify', methods: 'POST')]
    #[OA\Response(
        response: 200,
        description: 'Send verification mail',
        content: new Model(type: User::class, groups: ['api_user'])
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during verifyUser',
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthorized',
        content: new Model(type: User::class, groups: ['api_user'])
    )]
    #[OA\Tag(name: 'User')]
    public function verifyUser(UserManager $userManager): Response
    {
        $user = $this->getUser();

        try {
            $userManager->sendEmailConfirmation($user);
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during verifyUser'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json(['code' => 200, 'message' => 'Verification email sent'], Response::HTTP_OK);
    }

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(Request $request, TranslatorInterface $translator): Response
    {
        $id = $request->query->get('id');

        $user = $this->userManager->findById($id);

        // validate email confirmation link, sets User::isVerified=true and persists
        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $translator->trans($exception->getReason(), [], 'VerifyEmailBundle'));
        }

        $this->addFlash('success', 'Your email address has been verified.');

        return $this->render('registration/confirmation_template.html.twig');
    }
}
