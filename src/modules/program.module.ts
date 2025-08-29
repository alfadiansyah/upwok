import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from '../entities/program.entity';
import { ProgramService } from '../services/program.service';
import { ProgramController } from '../controllers/program.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Program])],
  providers: [ProgramService],
  controllers: [ProgramController],
})
export class ProgramModule {}
