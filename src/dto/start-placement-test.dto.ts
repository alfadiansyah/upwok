import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class StartPlacementTestDto {
  @IsOptional() // 👈 Jadikan opsional
  @IsNumber()
  studentId?: number; // 👈 Tambahkan '?'

  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}