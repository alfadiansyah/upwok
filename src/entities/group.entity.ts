import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Program } from './program.entity';
import { Level } from './level.entity';
import { PlacementTest } from './placement-test.entity';
import { TestQuestion } from './test-question.entity';
import { Student } from './student.entity';
import { Test } from './test.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  name: string;

  @Column({ type: 'text', nullable: true })
  materi: string | null;

  @Column({ type: 'text', nullable: true })
  capaian: string | null;

  @ManyToOne(() => Program, (program) => program.groups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_id' })   // 👈 mapping ke kolom asli di DB
  program: Program;

  @OneToMany(() => Level, (level) => level.group)
  levels: Level[];

  // @OneToMany(() => PlacementTest, (pt) => pt.group)
  // placementTests: PlacementTest[];

   // 👇 Ganti baris ini
//   @OneToMany(() => TestQuestion, (question) => question.group)
//   testQuestions: TestQuestion[]; // Nama properti juga diganti agar lebih jelas

  @OneToMany(() => Test, (test) => test.group)
  tests: Test[];

}
