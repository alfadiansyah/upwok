import { IsNotEmpty, IsPhoneNumber, IsString, Length, MinLength } from 'class-validator';

export class ActivateAccountDto {
    @IsNotEmpty()
    @IsPhoneNumber('ID')
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 6, { message: 'OTP must be exactly 6 characters' })
    otp: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    newPassword: string;
}