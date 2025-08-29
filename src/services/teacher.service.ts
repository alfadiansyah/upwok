import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,
  ) {}

  async findByLocation(locationId: number) {
    const teachers = await this.teacherRepo.find({
      relations: [
        'teamMembers',
        'teamMembers.schedules',
        'teamMembers.schedules.location',
      ],
    });

    // filter hanya schedule sesuai locationId
    return teachers.map(t => ({
      alias: t.name,
      members: t.teamMembers.map(m => ({
        name: m.memberName,
        schedules: m.schedules
          .filter(s => s.location && s.location.id === locationId)
          .map(s => ({
            day: s.dayOfWeek,
            start: s.startTime,
            end: s.endTime,
          })),
      })).filter(m => m.schedules.length > 0), // hanya member yg ada jadwal di lokasi itu
    })).filter(t => t.members.length > 0); // hanya alias yg punya jadwal di lokasi itu
  }
}
