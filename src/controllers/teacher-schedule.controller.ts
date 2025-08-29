import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TeacherScheduleService } from '../services/teacher-schedule.service ';

@Controller('locations/:locationId/teachers')
export class TeacherScheduleController {
  constructor(private readonly teacherScheduleService: TeacherScheduleService) {}

  @Get()
  async getTeachers(@Param('locationId', ParseIntPipe) locationId: number) {
    return this.teacherScheduleService.findByLocation(locationId);
  }
}
