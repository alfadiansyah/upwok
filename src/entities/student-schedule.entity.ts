import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { TeacherTeamMemberSchedule } from './teacher-team-member-schedule.entity';

@Entity('student_schedules')
export class StudentSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => Student, (student) => student.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => TeacherTeamMemberSchedule, (ttms) => ttms.studentSchedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_team_member_schedule_id' })
  teacherSchedule: TeacherTeamMemberSchedule;

}
