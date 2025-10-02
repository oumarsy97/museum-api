// update-favori.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateFavoriDto } from './create-favori.dto';

export class UpdateFavoriDto extends PartialType(CreateFavoriDto) {}