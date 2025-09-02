import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SubmitGuestTestDto } from 'src/dto/submit-guest-test.dto';
import { StartGuestTestDto } from 'src/dto/start-guest-test.dto';
import { PlacementTestService } from 'src/services/placement-test.service';

@Controller('placement-tests')
export class PlacementTestController {
  constructor(private readonly placementTestService: PlacementTestService) {}

  @Post('start-guest')
  @HttpCode(HttpStatus.CREATED)
  async startGuestTest(@Body() startGuestDto: StartGuestTestDto) {
    // PERBAIKAN: Kirim seluruh objek DTO ke service
    return this.placementTestService.startGuestTest(startGuestDto);
  }

  @Post('submit-guest')
  @HttpCode(HttpStatus.OK)
  async submitGuestTest(@Body() submitDto: SubmitGuestTestDto) {
    return this.placementTestService.submitGuestTest(submitDto);
  }
}