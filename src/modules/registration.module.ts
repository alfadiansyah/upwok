import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationService } from '../services/registration.service';
import { RegistrationController } from '../controllers/registration.controller';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { StudentSchedule } from '../entities/student-schedule.entity';
import { TeacherTeamMemberSchedule } from '../entities/teacher-team-member-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, StudentSchedule, TeacherTeamMemberSchedule])],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
