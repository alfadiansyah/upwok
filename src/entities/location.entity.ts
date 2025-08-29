import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TeacherTeamMemberSchedule } from './teacher-team-member-schedule.entity';
import { Schedule } from './schedule.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => TeacherTeamMemberSchedule, (ttms) => ttms.location)
  teacherSchedules: TeacherTeamMemberSchedule[];

  @OneToMany(() => Schedule, (schedule) => schedule.location)
  schedules: Schedule[];
}
