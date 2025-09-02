import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegistrationService } from '../services/registration.service';
import { RegistrationDto } from '../dto/registration.dto';
import { RequestOtpDto } from '../dto/request-otp.dto';
import { ActivateAccountDto } from '../dto/activate-account.dto';
import { LoginDto } from 'src/dto/login.dto';
import { CheckPhoneDto } from 'src/dto/check-phone.dto';

@Controller('auth') // Menetapkan prefix /auth untuk semua rute di sini
export class AuthController {
    constructor(
        private readonly registrationService: RegistrationService,
        private readonly authService: AuthService,
    ) { }

    // Rute ini sekarang akan cocok dengan: POST /auth/register
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registrationDto: RegistrationDto) {
        // Memanggil service registrasi yang sudah ada
        return this.registrationService.registerStudent(registrationDto);
    }

    @Post('request-otp')
    @HttpCode(HttpStatus.OK)
    async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
        return this.authService.requestOtp(requestOtpDto);
    }

    @Post('activate-account')
    @HttpCode(HttpStatus.OK)
    async activateAccount(@Body() activateAccountDto: ActivateAccountDto) {
        return this.authService.activateAccount(activateAccountDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @Post('check-phone')
    @HttpCode(HttpStatus.OK)
    async checkPhoneStatus(@Body() checkPhoneDto: CheckPhoneDto) {
        return this.authService.checkPhoneStatus(checkPhoneDto);
    }
}