import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Student } from './student.entity';

// Definisikan peran yang mungkin ada di aplikasi Anda
export enum UserRole {
    ADMIN = 'admin',
    PARENT = 'parent',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'phone_number', length: 32, unique: true })
    phoneNumber: string;

    @Column({ name: 'password_hash', length: 255 })
    passwordHash: string;

    @Column({ name: 'first_login_completed', default: false })
    firstLoginCompleted: boolean;
    
    // 👇 PROPERTI BARU
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.PARENT
    })
    role: UserRole;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'username_instagram', type: 'varchar', length: 64, nullable: true })
    usernameInstagram: string | null;

    @OneToMany(() => Student, (student) => student.user)
    students: Student[];
}