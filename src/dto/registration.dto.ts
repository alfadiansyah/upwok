export class RegistrationDto {
    phoneNumber: string;
    instagram?: string;
    studentName: string;
    programId: number;
    groupId: number;
    levelId: number;
    gradeId: number;
    locationId: number; // Tambahan
    schedules: { teacherScheduleId: number }[];
}
