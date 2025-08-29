import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Entities from './entities';
import { ProgramModule } from './modules/program.module';
import { GroupModule } from './modules/group.module';
import { LevelModule } from './modules/level.module';
import { GradeModule } from './modules/grade.module';
import { LocationModule } from './modules/location.module';
import { TeacherScheduleModule } from './modules/teacher-schedule.module';
import { RegistrationModule } from './modules/registration.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'magnum',
      database: 'edu_program',
      synchronize: false, // jangan true kalau DB sudah ada
      logging: true,
      entities: Object.values(Entities),
    }),
    ProgramModule, GroupModule, LevelModule, GradeModule, LocationModule, TeacherScheduleModule, RegistrationModule,
  ],
})
export class AppModule { }
