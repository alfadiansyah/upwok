import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { Group } from '../entities/group.entity';

@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('programs/:programId/groups')
  async getByProgram(
    @Param('programId', ParseIntPipe) programId: number,
  ): Promise<Group[]> {
    return this.groupService.findByProgram(programId);
  }

  @Get('groups/:id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Group> {
    return this.groupService.findOne(id);
  }
}
