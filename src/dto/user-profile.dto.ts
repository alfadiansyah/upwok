import { StudentDetailDto } from './student-detail.dto';

// DTO untuk profil user (orang tua) beserta daftar anaknya
export class UserProfileDto {
    id: number;
    phoneNumber: string;
    instagram: string | null;
    students: StudentDetailDto[];
}