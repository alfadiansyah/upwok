import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from '../services/location.service';
import { LocationController } from '../controllers/location.controller';
import { TeacherTeamMemberSchedule } from '../entities/teacher-team-member-schedule.entity';
import { Location } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherTeamMemberSchedule,Location])],
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
