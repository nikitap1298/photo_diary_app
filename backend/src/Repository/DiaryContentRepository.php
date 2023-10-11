<?php

namespace App\Repository;

use App\Entity\DiaryContent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DiaryContent>
 *
 * @method DiaryContent|null find($id, $lockMode = null, $lockVersion = null)
 * @method DiaryContent|null findOneBy(array $criteria, array $orderBy = null)
 * @method DiaryContent[]    findAll()
 * @method DiaryContent[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DiaryContentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DiaryContent::class);
    }

    public function save(DiaryContent $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(DiaryContent $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
