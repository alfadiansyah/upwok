import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

// DTOs
import { SubmitGuestTestDto } from 'src/dto/submit-guest-test.dto';
import { StartGuestTestDto } from 'src/dto/start-guest-test.dto';

// Entitas
import { Group, PlacementTest, PlacementTestAnswer, PlacementTestResult, Student, TestQuestion } from 'src/entities';
import { PlacementTestResultStatus } from 'src/entities/placement-test-result.entity';
import { PlacementTestStatus } from 'src/entities/placement-test.entity';
import { Test } from 'src/entities/test.entity';

// PERBAIKAN: Tipe data disesuaikan dengan logika baru (menggunakan testId)
interface TempSession {
    testId: number;
}

interface TempResult {
    testId: number;
    score: number;
    answers: { questionId: number, studentAnswer: string }[];
}

@Injectable()
export class PlacementTestService {
    private tempSessions = new Map<string, TempSession>();
    private tempResults = new Map<string, TempResult>();

    constructor(
        // PERBAIKAN: Tambahkan TestRepository
        @InjectRepository(Test)
        private readonly testRepository: Repository<Test>,
        @InjectRepository(PlacementTest)
        private readonly placementTestRepository: Repository<PlacementTest>,
        @InjectRepository(PlacementTestResult)
        private readonly placementTestResultRepository: Repository<PlacementTestResult>,
        @InjectRepository(TestQuestion)
        private readonly testQuestionRepository: Repository<TestQuestion>,
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        @InjectRepository(PlacementTestAnswer) private readonly answerRepo: Repository<PlacementTestAnswer>,

    ) { }

    /**
     * LANGKAH 1: Memulai tes untuk tamu (tanpa login).
     * PERBAIKAN: Fungsi ini sekarang HANYA ADA SATU dan menggunakan `testId` dari DTO.
     */
    async startGuestTest(startDto: StartGuestTestDto) {
        const { testId } = startDto;

        // Validasi apakah Test dengan ID tersebut ada
        const test = await this.testRepository.findOneBy({ id: testId });
        if (!test) {
            throw new NotFoundException(`Test with ID ${testId} not found`);
        }

        const testSessionId = uuidv4();
        // PERBAIKAN: Simpan `testId` di sesi, bukan `groupId`
        this.tempSessions.set(testSessionId, { testId });

        // Ambil pertanyaan yang relevan DENGAN testId
        const questions = await this.testQuestionRepository.find({
            where: { test: { id: testId } }, // Query langsung ke testId
            select: ['id', 'questionText', 'options', 'questionType'],
        });

        return {
            testSessionId,
            questions,
        };
    }

    /**
     * LANGKAH 2: Menerima jawaban dari tamu dan menghitung skor.
     */
    async submitGuestTest(submitDto: SubmitGuestTestDto) {
        const { testSessionId, answers } = submitDto;

        const session = this.tempSessions.get(testSessionId);
        if (!session) {
            throw new BadRequestException('Test session not found or has expired.');
        }

        // PERBAIKAN: Ambil `testId` dari sesi
        const { testId } = session;

        // PERBAIKAN: Cari jawaban yang benar berdasarkan `testId`
        const correctAnswers = await this.testQuestionRepository.find({
            where: { test: { id: testId } },
        });

        if (correctAnswers.length === 0) {
            throw new NotFoundException(`No questions found for test ID ${testId} to score against.`);
        }

        const answerMap = new Map(correctAnswers.map(q => [q.id, q.correctAnswer]));
        let correctCount = 0;
        answers.forEach(answer => {
            const correctAnswer = answerMap.get(answer.questionId);
            if (correctAnswer && correctAnswer.trim().toLowerCase() === answer.studentAnswer.trim().toLowerCase()) {
                correctCount++;
            }
        });

        const score = (correctCount / correctAnswers.length) * 100;

        // PERBAIKAN: Simpan `testId` di hasil sementara
        this.tempResults.set(testSessionId, { testId, score, answers });
        this.tempSessions.delete(testSessionId);

        return {
            message: 'Test submitted successfully! Please register to save and view your result.',
            testSessionId,
            score,
        };
    }

    /**
     * LANGKAH 4: Menyimpan hasil tes tamu ke database setelah user mendaftar.
     */
    async saveGuestResultToDatabase(testSessionId: string, studentId: number) {
        const tempResult = this.tempResults.get(testSessionId);
        if (!tempResult) {
            console.warn(`[PlacementTestService] No temporary result found for session ID: ${testSessionId}. Skipping save.`);
            return;
        }

        // PERBAIKAN: Ambil `testId` dari hasil sementara
        const { testId, score } = tempResult;

        // PERBAIKAN: Ambil data Test beserta relasi Group-nya
        const test = await this.testRepository.findOne({
            where: { id: testId },
            relations: ['group'], // Pastikan relasi 'group' di-load
        });
        const student = await this.studentRepository.findOneBy({ id: studentId });

        if (!student || !test || !test.group) {
            console.error(`[PlacementTestService] Student, Test, or its Group not found while saving guest result. StudentID: ${studentId}, TestID: ${testId}`);
            return;
        }
        // Buat catatan upaya pengerjaan tes
        const placementTest = this.placementTestRepository.create({
            student: student,
            test: test,
            status: PlacementTestStatus.COMPLETED,
        });
        await this.placementTestRepository.save(placementTest);

        // Buat catatan hasil tes
        const result = this.placementTestResultRepository.create({
            score,
            submittedAt: new Date(),
            status: PlacementTestResultStatus.PENDING,
            placementTest: placementTest, // Tautkan ke upaya tes
            student: student,
        });
        await this.placementTestResultRepository.save(result);

        this.tempResults.delete(testSessionId);
        console.log(`Successfully saved placement test result for student ${studentId} from session ${testSessionId}`);
    }
}