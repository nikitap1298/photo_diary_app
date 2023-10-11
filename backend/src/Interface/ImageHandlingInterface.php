<?php

namespace App\Interface;

interface ImageHandlingInterface
{
    public function getDiaryId(): int;
    public function getFilename(): ?string;
}
