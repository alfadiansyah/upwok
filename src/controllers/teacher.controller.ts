import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';

@Controller('locations/:locationId/teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  async getTeachersByLocation(
    @Param('locationId', ParseIntPipe) locationId: number,
  ) {
    return this.teacherService.findByLocation(locationId);
  }
}
