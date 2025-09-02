import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CheckPhoneDto {
    @IsNotEmpty({ message: 'Phone number cannot be empty.' })
    @IsPhoneNumber('ID', { message: 'Invalid Indonesian phone number format.' })
    phoneNumber: string;
}