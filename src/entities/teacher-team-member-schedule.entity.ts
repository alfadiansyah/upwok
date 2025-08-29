import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TeacherTeamMember } from './teacher-team-member.entity';
import { Location } from './location.entity';
import { StudentSchedule } from './student-schedule.entity';

@Entity('teacher_team_member_schedules')
export class TeacherTeamMemberSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'day_of_week', length: 16 })
  dayOfWeek: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'duration_minutes', type: 'int' })
  durationMinutes: number;

  @Column({ name: 'is_full', default: false })
  isFull: boolean;
  @ManyToOne(() => TeacherTeamMember, (ttm) => ttm.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_team_member_id' }) // <--- sesuaikan dengan nama kolom di db
  teacherTeamMember: TeacherTeamMember;

  @ManyToOne(() => Location, (loc) => loc.teacherSchedules, { nullable: true })
  @JoinColumn({ name: 'location_id' }) // <--- sesuaikan dengan nama kolom di db
  location: Location | null;


  @OneToMany(() => StudentSchedule, (ss) => ss.teacherSchedule)
  studentSchedules: StudentSchedule[];
}
