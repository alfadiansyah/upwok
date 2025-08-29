import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { StudentSchedule } from '../entities/student-schedule.entity';
import { TeacherTeamMemberSchedule } from '../entities/teacher-team-member-schedule.entity';
import { RegistrationDto } from '../dto/registration.dto';

@Injectable()
export class RegistrationService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
        @InjectRepository(StudentSchedule) private readonly studentScheduleRepo: Repository<StudentSchedule>,
        @InjectRepository(TeacherTeamMemberSchedule) private readonly ttmsRepo: Repository<TeacherTeamMemberSchedule>,
    ) { }

    private async hashDefaultPassword(): Promise<string> {
        // Ganti ini sesuai strategy hashing kamu
        return 'defaultpasswordhash';
    }

    async registerStudent(dto: RegistrationDto) {
        // 1. Cek atau buat user
        let user = await this.userRepo.findOne({ where: { phoneNumber: dto.phoneNumber } });
        if (!user) {
            user = this.userRepo.create({
                phoneNumber: dto.phoneNumber,
                usernameInstagram: dto.instagram || null,
                passwordHash: await this.hashDefaultPassword(),
                firstLoginCompleted: false,
            });
            await this.userRepo.save(user);
        }

        // 2. Buat student baru
        const student = this.studentRepo.create({
            name: dto.studentName,
            user,
        });
        await this.studentRepo.save(student);

        // 3. Simpan jadwal les dengan cek lokasi
        for (const sched of dto.schedules) {
            const teacherSchedule = await this.ttmsRepo.findOne({
                where: { id: sched.teacherScheduleId, location: { id: dto.locationId } },
                relations: ['location'],
            });

            if (!teacherSchedule) {
                throw new BadRequestException(`Schedule ID ${sched.teacherScheduleId} not found at location ${dto.locationId}`);
            }

            if (teacherSchedule.isFull) {
                throw new BadRequestException(`Schedule ID ${sched.teacherScheduleId} is full`);
            }

            const studentSchedule = this.studentScheduleRepo.create({
                student,
                teacherSchedule,
                isActive: true,
            });
            await this.studentScheduleRepo.save(studentSchedule);
        }

        return { message: 'Registration successful', studentId: student.id };
    }

}
