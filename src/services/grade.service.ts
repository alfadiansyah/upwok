import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from '../entities/grade.entity';
import { Level } from '../entities/level.entity';
import { GradeResponseDto } from '../dto/grade-response.dto';

@Injectable()
export class GradeService {
    constructor(
        @InjectRepository(Grade)
        private readonly gradeRepo: Repository<Grade>,
        @InjectRepository(Level)
        private readonly levelRepo: Repository<Level>,
    ) {}

    async findByLevel(programId: number, groupId: number, levelId: number): Promise<GradeResponseDto[]> {
        const level = await this.levelRepo.findOne({
            where: { id: levelId, group: { id: groupId, program: { id: programId } } },
            relations: ['grades', 'grades.gradeTeachers', 'grades.gradeTeachers.teacher'],
        });

        if (!level) {
            throw new NotFoundException(`Level ${levelId} not found in Group ${groupId} of Program ${programId}`);
        }

        return level.grades.map(grade => ({
            id: grade.id,
            gradeNumber: grade.gradeNumber,
            prerequisites: grade.prerequisites,
            taughtBy: grade.gradeTeachers.map(gt => ({
                id: gt.teacher.id,
                name: gt.teacher.name,
            })),
        }));
    }

    // 👇 Tambahkan implementasi untuk method yang hilang
    async findOneInLevel(programId: number, groupId: number, levelId: number, gradeId: number): Promise<GradeResponseDto> {
        const grade = await this.gradeRepo.findOne({
            where: { 
                id: gradeId, 
                level: { id: levelId, group: { id: groupId, program: { id: programId } } } 
            },
            relations: ['gradeTeachers', 'gradeTeachers.teacher'],
        });

        if (!grade) {
            throw new NotFoundException(`Grade ${gradeId} not found in Level ${levelId}`);
        }

        return {
            id: grade.id,
            gradeNumber: grade.gradeNumber,
            prerequisites: grade.prerequisites,
            taughtBy: grade.gradeTeachers.map(gt => ({
                id: gt.teacher.id,
                name: gt.teacher.name,
            })),
        };
    }
}