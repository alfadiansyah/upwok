// DTO untuk menampilkan jadwal simpel
class SimpleScheduleDto {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    locationName: string;
    teacherName: string;
}

// DTO untuk menampilkan hasil tes simpel
class SimpleTestResultDto {
    testName: string;
    score: number;
    status: string;
    determinedLevel?: string;
}

// DTO utama untuk detail setiap siswa
export class StudentDetailDto {
    id: number;
    name: string;
    schedules: SimpleScheduleDto[];
    testResults: SimpleTestResultDto[];
}