import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../entities/group.entity';
import { Program } from '../entities/program.entity';
import { GroupService } from '../services/group.service';
import { GroupController } from '../controllers/group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Program])],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
