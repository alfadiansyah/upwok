import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Level } from './level.entity';
import { GradeTeacher } from './grade-teacher.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'grade_number', type: 'int' })
  gradeNumber: number;

  @Column({ type: 'text', nullable: true })
  prerequisites: string | null;

  @ManyToOne(() => Level, (level) => level.grades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'level_id' })   // 👈 FK sesuai DB
  level: Level;

  @OneToMany(() => GradeTeacher, (gt) => gt.grade)
  gradeTeachers: GradeTeacher[];
}
