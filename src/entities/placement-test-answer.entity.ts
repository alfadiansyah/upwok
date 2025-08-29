import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PlacementTest } from './placement-test.entity';
import { TestQuestion } from './test-question.entity';

@Entity('placement_test_answers')
export class PlacementTestAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'answer_text', type: 'text', nullable: true })
  answerText: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PlacementTest, (pt) => pt.answers, { onDelete: 'CASCADE' })
  placementTest: PlacementTest;

  @ManyToOne(() => TestQuestion, (q) => q.answers, { onDelete: 'SET NULL', nullable: true })
  question: TestQuestion | null;
}
