import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Group } from './group.entity';
import { Student } from './student.entity';
import { PlacementTestAnswer } from './placement-test-answer.entity';
import { PlacementTestResult } from './placement-test-result.entity';

export enum PlacementTestStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
}

@Entity('placement_tests')
export class PlacementTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'test_name', length: 128 })
  testName: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: PlacementTestStatus, default: PlacementTestStatus.PENDING })
  status: PlacementTestStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Group, (group) => group.placementTests, { onDelete: 'CASCADE' })
  group: Group;

  @ManyToOne(() => Student, (student) => student.placementTests, { onDelete: 'CASCADE' })
  student: Student;

  @OneToMany(() => PlacementTestAnswer, (ans) => ans.placementTest)
  answers: PlacementTestAnswer[];

  @OneToMany(() => PlacementTestResult, (res) => res.placementTest)
  results: PlacementTestResult[];
}
