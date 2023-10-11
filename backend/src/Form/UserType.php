<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $isEditing = $options['is_editing'];
        $builder
            ->add('userName', TextType::class, [
                'required' => true,
                'label' => 'user.userName',
            ])
            ->add('email', EmailType::class, [
                'required' => true,
                'label' => 'user.email',
            ])

            ->add('verified', ChoiceType::class, [
                'label' => 'user.verified',
                'choices' => [
                    'user.verifiedFalse' => false,
                    'user.verifiedTrue' => true,
                ],
            ]);

        if (!$isEditing) {
            $builder->add('password', PasswordType::class, [
                // instead of being set onto the object directly,
                // this is read and encoded in the controller
                'required' => true,
                'label' => 'user.password',
                'mapped' => true,
                'attr' => ['autocomplete' => 'new-password'],
            ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'is_editing' => false
        ]);
    }
}
