<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230717141928 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE diary (id INT AUTO_INCREMENT NOT NULL, owner VARCHAR(255) NOT NULL, image_file_name LONGTEXT DEFAULT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, closed_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE diary_content (id INT AUTO_INCREMENT NOT NULL, diary_id INT DEFAULT NULL, user_id INT NOT NULL, text LONGTEXT DEFAULT NULL, image_file_name LONGTEXT DEFAULT NULL, created_at DATETIME DEFAULT NULL, latitude NUMERIC(5, 2) DEFAULT NULL, longitude NUMERIC(5, 2) DEFAULT NULL, INDEX IDX_A48CC7BDE020E47A (diary_id), INDEX IDX_A48CC7BDA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, roles JSON DEFAULT NULL, user_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, verified TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_diary (user_id INT NOT NULL, diary_id INT NOT NULL, INDEX IDX_73B916BAA76ED395 (user_id), INDEX IDX_73B916BAE020E47A (diary_id), PRIMARY KEY(user_id, diary_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE diary_content ADD CONSTRAINT FK_A48CC7BDE020E47A FOREIGN KEY (diary_id) REFERENCES diary (id)');
        $this->addSql('ALTER TABLE diary_content ADD CONSTRAINT FK_A48CC7BDA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_diary ADD CONSTRAINT FK_73B916BAA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_diary ADD CONSTRAINT FK_73B916BAE020E47A FOREIGN KEY (diary_id) REFERENCES diary (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE diary_content DROP FOREIGN KEY FK_A48CC7BDE020E47A');
        $this->addSql('ALTER TABLE diary_content DROP FOREIGN KEY FK_A48CC7BDA76ED395');
        $this->addSql('ALTER TABLE user_diary DROP FOREIGN KEY FK_73B916BAA76ED395');
        $this->addSql('ALTER TABLE user_diary DROP FOREIGN KEY FK_73B916BAE020E47A');
        $this->addSql('DROP TABLE diary');
        $this->addSql('DROP TABLE diary_content');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_diary');
    }
}
