import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RequestOtpDto {
    @IsNotEmpty()
    @IsPhoneNumber('ID')
    phoneNumber: string;
}