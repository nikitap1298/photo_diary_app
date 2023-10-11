<?php

namespace App\Controller\Admin;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminPanelUserController extends AbstractController
{
    #[Route('/admin/panel/user', name: 'app_admin_panel_user', methods: ["GET"])]
    public function index(UserRepository $userRepository): Response
    {
        $users = $userRepository->findAll();

        return $this->render('admin_panel/index.html.twig', [
            "users" => $users,
        ]);
    }

    #[Route('/admin/panel/logout', name: 'app_admin_logout', methods: ['POST'])]
    public function logout(): never
    {
        // controller can be blank: it will never be called!
        throw new \Exception('Don\'t forget to activate logout in security.yaml');
    }
}
