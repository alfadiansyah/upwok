// DTO untuk setiap item siswa dalam daftar
class StudentItemDto {
    studentId: number;
    studentName: string;
    parentPhoneNumber: string;
    program: string;
    group: string;
    teacherName: string;
    schedule: string;
}

// DTO untuk respons paginasi
export class AdminStudentListDto {
    data: StudentItemDto[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}
