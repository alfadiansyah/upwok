import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { GradeTeacher } from './grade-teacher.entity';
import { Location } from './location.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'day_of_week', length: 16 })
  dayOfWeek: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'duration_minutes', type: 'int' })
  durationMinutes: number;

  @Column({ name: 'is_optional', default: false })
  isOptional: boolean;

  @ManyToOne(() => GradeTeacher, (gt) => gt.schedules, { onDelete: 'CASCADE' })
  gradeTeacher: GradeTeacher;

  @ManyToOne(() => Location, (loc) => loc.schedules, { nullable: true })
  location: Location | null;
}
