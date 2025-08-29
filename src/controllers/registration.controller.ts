import { Controller, Post, Body } from '@nestjs/common';
import { RegistrationService } from '../services/registration.service';
import { RegistrationDto } from '../dto/registration.dto';

@Controller('registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  async register(@Body() dto: RegistrationDto) {
    return this.registrationService.registerStudent(dto);
  }
}
