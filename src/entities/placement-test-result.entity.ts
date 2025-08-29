import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { PlacementTest } from './placement-test.entity';
import { Level } from './level.entity';
import { Teacher } from './teacher.entity';

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

  @ManyToOne(() => Student, (s) => s.results, { onDelete: 'CASCADE' })
  student: Student;

  @ManyToOne(() => PlacementTest, (pt) => pt.results, { onDelete: 'CASCADE' })
  placementTest: PlacementTest;

  @ManyToOne(() => Level, { onDelete: 'SET NULL', nullable: true })
  determinedLevel: Level | null;

  @ManyToOne(() => Teacher, { onDelete: 'SET NULL', nullable: true })
  reviewer: Teacher | null;
}
