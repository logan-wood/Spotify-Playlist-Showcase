import { PartialType } from '@nestjs/mapped-types';
import { CreatePresentationDto } from './create-presentation.dto';
import { IsArray, ValidateNested } from 'class-validator';

export class UpdatePresentationDto extends PartialType(CreatePresentationDto) {
    @IsArray()
    @ValidateNested()
    track_queue: {
        track_id: string,
        from: number;
        to: number;
        image_url: string;
    }[]
}
