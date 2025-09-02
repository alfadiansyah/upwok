import { IsArray, IsNotEmpty, IsString, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class GuestAnswerDto {
  @IsNotEmpty()
  @IsInt()
  questionId: number;

  @IsNotEmpty()
  @IsString()
  studentAnswer: string;
}

export class SubmitGuestTestDto {
  @IsNotEmpty()
  @IsString()
  testSessionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestAnswerDto)
  answers: GuestAnswerDto[];
}