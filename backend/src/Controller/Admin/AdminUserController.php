<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Form\UserType;
use App\Manager\UserManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class AdminUserController extends AbstractController
{
    #[Route('admin/panel/user/add', name: 'app_admin_panel_user_add')]
    public function addUser(Request $request, UserManager $userManager): Response
    {
        $user = new User;
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $userManager->create($user);
            return $this->redirectToRoute('app_admin_panel_user');
        }

        return $this->render('admin_add_user/index.html.twig', [
            'addUserForm' => $form->createView(),
        ]);
    }

    #[Route('admin/panel/user/cancel', name: 'app_admin_panel_user_cancel')]
    public function cancel(): Response
    {
        return $this->redirectToRoute('app_admin_panel_user');
    }

    #[Route('admin/panel/user/edit/{id}', name: "app_admin_panel_user_edit")]
    public function editUser(Request $request, User $user, UserManager $userManager): Response
    {
        $form = $this->createForm(UserType::class, $user, ["is_editing" => true]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $userManager->update($user);

            return $this->redirectToRoute('app_admin_panel_user');
        }

        return $this->render('admin_edit_user/index.html.twig', [
            'editUserForm' => $form->createView(),
        ]);
    }
}
