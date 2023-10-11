<?php

namespace App\Repository;

use App\Entity\Diary;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Diary>
 *
 * @method Diary|null find($id, $lockMode = null, $lockVersion = null)
 * @method Diary|null findOneBy(array $criteria, array $orderBy = null)
 * @method Diary[]    findAll()
 * @method Diary[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DiaryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Diary::class);
    }

    public function save(Diary $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Diary $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findByUserId(int $userId): array
    {
        $queryBuilder = $this->createQueryBuilder('diary');

        return $queryBuilder
                    ->innerJoin('diary.users', 'user')
                    ->andWhere('user.id = :userId')
                    ->setParameter('userId', $userId)
                    ->getQuery()
                    ->getResult();
    }

    public function findFCMTokensByDiary(Diary $diary): array
    {
        $queryBuilder = $this->createQueryBuilder('diary');

        $result = $queryBuilder
                    ->select('user.fcmToken')
                    ->innerJoin('diary.users', 'user')
                    ->andWhere('diary = :diary')
                    ->andWhere('user.fcmToken IS NOT NULL')
                    ->andWhere('user.fcmToken <> :hyphen')
                    ->setParameter('diary', $diary)
                    ->setParameter('hyphen', '-')
                    ->getQuery()
                    ->getResult(\Doctrine\ORM\Query::HYDRATE_SCALAR);

        return array_column($result, 'fcmToken');
    }
}
