import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from '../controllers/profile.controller';
import { ProfileService } from '../services/profile.service';
import { User } from '../entities/user.entity';
import { Student } from 'src/entities';

@Module({
    imports: [TypeOrmModule.forFeature([User,Student])],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}