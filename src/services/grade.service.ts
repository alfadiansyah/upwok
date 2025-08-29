import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from '../entities/grade.entity';
import { Level } from '../entities/level.entity';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepo: Repository<Grade>,
    @InjectRepository(Level)
    private readonly levelRepo: Repository<Level>,
  ) {}

  async findByLevel(programId: number, groupId: number, levelId: number): Promise<Grade[]> {
    const level = await this.levelRepo.findOne({
      where: { id: levelId, group: { id: groupId, program: { id: programId } } },
      relations: ['group', 'group.program', 'grades'],
    });

    if (!level) {
      throw new NotFoundException(`Level ${levelId} not found in Group ${groupId} of Program ${programId}`);
    }

    return level.grades;
  }

  async findOneInLevel(programId: number, groupId: number, levelId: number, gradeId: number): Promise<Grade> {
    const grade = await this.gradeRepo.findOne({
      where: { id: gradeId, level: { id: levelId, group: { id: groupId, program: { id: programId } } } },
      relations: ['level', 'level.group', 'level.group.program'],
    });

    if (!grade) {
      throw new NotFoundException(
        `Grade ${gradeId} not found in Level ${levelId} of Group ${groupId} in Program ${programId}`,
      );
    }

    return grade;
  }
}
