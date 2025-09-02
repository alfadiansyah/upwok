import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationService } from '../services/registration.service';
import { RegistrationController } from '../controllers/registration.controller';

// Import all entities used by the service
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { Program } from '../entities/program.entity'; // <-- Import Program
import { Group } from '../entities/group.entity';

import { PlacementTestModule } from './placement-test.module';
import { Grade, Level, Location, StudentSchedule, TeacherTeamMemberSchedule } from 'src/entities';

@Module({
  imports: [
        PlacementTestModule,
        TypeOrmModule.forFeature([
            User,
            Student,
            Program,
            Group,
            Level,
            Grade,
            Location,
            StudentSchedule,
            TeacherTeamMemberSchedule
        ])
    ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService]
})
export class RegistrationModule { }