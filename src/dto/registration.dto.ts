import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateNested } from 'class-validator';

// DTO kecil untuk validasi data jadwal
class ScheduleDto {
    @IsNotEmpty()
    @IsInt()
    teacherScheduleId: number;
}

export class RegistrationDto {
    // --- Informasi Wajib untuk Semua Pendaftar ---
    @IsNotEmpty()
    @IsString()
    studentName: string;

    @IsNotEmpty()
    @IsPhoneNumber('ID')
    phoneNumber: string;

    @IsOptional()
    @IsString()
    instagram?: string;

    // --- Opsi 1: Untuk Pendaftar yang Tahu Level ---
    @IsOptional()
    @IsInt()
    programId?: number;

    @IsOptional()
    @IsInt()
    groupId?: number;

    @IsOptional()
    @IsInt()
    levelId?: number;

    @IsOptional()
    @IsInt()
    gradeId?: number;

    @IsOptional()
    @IsInt()
    locationId?: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1) // Minimal harus memilih 1 jadwal
    @Type(() => ScheduleDto)
    schedules?: ScheduleDto[];

    // --- Opsi 2: Untuk Pendaftar via Placement Test ---
    @IsOptional()
    @IsString()
    testSessionId?: string;
}