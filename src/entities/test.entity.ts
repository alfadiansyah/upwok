import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Group } from './group.entity';
import { TestQuestion } from './test-question.entity';

@Entity('tests')
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => Group, (group) => group.tests, { onDelete: 'CASCADE' })
  // 👇 ADD THIS DECORATOR to map the 'group' property to the 'group_id' column
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToMany(() => TestQuestion, (q) => q.test)
  questions: TestQuestion[];
}