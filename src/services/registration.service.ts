import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

// DTO and Entities
import { RegistrationDto } from '../dto/registration.dto';
import { User, Student, Program, Group, Level, Grade, Location, TeacherTeamMemberSchedule, StudentSchedule } from '../entities';

// Import the PlacementTestService
import { PlacementTestService } from './placement-test.service';

@Injectable()
export class RegistrationService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
        @InjectRepository(Program) private readonly programRepo: Repository<Program>,
        @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
        @InjectRepository(Level) private readonly levelRepo: Repository<Level>,
        @InjectRepository(Grade) private readonly gradeRepo: Repository<Grade>,
        @InjectRepository(Location) private readonly locationRepo: Repository<Location>,
        @InjectRepository(StudentSchedule) private readonly studentScheduleRepo: Repository<StudentSchedule>,
        @InjectRepository(TeacherTeamMemberSchedule) private readonly ttmsRepo: Repository<TeacherTeamMemberSchedule>,
        private readonly placementTestService: PlacementTestService,
    ) { }

    private async hashDefaultPassword(): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash('default-temporary-password', salt);
    }

    async registerStudent(dto: RegistrationDto) {
        // Cek atau buat user baru (logika ini sama untuk kedua alur)
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

        // Buat data siswa baru
        const student = this.studentRepo.create({ name: dto.studentName, user });
        await this.studentRepo.save(student);

        // =====================================================================
        // ALUR 1: Jika siswa mendaftar karena sudah tahu level (ada 'schedules')
        // =====================================================================
        if (dto.schedules && dto.schedules.length > 0) {
            // Validasi data yang diperlukan untuk alur ini
            console.log('--- MEMULAI PROSES PENJADWALAN ---');
            console.log('Jadwal yang diterima dari DTO:', dto.schedules); // LOG 1

            if (!dto.programId || !dto.groupId || !dto.levelId || !dto.gradeId || !dto.locationId) {
                throw new BadRequestException('Program, Group, Level, Grade, and Location are required for direct schedule registration.');
            }

            // Validasi berantai dari Program hingga Grade
            const grade = await this.gradeRepo.findOne({
                where: {
                    id: dto.gradeId,
                    level: { id: dto.levelId, group: { id: dto.groupId, program: { id: dto.programId } } }
                }
            });
            if (!grade) {
                throw new NotFoundException(`Combination of Program/Group/Level/Grade is invalid.`);
            }

            // Validasi jadwal guru
            const scheduleIds = dto.schedules.map(s => s.teacherScheduleId);
            console.log('ID Jadwal yang akan dicari:', scheduleIds); // LOG 2
            const teacherSchedules = await this.ttmsRepo.find({
                where: { id: In(scheduleIds), location: { id: dto.locationId } }
            });

            if (teacherSchedules.length !== scheduleIds.length) {
                console.error('VALIDASI GAGAL: Jumlah jadwal yang ditemukan tidak cocok dengan yang diminta.');

                throw new BadRequestException('One or more teacher schedules were not found at the specified location.');
            }

            // Cek apakah ada jadwal yang sudah penuh
            teacherSchedules.forEach(ts => {
                if (ts.isFull) {
                    throw new BadRequestException(`Schedule ID ${ts.id} is already full.`);
                }
            });

            // Simpan jadwal siswa
            const studentSchedules = teacherSchedules.map(ts => {
                return this.studentScheduleRepo.create({
                    student,
                    teacherSchedule: ts,
                    isActive: true,
                });
            });
            console.log('Data yang akan disimpan ke student_schedules:', studentSchedules); // LOG 4

            await this.studentScheduleRepo.save(studentSchedules);
            console.log('--- PROSES PENJADWALAN SELESAI ---');

        }
        // =====================================================================
        // ALUR 2: Jika siswa mendaftar setelah placement test
        // =====================================================================
        else if (dto.testSessionId) {
            await this.placementTestService.saveGuestResultToDatabase(dto.testSessionId, student.id);
        }
        // =====================================================================
        // Jika tidak ada data yang cocok
        // =====================================================================
        else {
            throw new BadRequestException('Registration data is incomplete. Please provide either schedule information or a test session ID.');
        }

        return { message: 'Registration successful! Please activate your account.', studentId: student.id };
    }
}