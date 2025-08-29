import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, OneToMany } from 'typeorm';
import { Grade } from './grade.entity';
import { Teacher } from './teacher.entity';
import { Schedule } from './schedule.entity';

@Entity('grade_teachers')
@Unique(['grade', 'teacher'])
export class GradeTeacher {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Grade, (grade) => grade.gradeTeachers, { onDelete: 'CASCADE' })
  grade: Grade;

  @ManyToOne(() => Teacher, (teacher) => teacher.gradeTeachers, { onDelete: 'CASCADE' })
  teacher: Teacher;

  @OneToMany(() => Schedule, (schedule) => schedule.gradeTeacher)
  schedules: Schedule[];
}
