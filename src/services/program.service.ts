import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../entities/program.entity';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
  ) {}

  async findAll(): Promise<Program[]> {
    return this.programRepo.find({ relations: ['groups'] });
  }

  async findOne(id: number): Promise<Program> {
    const program = await this.programRepo.findOne({
      where: { id },
      relations: ['groups'],
    });
    if (!program) {
      throw new NotFoundException(`Program with id ${id} not found`);
    }
    return program;
  }
}
