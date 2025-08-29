import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { Program } from '../entities/program.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
  ) {}

  async findByProgram(programId: number): Promise<Group[]> {
    const program = await this.programRepo.findOne({
      where: { id: programId },
      relations: ['groups'],
    });
    if (!program) {
      throw new NotFoundException(`Program with id ${programId} not found`);
    }
    return program.groups;
  }

  async findOne(id: number): Promise<Group> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['program', 'levels'],
    });
    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }
    return group;
  }
}
