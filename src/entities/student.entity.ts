import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';
import { StudentSchedule } from './student-schedule.entity';
import { PlacementTest } from './placement-test.entity';
import { PlacementTestResult } from './placement-test-result.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  name: string;



  @ManyToOne(() => User, (user) => user.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // <-- pakai nama kolom sesuai DB
  user: User;




  @OneToMany(() => StudentSchedule, (sched) => sched.student)
  schedules: StudentSchedule[];

  @OneToMany(() => PlacementTest, (pt) => pt.student)
  placementTests: PlacementTest[];

  @OneToMany(() => PlacementTestResult, (res) => res.student)
  results: PlacementTestResult[];
}
