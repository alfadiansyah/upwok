class SimpleScheduleDto {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    locationName: string;
    teacherName: string;
}

class SimpleTestResultDto {
    testName: string;
    score: number;
    status: string;
    determinedLevel?: string;
}

export class StudentDetailDto {
    id: number;
    name: string;
    programName?: string;
    groupName?: string;
    levelName?: string;
    gradeNumber?: number;
    schedules: SimpleScheduleDto[];
    testResults: SimpleTestResultDto[];
}