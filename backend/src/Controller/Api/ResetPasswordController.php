<?php

namespace App\Controller\Api;

use App\Form\ChangePasswordFormType;
use App\Manager\UserManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use SymfonyCasts\Bundle\ResetPassword\Controller\ResetPasswordControllerTrait;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;
use OpenApi\Attributes as OA;

#[Route('/api/reset-password')]
class ResetPasswordController extends AbstractController
{
    use ResetPasswordControllerTrait;

    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private EntityManagerInterface $entityManager,
        private UserManager $userManager
    ) {
    }

    #[Route('', name: 'app_forgot_password_request', methods: 'POST')]
    #[OA\Response(
        response: 200,
        description: 'Successfully sendResetPasswordMail',
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during sendResetPasswordMail',
    )]
    #[OA\Response(
        response: 404,
        description: 'User not found',
    )]
    #[OA\Parameter(
        name: 'email',
        in: 'query',
        description: 'Used for sending reset password link',
        required: 'true',
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Tag(name: 'Reset Password')]
    public function sendResetPasswordMail(Request $request): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $email = isset($requestData['email']) ? $requestData['email'] : null;

        $user = $this->userManager->findOneByEmail($email);

        if (!$user) {
            return $this->json(['code' => 404, 'message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        try {
            $resetToken = $this->resetPasswordHelper->generateResetToken($user);
            $this->userManager->sendResetPassword($user, $resetToken);
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during sendResetPasswordMail'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json(['code' => 200, 'message' => 'Successfully sendResetPasswordMail'], Response::HTTP_OK);
    }

    #[Route('/reset/{token}', name: 'app_reset_password', methods: ['GET', 'POST'])]
    #[OA\Response(
        response: 200,
        description: 'Successfully reset',
    )]
    #[OA\Response(
        response: 400,
        description: 'An error occurred during reset.',
    )]
    #[OA\Response(
        response: 404,
        description: 'No reset password token found in the URL or in the session.',
    )]
    #[OA\Tag(name: 'Reset Password')]
    public function reset(Request $request, UserPasswordHasherInterface $passwordHasher, string $token = null): Response
    {
        if ($token) {
            $this->storeTokenInSession($token);

            return $this->redirectToRoute('app_reset_password');
        }

        $token = $this->getTokenFromSession();

        if (!$token) {
            return $this->json('No reset password token found in the URL or in the session.', Response::HTTP_NOT_FOUND);
        }

        try {
            $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        } catch (\Exception $e) {
            return $this->json(['code' => 400, 'message' => 'An error occurred during reset'], Response::HTTP_BAD_REQUEST);
        }

        $form = $this->createForm(ChangePasswordFormType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->resetPasswordHelper->removeResetRequest($token);

            $encodedPassword = $passwordHasher->hashPassword(
                $user,
                $form->get('plainPassword')->getData()
            );

            $user->setPassword($encodedPassword);
            $this->entityManager->flush();

            $this->cleanSessionAfterReset();

            return $this->render('reset_password/confirmation_template.html.twig');
        }

        return $this->render('reset_password/reset.html.twig', [
            'resetForm' => $form->createView(),
        ]);
    }
}
