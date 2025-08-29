import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Group } from './group.entity';
import { Grade } from './grade.entity';

@Entity('levels')
export class Level {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  name: string;

  @Column({ type: 'text', nullable: true })
  prerequisites: string | null;

  @ManyToOne(() => Group, (group) => group.levels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })   // 👈 mapping ke kolom asli
  group: Group;

  @OneToMany(() => Grade, (grade) => grade.level)
  grades: Grade[];
}
