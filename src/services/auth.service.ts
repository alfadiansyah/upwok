import { Injectable, Inject, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';

import { RequestOtpDto } from '../dto/request-otp.dto';
import { ActivateAccountDto } from '../dto/activate-account.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { CheckPhoneDto } from 'src/dto/check-phone.dto';

@Injectable()
export class WhatsappService {
    async sendOtp(phoneNumber: string, otp: string): Promise<void> {
        console.log(`[WHATSAPP SIMULATION] Sending OTP ${otp} to ${phoneNumber}`);
    }
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly whatsappService: WhatsappService,
        private readonly jwtService: JwtService,

    ) { }

    async requestOtp(dto: RequestOtpDto): Promise<{ message: string; otpForTesting: string }> {
        const { phoneNumber } = dto;
        const user = await this.userRepo.findOneBy({ phoneNumber });

        if (!user) {
            throw new NotFoundException('User with this phone number is not registered.');
        }
        if (user.firstLoginCompleted) {
            throw new BadRequestException('This account has already been activated.');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Pastikan variabel 'cacheKey' didefinisikan dengan benar seperti ini
        const cacheKey = `otp:${phoneNumber}`;

        // Simpan OTP dengan 'cacheKey' yang benar
        await this.cacheManager.set(cacheKey, otp, 300);

        await this.whatsappService.sendOtp(phoneNumber, otp);

        return {
            message: 'An OTP has been sent to your number.',
            otpForTesting: otp
        };
    }

    async activateAccount(dto: ActivateAccountDto): Promise<{ message: string }> {
        const { phoneNumber, otp, newPassword } = dto;
        // Gunakan 'cacheKey' dengan format yang sama persis
        const cacheKey = `otp:${phoneNumber}`;
        try {
            await this.cacheManager.set(cacheKey, otp, 300);
            console.log(`[DEBUG] Successfully SET OTP in cache for key "${cacheKey}": ${otp}`);
        } catch (error) {
            console.error('[FATAL CACHE ERROR] Failed to set OTP in Redis:', error);
            // Optionally re-throw or handle this critical failure
            throw new Error('Could not save session to cache.');
        }
        const storedOtp = await this.cacheManager.get<string>(cacheKey);

        if (!storedOtp || storedOtp !== otp) {
            throw new UnauthorizedException('The OTP is incorrect or has expired.');
        }

        const user = await this.userRepo.findOneBy({ phoneNumber });
        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.passwordHash = hashedPassword;
        user.firstLoginCompleted = true;
        await this.userRepo.save(user);

        await this.cacheManager.del(cacheKey);

        return { message: 'Your account has been activated successfully!' };
    }
    async login(dto: LoginDto): Promise<{ accessToken: string }> {
        const { phoneNumber, password } = dto;

        // 1. Find the user by phone number
        const user = await this.userRepo.findOneBy({ phoneNumber });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // 2. Check if the account has been activated
        if (!user.firstLoginCompleted) {
            throw new BadRequestException('Account not activated. Please verify with OTP first.');
        }

        // 3. Compare the provided password with the stored hash
        const isPasswordMatching = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordMatching) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // 4. Generate and return a JWT
        const payload = { sub: user.id, phoneNumber: user.phoneNumber };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async checkPhoneStatus(dto: CheckPhoneDto): Promise<{ status: string }> {
        const { phoneNumber } = dto;
        const user = await this.userRepo.findOneBy({ phoneNumber });

        // Kasus 1: Nomor HP tidak terdaftar sama sekali
        if (!user) {
            throw new NotFoundException('Phone number is not registered.');
        }

        // Kasus 2: User terdaftar tapi belum menyelesaikan login pertama
        if (!user.firstLoginCompleted) {
            return { status: 'activation_required' }; // Perlu aktivasi (kirim OTP)
        }

        // Kasus 3: User sudah terdaftar dan aktif
        return { status: 'safe_to_login' }; // Lanjut ke halaman login password
    }
}