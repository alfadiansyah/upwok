import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LevelService } from '../services/level.service';
import { Level } from '../entities/level.entity';

@Controller()
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get('programs/:programId/groups/:groupId/levels')
  async getLevels(
    @Param('programId', ParseIntPipe) programId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<Level[]> {
    return this.levelService.findByProgramGroup(programId, groupId);
  }

  @Get('programs/:programId/groups/:groupId/levels/:levelId')
  async getLevel(
    @Param('programId', ParseIntPipe) programId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('levelId', ParseIntPipe) levelId: number,
  ): Promise<Level> {
    return this.levelService.findOneInProgramGroup(programId, groupId, levelId);
  }
}
