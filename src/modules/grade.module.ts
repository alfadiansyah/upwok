import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from '../entities/grade.entity';
import { Level } from '../entities/level.entity';
import { GradeService } from '../services/grade.service';
import { GradeController } from '../controllers/grade.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Grade, Level])],
  providers: [GradeService],
  controllers: [GradeController],
})
export class GradeModule {}
