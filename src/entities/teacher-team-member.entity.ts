import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Teacher } from './teacher.entity';
import { TeacherTeamMemberSchedule } from './teacher-team-member-schedule.entity';

@Entity('teacher_team_members')
export class TeacherTeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'member_name', length: 128 })
  memberName: string;

  @Column({ name: 'is_coordinator', default: false })
  isCoordinator: boolean;

  @ManyToOne(() => Teacher, (teacher) => teacher.teamMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' }) // <--- sesuai kolom di DB
  teacher: Teacher;


  @OneToMany(() => TeacherTeamMemberSchedule, (sched) => sched.teacherTeamMember)
  schedules: TeacherTeamMemberSchedule[];
}
