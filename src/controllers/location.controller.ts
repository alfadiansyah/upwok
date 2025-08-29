import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LocationService } from '../services/location.service';

@Controller('locations')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Get(':id/available-schedules')
    async getAvailableSchedules(@Param('id', ParseIntPipe) locationId: number) {
        return this.locationService.getAvailableSchedules(locationId);
    }
    @Get()
    async getAllLocations() {
        return this.locationService.getAllLocations();
    }
}
