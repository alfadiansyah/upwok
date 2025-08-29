import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherTeamMemberSchedule } from '../entities/teacher-team-member-schedule.entity';

@Injectable()
export class TeacherScheduleService {
  constructor(
    @InjectRepository(TeacherTeamMemberSchedule)
    private ttmsRepo: Repository<TeacherTeamMemberSchedule>,
  ) {}

  async findByLocation(locationId: number) {
    const schedules = await this.ttmsRepo.find({
      where: { location: { id: locationId } },
      relations: ['teacherTeamMember', 'teacherTeamMember.teacher'],
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });

    // kelompokkan per guru
    const result: Record<number, any> = {};
    for (const sched of schedules) {
      const member = sched.teacherTeamMember;
      if (!result[member.id]) {
        result[member.id] = {
          memberId: member.id,
          memberName: member.memberName,
          alias: member.teacher.name, // misalnya "Papa Bear"
          schedules: [],
        };
      }
      result[member.id].schedules.push({
        day: sched.dayOfWeek,
        start: sched.startTime,
        end: sched.endTime,
        isFull: sched.isFull,
      });
    }

    return Object.values(result);
  }
}
