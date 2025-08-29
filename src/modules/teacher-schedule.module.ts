import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherTeamMemberSchedule } from '../entities/teacher-team-member-schedule.entity';
import { TeacherScheduleService } from '../services/teacher-schedule.service ';
import { TeacherScheduleController } from '../controllers/teacher-schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherTeamMemberSchedule])],
  controllers: [TeacherScheduleController],
  providers: [TeacherScheduleService],
})
export class TeacherScheduleModule {}
