import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';

// Import Modul, Controller, dan Service terkait
import { AuthController } from '../controllers/auth.controller';
import { AuthService, WhatsappService } from '../services/auth.service';
// import { WhatsappService } from '../services/whatsapp.service'; // Simulasi WA
import { User } from '../entities/user.entity';

// Import modul yang servicenya akan kita gunakan
import { RegistrationModule } from './registration.module';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
    imports: [
        // Impor RegistrationModule agar kita bisa inject RegistrationService
        RegistrationModule,
        // Konfigurasi cache untuk OTP
        forwardRef(() => RegistrationModule),

        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: 'YOUR_VERY_SECRET_KEY', // IMPORTANT: Move this to a .env file
            signOptions: { expiresIn: '1d' }, // Token expires in 1 day
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, WhatsappService, JwtStrategy],
})
export class AuthModule { }