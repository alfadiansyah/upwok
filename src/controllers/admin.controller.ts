import { Controller, Get, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';
import { AdminService } from '../services/admin.service';
import { AdminStudentListDto } from 'src/dto/admin-student-list.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('dashboard')
    getDashboardData() {
        return { message: 'Welcome to the Admin Dashboard!' };
    }

    @Get('students')
    getAllStudents(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ): Promise<AdminStudentListDto> {
        return this.adminService.findAllStudents(page, limit);
    }
}
