import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TeacherTeamMember } from './teacher-team-member.entity';
import { GradeTeacher } from './grade-teacher.entity';

@Entity('teachers')
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 128 })
    name: string;

    @Column({ type: 'varchar', length: 128, nullable: true })
    coordinator: string | null;


    @OneToMany(() => TeacherTeamMember, (member) => member.teacher)
    teamMembers: TeacherTeamMember[];

    @OneToMany(() => GradeTeacher, (gt) => gt.teacher)
    gradeTeachers: GradeTeacher[];
}
