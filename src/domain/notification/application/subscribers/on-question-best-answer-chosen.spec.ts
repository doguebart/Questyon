import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { makeQuestion } from "test/factories/make-question";
import { waitFor } from "test/utils/wait-for";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notificaitons-repository";
import { makeAnswer } from "test/factories/make-answer";
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sendNotificationExecuteSpy: any;

describe("On Question Best Answer Chosen", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotificationUseCase
    );
  });

  it("should send a notification when question has new best answer chosen", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    question.bestAnswerId = answer.id;

    inMemoryQuestionsRepository.save(question);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
