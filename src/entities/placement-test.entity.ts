import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { PlacementTestResult } from './placement-test-result.entity';
import { Test } from './test.entity';

export enum PlacementTestStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('placement_tests')
export class PlacementTest {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'enum', enum: PlacementTestStatus, default: PlacementTestStatus.IN_PROGRESS })
  status: PlacementTestStatus;

  // Relasi ke siswa yang mengerjakan
  @ManyToOne(() => Student, (student) => student.placementTests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  // Relasi ke tes yang dikerjakan
  @ManyToOne(() => Test, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'test_id' })
  test: Test;

  // Relasi ke hasil tes
  @OneToMany(() => PlacementTestResult, (result) => result.placementTest)
  results: PlacementTestResult[];
}