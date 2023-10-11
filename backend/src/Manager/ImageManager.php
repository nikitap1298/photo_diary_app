<?php

namespace App\Manager;

use App\Interface\ImageHandlingInterface;
use League\Flysystem\Local\LocalFilesystemAdapter;
use League\Flysystem\Filesystem;
use Symfony\Component\Uid\Uuid;

class ImageManager
{

    private Filesystem $filesystem;

    public function __construct()
    {
        $adapter = new LocalFilesystemAdapter('/');
        $this->filesystem = new Filesystem($adapter);
    }

    private function findFolder(ImageHandlingInterface $imageHandlingInterface): string
    {
        return '/app/images/' . $imageHandlingInterface->getDiaryId();
    }

    private function findImagePath(ImageHandlingInterface $imageHandlingInterface): string
    {
        return $this->findFolder($imageHandlingInterface) . '/' . $imageHandlingInterface->getFilename();
    }

    public function create(string $base64ImageData, ImageHandlingInterface $imageHandlingInterface): void
    {
        $imageData = base64_decode($base64ImageData);
        $imagePath = $this->findImagePath($imageHandlingInterface);

        $this->filesystem->createDirectory(dirname($imagePath));
        $this->filesystem->write($imagePath, $imageData);
    }

    public function get(ImageHandlingInterface $imageHandlingInterface): string
    {
        $imagePath = $this->findImagePath($imageHandlingInterface);
        return base64_encode($this->filesystem->read($imagePath));
    }

    public function deleteAll(ImageHandlingInterface $imageHandlingInterface): void
    {
        $dirPath = $this->findFolder($imageHandlingInterface);

        $this->filesystem->deleteDirectory($dirPath);
    }

    public function delete(ImageHandlingInterface $imageHandlingInterface): void
    {
        if ($imageHandlingInterface->getFilename()) {
            $imagePath = $this->findImagePath($imageHandlingInterface);
            $this->filesystem->delete($imagePath);
        }
    }
}
