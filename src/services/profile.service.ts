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

    /**
     * Helper function untuk mengubah data entitas Student menjadi DTO yang bersih.
     */
    private mapStudentToDto(student: Student): StudentDetailDto {
        let programName: string | undefined = 'Not determined';
        let groupName: string | undefined = 'Not determined';
        let levelName: string | undefined = 'Not determined';
        let gradeNumber: number | undefined = undefined;

        // Sumber 1: Prioritaskan data dari jadwal jika ada (untuk pendaftar langsung)
        const gradeFromSchedule = student.schedules?.[0]?.teacherSchedule?.teacherTeamMember?.teacher?.gradeTeachers?.[0]?.grade;
        if (gradeFromSchedule) {
            programName = gradeFromSchedule.level?.group?.program?.name;
            groupName = gradeFromSchedule.level?.group?.name;
            levelName = gradeFromSchedule.level?.name;
            gradeNumber = gradeFromSchedule.gradeNumber;
        } 
        // Sumber 2: Jika tidak ada jadwal, ambil dari placement test yang dikerjakan
        else {
            const testTaken = student.placementTests?.[0]?.test;
            if (testTaken) {
                programName = testTaken.group?.program?.name;
                groupName = testTaken.group?.name;
            }
            // Level tetap diambil dari hasil review admin (jika sudah ada)
            levelName = student.results?.[0]?.determinedLevel?.name || 'Not determined';
        }

        return {
            id: student.id,
            name: student.name,
            programName,
            groupName,
            levelName,
            gradeNumber,
            schedules: student.schedules.map(schedule => ({
                dayOfWeek: schedule.teacherSchedule?.dayOfWeek || 'N/A',
                startTime: schedule.teacherSchedule?.startTime || 'N/A',
                endTime: schedule.teacherSchedule?.endTime || 'N/A',
                locationName: schedule.teacherSchedule?.location?.name || 'N/A',
                teacherName: schedule.teacherSchedule?.teacherTeamMember?.memberName || 'Not Assigned',
            })),
            testResults: student.results.map(result => ({
                testName: result.placementTest?.test?.name || 'Placement Test',
                score: result.score,
                status: result.status,
                determinedLevel: result.determinedLevel?.name,
            })),
        };
    }

    /**
     * Helper function untuk mendefinisikan semua relasi yang perlu di-load.
     */
    private getFullStudentRelations(): string[] {
        return [
            // Relasi untuk alur pendaftaran via jadwal
            'schedules',
            'schedules.teacherSchedule.location',
            'schedules.teacherSchedule.teacherTeamMember',
            'schedules.teacherSchedule.teacherTeamMember.teacher.gradeTeachers.grade.level.group.program',
            
            // Relasi untuk alur pendaftaran via placement test
            'placementTests',
            'placementTests.test.group.program', // <-- Jalur penting
            'results',
            'results.placementTest.test',
            'results.determinedLevel',
        ];
    }

    async getUserProfile(userId: number): Promise<UserProfileDto> {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['students', ...this.getFullStudentRelations().map(rel => `students.${rel}`)],
        });

        if (!user) { throw new NotFoundException(`User with ID ${userId} not found.`); }
        
        const studentDetails = user.students.map(student => this.mapStudentToDto(student));

        return {
            id: user.id,
            phoneNumber: user.phoneNumber,
            instagram: user.usernameInstagram,
            students: studentDetails,
        };
    }

    async getStudentProfile(userId: number, studentId: number): Promise<StudentDetailDto> {
        const student = await this.studentRepo.findOne({
            where: { id: studentId, user: { id: userId } },
            relations: this.getFullStudentRelations(),
        });

        if (!student) { throw new NotFoundException(`Student with ID ${studentId} not found.`); }
        
        return this.mapStudentToDto(student);
    }
}