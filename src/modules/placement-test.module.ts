import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacementTestController } from 'src/controllers/placement-test.controller';
import { PlacementTestService } from 'src/services/placement-test.service';

// 👇 Now, import everything from the central barrel file
import {
    Group,
    PlacementTest,
    PlacementTestAnswer,
    PlacementTestResult,
    Student,
    Test,
    TestQuestion
} from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Test,
      TestQuestion,
      Group,
      PlacementTest,
      PlacementTestResult,
      Student,
      TestQuestion,PlacementTestAnswer
    ]),
  ],
  controllers: [PlacementTestController],
  providers: [PlacementTestService],
  exports: [PlacementTestService],
})
export class PlacementTestModule {}