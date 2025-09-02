import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserProfileDto } from 'src/dto/user-profile.dto';
import { StudentDetailDto } from 'src/dto/student-detail.dto';
import { Student } from 'src/entities';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Student)
        private readonly studentRepo: Repository<Student>,
    ) { }

    async getUserProfile(userId: number): Promise<UserProfileDto> {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: [
                'students',
                'students.schedules',
                'students.schedules.teacherSchedule',
                'students.schedules.teacherSchedule.location',
                'students.schedules.teacherSchedule.teacherTeamMember', // Cukup sampai di sini
                // 'students.schedules.teacherSchedule.teacherTeamMember.teacher', // <-- Hapus atau komentari baris ini
                'students.results',
                'students.results.placementTest',
                'students.results.placementTest.test',
                'students.results.determinedLevel',
            ],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        const studentDetails: StudentDetailDto[] = user.students.map(student => ({
            id: student.id,
            name: student.name,
            schedules: student.schedules.map(schedule => ({
                dayOfWeek: schedule.teacherSchedule?.dayOfWeek || 'N/A',
                startTime: schedule.teacherSchedule?.startTime || 'N/A',
                endTime: schedule.teacherSchedule?.endTime || 'N/A',
                locationName: schedule.teacherSchedule?.location?.name || 'N/A',
                // 👇 UBAH KEMBALI KE SINI: Ambil nama langsung dari 'memberName'
                teacherName: schedule.teacherSchedule?.teacherTeamMember?.memberName || 'Not Assigned',
            })),
            testResults: student.results.map(result => ({
                testName: result.placementTest?.test?.name || 'Placement Test',
                score: result.score,
                status: result.status,
                determinedLevel: result.determinedLevel?.name,
            })),
        }));

        return {
            id: user.id,
            phoneNumber: user.phoneNumber,
            instagram: user.usernameInstagram,
            students: studentDetails,
        };
    } async getStudentProfile(userId: number, studentId: number): Promise<StudentDetailDto> {
        const student = await this.studentRepo.findOne({
            // Kueri ini memastikan siswa dengan ID 'studentId'
            // ADALAH MILIK user dengan ID 'userId'
            where: { id: studentId, user: { id: userId } },
            relations: [
                'schedules',
                'schedules.teacherSchedule',
                'schedules.teacherSchedule.location',
                'schedules.teacherSchedule.teacherTeamMember',
                'schedules.teacherSchedule.teacherTeamMember.teacher',
                'results',
                'results.placementTest',
                'results.placementTest.test',
                'results.determinedLevel',
            ],
        });

        if (!student) {
            throw new NotFoundException(`Student with ID ${studentId} not found or does not belong to this user.`);
        }

        // Memetakan data ke DTO, sama seperti sebelumnya
        return {
            id: student.id,
            name: student.name,
            schedules: student.schedules.map(schedule => ({
                dayOfWeek: schedule.teacherSchedule?.dayOfWeek || 'N/A',
                startTime: schedule.teacherSchedule?.startTime || 'N/A',
                endTime: schedule.teacherSchedule?.endTime || 'N/A',
                locationName: schedule.teacherSchedule?.location?.name || 'N/A',
                teacherName: schedule.teacherSchedule?.teacherTeamMember?.teacher?.name || 'Not Assigned',
            })),
            testResults: student.results.map(result => ({
                testName: result.placementTest?.test?.name || 'Placement Test',
                score: result.score,
                status: result.status,
                determinedLevel: result.determinedLevel?.name,
            })),
        };
    }
}