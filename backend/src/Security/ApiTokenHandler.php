<?php

namespace App\Security;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping\Id;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class ApiTokenHandler implements AuthenticationSuccessHandlerInterface
{

    private JWTTokenManagerInterface $jwtManager;

    private SerializerInterface $serializer;

    public function __construct(JWTTokenManagerInterface $jwtManager, SerializerInterface $serializerInterface)
    {
        $this->jwtManager = $jwtManager;
        $this->serializer = $serializerInterface;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        $user = $token->getUser();

        // Generate the token
        $tokenValue = $this->jwtManager->create($user);

        $data = ['token' => $tokenValue, 'user' => $user];

        $json = $this->serializer->serialize($data, 'json', [
            'groups' => ['api_user']
        ]);

        return new JsonResponse($json, 200, [], true);
    }
}