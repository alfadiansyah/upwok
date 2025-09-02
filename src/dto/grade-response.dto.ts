class TeacherDto {
    id: number;
    name: string;
}

export class GradeResponseDto {
    id: number;
    gradeNumber: number;
    prerequisites: string | null;
    taughtBy: TeacherDto[];
}