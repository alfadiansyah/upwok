import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsPhoneNumber('ID')
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}