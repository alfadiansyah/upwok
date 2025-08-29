import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from '../entities/level.entity';
import { Group } from '../entities/group.entity';
import { Program } from '../entities/program.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepo: Repository<Level>,
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
  ) {}

  async findByProgramGroup(programId: number, groupId: number): Promise<Level[]> {
    const group = await this.groupRepo.findOne({
      where: { id: groupId, program: { id: programId } },
      relations: ['program', 'levels'],
    });

    if (!group) {
      throw new NotFoundException(`Group ${groupId} not found in Program ${programId}`);
    }

    return group.levels;
  }

  async findOneInProgramGroup(programId: number, groupId: number, levelId: number): Promise<Level> {
    const level = await this.levelRepo.findOne({
      where: { id: levelId, group: { id: groupId, program: { id: programId } } },
      relations: ['group', 'group.program'],
    });

    if (!level) {
      throw new NotFoundException(
        `Level ${levelId} not found in Group ${groupId} of Program ${programId}`,
      );
    }

    return level;
  }
}
