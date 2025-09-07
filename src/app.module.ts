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
import { PlacementTestModule } from './modules/placement-test.module';
import { AuthModule } from './modules/auth.module';
// import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { ProfileModule } from './modules/profile.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore,
        host: 'localhost',
        port: 6379,
        ttl: 300,
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:  '127.0.0.1', 
      port: 5432,
      username: 'postgres',
      password: 'magnum',
      database: 'edu_program',
      synchronize: false, // jangan true kalau DB sudah ada
      logging: true,
      entities: Object.values(Entities),
    }),
    ProgramModule, GroupModule, LevelModule, GradeModule, LocationModule, TeacherScheduleModule, RegistrationModule, PlacementTestModule, AuthModule, ProfileModule, Entities.PlacementTestAnswer

  ],
})
export class AppModule { }
