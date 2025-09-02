import { IsNotEmpty, IsInt } from 'class-validator';

export class StartGuestTestDto {
  @IsNotEmpty()
  @IsInt()
  testId: number; // Ganti dari groupId
}