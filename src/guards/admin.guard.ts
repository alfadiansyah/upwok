import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Diambil dari payload JWT

        if (user && user.role === UserRole.ADMIN) {
            return true; // Izinkan akses
        }

        // Tolak akses jika bukan admin
        throw new ForbiddenException('You do not have permission to access this resource.');
    }
}