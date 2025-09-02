import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Test } from './test.entity';
import { PlacementTestAnswer } from './placement-test-answer.entity';

export enum QuestionType {
  FILL_IN_THE_BLANK = 'fill_in_the_blank',
  MULTIPLE_CHOICE = 'multiple_choice',
  SENTENCE_CORRECTION = 'sentence_correction',
  FREE_TEXT = 'free_text',
}

@Entity('test_questions')
export class TestQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  // 👇 Map the 'questionText' property to the 'question_text' column
  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  @Column({ type: 'jsonb', nullable: true })
  options: string[] | null;

  // 👇 Map the 'correctAnswer' property to the 'correct_answer' column
  @Column({ name: 'correct_answer', length: 255 })
  correctAnswer: string;
  // 👇 TAMBAHKAN PROPERTI INI
  @Column({ type: 'text', nullable: true })
  instruction: string | null;
  // 👇 Map the 'questionType' property to the 'question_type' column
  @Column({
    name: 'question_type',
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.MULTIPLE_CHOICE,
  })
  questionType: QuestionType;

  @ManyToOne(() => Test, (test) => test.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @OneToMany(() => PlacementTestAnswer, (answer) => answer.question)
  answers: PlacementTestAnswer[];
}