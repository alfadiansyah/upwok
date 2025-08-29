import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Test } from './test.entity';
import { PlacementTestAnswer } from './placement-test-answer.entity';

@Entity('test_questions')
export class TestQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  @Column({ name: 'type', length: 32, default: 'multiple_choice' })
  type: string;

  @ManyToOne(() => Test, (test) => test.questions, { onDelete: 'CASCADE' })
  test: Test;

  @OneToMany(() => PlacementTestAnswer, (ans) => ans.question)
  answers: PlacementTestAnswer[];
}
