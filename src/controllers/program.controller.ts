import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProgramService } from '../services/program.service';
import { Program } from '../entities/program.entity';

@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  async getAll(): Promise<Program[]> {
    return this.programService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Program> {
    return this.programService.findOne(id);
  }
}
