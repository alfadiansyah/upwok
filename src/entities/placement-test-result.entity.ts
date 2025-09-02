import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Student } from './student.entity';
import { PlacementTest } from './placement-test.entity';
import { Level } from './level.entity';
import { Teacher } from './teacher.entity';
import { PlacementTestAnswer } from './placement-test-answer.entity';

export enum PlacementTestResultStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
}

@Entity('placement_test_results')
export class PlacementTestResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  score: number;

  @Column({ name: 'submitted_at', type: 'timestamp' })
  submittedAt: Date;

  @Column({ type: 'enum', enum: PlacementTestResultStatus, default: PlacementTestResultStatus.PENDING })
  status: PlacementTestResultStatus;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' }) // Map to the 'student_id' column
  student: Student;

  @ManyToOne(() => PlacementTest, (pt) => pt.results, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'placement_test_id' }) // Map to the 'placement_test_id' column
  placementTest: PlacementTest;

  @ManyToOne(() => Level, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'determined_level_id' }) // Map to the 'determined_level_id' column
  determinedLevel: Level | null;

  @ManyToOne(() => Teacher, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reviewer_id' }) // Map to the 'reviewer_id' column
  reviewer: Teacher | null;

  @OneToMany(() => PlacementTestAnswer, (answer) => answer.placementTestResult)
  answers: PlacementTestAnswer[];
}