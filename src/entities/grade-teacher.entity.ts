import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, OneToMany, JoinColumn } from 'typeorm';
import { Grade } from './grade.entity';
import { Teacher } from './teacher.entity';
import { Schedule } from './schedule.entity';

@Entity('grade_teachers')
@Unique(['grade', 'teacher'])
export class GradeTeacher {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Grade, (grade) => grade.gradeTeachers, { onDelete: 'CASCADE' })
  // 👇 ADD THIS to map the 'grade' property to the 'grade_id' column
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @ManyToOne(() => Teacher, (teacher) => teacher.gradeTeachers, { onDelete: 'CASCADE' })
  // 👇 ADD THIS to map the 'teacher' property to the 'teacher_id' column
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @OneToMany(() => Schedule, (schedule) => schedule.gradeTeacher)
  schedules: Schedule[];
}
