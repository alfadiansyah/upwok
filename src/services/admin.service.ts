import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/entities';
import { Repository } from 'typeorm';
import { AdminStudentListDto } from 'src/dto/admin-student-list.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepo: Repository<Student>,
    ) {}

    async findAllStudents(page: number = 1, limit: number = 10): Promise<AdminStudentListDto> {
        const skip = (page - 1) * limit;

        const [students, totalItems] = await this.studentRepo.findAndCount({
            skip: skip,
            take: limit,
            // Memuat semua relasi yang mungkin dibutuhkan dari semua alur pendaftaran
            relations: [
                'user',
                // Relasi untuk alur pendaftaran via jadwal
                'schedules',
                'schedules.teacherSchedule',
                'schedules.teacherSchedule.teacherTeamMember',
                'schedules.teacherSchedule.teacherTeamMember.teacher.gradeTeachers.grade.level.group.program',
                
                // Relasi untuk alur pendaftaran via placement test
                'placementTests',
                'placementTests.test',
                'placementTests.test.group',
                'placementTests.test.group.program', // <-- Jalur penting
                'results',
                'results.determinedLevel',
                'results.determinedLevel.group',
                'results.determinedLevel.group.program',
            ],
            order: {
                id: 'DESC'
            }
        });

        const data = students.map(student => {
            let program = 'N/A';
            let group = 'N/A';

            // LOGIKA BARU: Cek dari tiga sumber dengan urutan prioritas
            // Sumber 1: Dari jadwal (untuk siswa yang daftar langsung)
            const gradeInfo = student.schedules?.[0]?.teacherSchedule?.teacherTeamMember?.teacher?.gradeTeachers?.[0]?.grade;
            if (gradeInfo) {
                program = gradeInfo.level?.group?.program?.name || 'N/A';
                group = gradeInfo.level?.group?.name || 'N/A';
            }
            // Sumber 2: Dari tes yang dikerjakan (untuk siswa via placement test)
            else {
                const testTaken = student.placementTests?.[0]?.test;
                if (testTaken) {
                    program = testTaken.group?.program?.name || 'N/A';
                    group = testTaken.group?.name || 'N/A';
                }
                // Sumber 3: Dari hasil tes yang sudah direview (sebagai cadangan)
                else {
                    const levelInfo = student.results?.[0]?.determinedLevel;
                    if (levelInfo) {
                        program = levelInfo.group?.program?.name || 'N/A';
                        group = levelInfo.group?.name || 'N/A';
                    }
                }
            }

            const schedule = student.schedules
                .map(s => `${s.teacherSchedule.dayOfWeek} ${s.teacherSchedule.startTime}`)
                .join(', ');
                
            const teacherName = student.schedules?.[0]?.teacherSchedule?.teacherTeamMember?.memberName || 'N/A';

            return {
                studentId: student.id,
                studentName: student.name,
                parentPhoneNumber: student.user.phoneNumber,
                program: program, // <-- Sekarang akan terisi dengan benar
                group: group,     // <-- Sekarang akan terisi dengan benar
                teacherName: teacherName,
                schedule: schedule || 'No schedule',
            };
        });

        return {
            data,
            meta: {
                totalItems,
                itemCount: data.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }
}

