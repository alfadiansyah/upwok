import { Controller, Get, UseGuards, Req, Param, ParseIntPipe } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { AuthGuard } from '@nestjs/passport'; // Contoh menggunakan JWT Guard
import { UserProfileDto } from 'src/dto/user-profile.dto';
import { StudentDetailDto } from 'src/dto/student-detail.dto';

@Controller('profile')
// Lindungi semua endpoint di controller ini, hanya user yang sudah login bisa akses
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    /**
     * Endpoint untuk memenuhi permintaan #1 dan #2
     * GET /profile
     * Menampilkan detail user (orang tua) dan daftar anak (student) yang terdaftar.
     */
    @Get()
    async getMyProfile(@Req() req): Promise<UserProfileDto> {
        // `req.user` akan berisi data user dari token JWT setelah login
        // Misalnya: { userId: 1, phoneNumber: '...' }
        const userId = req.user.userId;
        return this.profileService.getUserProfile(userId);
    }

    @Get('students/:studentId')
    async getStudentProfile(
        @Req() req,
        @Param('studentId', ParseIntPipe) studentId: number,
    ): Promise<StudentDetailDto> {
        const userId = req.user.userId;
        return this.profileService.getStudentProfile(userId, studentId);
    }
}