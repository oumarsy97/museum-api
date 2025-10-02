import { PartialType } from '@nestjs/swagger';
import { CreateOeuvreDto } from './create-oeuvre.dto';

export class UpdateOeuvreDto extends PartialType(CreateOeuvreDto) {}
