import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from '../entities/level.entity';
import { Group } from '../entities/group.entity';
import { Program } from '../entities/program.entity';
import { LevelService } from '../services/level.service';
import { LevelController } from '../controllers/level.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Level, Group, Program])],
  providers: [LevelService],
  controllers: [LevelController],
})
export class LevelModule {}
