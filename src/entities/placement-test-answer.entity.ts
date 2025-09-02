import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PlacementTestResult } from './placement-test-result.entity';
import { TestQuestion } from './test-question.entity';

@Entity('placement_test_answers')
export class PlacementTestAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'answer_text', type: 'text' })
  answerText: string;

  // 👇 CHANGE THIS: Link to PlacementTestResult, not PlacementTest
  @ManyToOne(() => PlacementTestResult, (result) => result.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'placement_test_result_id' })
  placementTestResult: PlacementTestResult;

  @ManyToOne(() => TestQuestion, (q) => q.answers, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'question_id' })
  question: TestQuestion | null;
}