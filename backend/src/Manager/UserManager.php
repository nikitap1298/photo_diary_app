<?php

namespace App\Manager;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Security\EmailVerifier;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use SymfonyCasts\Bundle\ResetPassword\Model\ResetPasswordToken;

class UserManager
{
    private UserRepository $userRepository;
    private UserPasswordHasherInterface $userPasswordHasher;
    private EmailVerifier $emailVerifier;
    private MailerInterface $mailer;

    public function __construct(
        UserRepository $userRepository,
        UserPasswordHasherInterface $userPasswordHasher,
        EmailVerifier $emailVerifier,
        MailerInterface $mailer
    ) {
        $this->userRepository = $userRepository;
        $this->userPasswordHasher = $userPasswordHasher;
        $this->emailVerifier = $emailVerifier;
        $this->mailer = $mailer;
    }

    public function create(User $user): void
    {
        $user->setPassword(
            $this->userPasswordHasher->hashPassword(
                $user,
                $user->getPassword()
            )
        );
        $this->userRepository->save($user, true);
        $this->sendEmailConfirmation($user);
    }

    public function update(User $user): void
    {
        $this->userRepository->save($user, true);
    }

    public function delete(User $user): void
    {
        $this->userRepository->remove($user, true);
    }

    public function updatePassword(User $user): void
    {
        $user->setPassword(
            $this->userPasswordHasher->hashPassword(
                $user,
                $user->getPassword()
            )
        );
        $this->userRepository->save($user, true);
    }

    public function findById(int $id): User | null
    {
        return $this->userRepository->find($id);
    }

    public function findOneByEmail(string $email): User | null
    {
        return $this->userRepository->findOneBy(['email' => $email]);
    }

    public function sendEmailConfirmation(User $user): void
    {
        $this->emailVerifier->sendEmailConfirmation(
            'app_verify_email',
            $user,
            (new TemplatedEmail())
                ->from(new Address('pdmailer@example.com', 'Photo Diary Mail Bot'))
                ->to($user->getEmail())
                ->subject('Please Confirm your Email')
                ->htmlTemplate('registration/confirmation_email.html.twig')
        );
    }

    public function sendResetPassword(User $user, ResetPasswordToken $resetToken): void
    {
        $email = (new TemplatedEmail())
            ->from(new Address('pdmailer@example.com', 'Photo Diary Mail Bot'))
            ->to($user->getEmail())
            ->subject('Your password reset request')
            ->htmlTemplate('reset_password/email.html.twig')
            ->context([
                'resetToken' => $resetToken,
            ]);

        $this->mailer->send($email);
    }
}
