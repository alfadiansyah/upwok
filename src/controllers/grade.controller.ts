import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GradeService } from '../services/grade.service';
import { Grade } from '../entities/grade.entity';

@Controller()
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Get('programs/:programId/groups/:groupId/levels/:levelId/grades')
  async getGrades(
    @Param('programId', ParseIntPipe) programId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('levelId', ParseIntPipe) levelId: number,
  ): Promise<Grade[]> {
    return this.gradeService.findByLevel(programId, groupId, levelId);
  }

  @Get('programs/:programId/groups/:groupId/levels/:levelId/grades/:gradeId')
  async getGrade(
    @Param('programId', ParseIntPipe) programId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('levelId', ParseIntPipe) levelId: number,
    @Param('gradeId', ParseIntPipe) gradeId: number,
  ): Promise<Grade> {
    return this.gradeService.findOneInLevel(programId, groupId, levelId, gradeId);
  }
}
