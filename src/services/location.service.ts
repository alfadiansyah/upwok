import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherTeamMemberSchedule } from '../entities/teacher-team-member-schedule.entity';
import { Location } from 'src/entities';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(TeacherTeamMemberSchedule)
    private readonly ttmsRepo: Repository<TeacherTeamMemberSchedule>,
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
  ) { }

  async getAvailableSchedules(locationId: number) {
    const schedules = await this.ttmsRepo.find({
      where: { location: { id: locationId }, isFull: false },
      relations: ['teacherTeamMember', 'location'],
    });

    if (!schedules.length) {
      throw new NotFoundException(`No available schedules at location ${locationId}`);
    }

    // Mapping hasil agar lebih rapi
    return schedules.map(s => ({
      scheduleId: s.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      durationMinutes: s.durationMinutes,
      teacherMemberId: s.teacherTeamMember.id,
      teacherMemberName: s.teacherTeamMember.memberName,
      isCoordinator: s.teacherTeamMember.isCoordinator,
      locationId: s.location?.id,
      locationName: s.location?.name,
      isFull: s.isFull, // is_full ditambahkan di sini
    }));
  }
  // Ambil semua lokasi
  async getAllLocations() {
    const locations = await this.locationRepo.find();

    if (!locations.length) {
      throw new NotFoundException('No locations found');
    }

    // Mapping agar output lebih rapi (opsional)
    return locations.map(l => ({
      locationId: l.id,
      locationName: l.name,
    }));
  }
}