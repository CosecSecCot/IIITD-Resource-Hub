import { Answer } from "@/data/schema";

const answers: Answer[] = [
  {
    answerID: 1,
    content:
      "React's official documentation and the Fullstack Open course are great starting points.",
    dateAnswered: "2024-02-06T14:20:00Z",
    upvote: 30,
    downvote: 3,
    questionID: 1,
    userID: 3,
  },
  {
    answerID: 2,
    content:
      "Memory management in C involves dynamic allocation using malloc, free, and stack vs. heap memory concepts.",
    dateAnswered: "2024-02-16T15:10:00Z",
    upvote: 18,
    downvote: 2,
    questionID: 2,
    userID: 2,
  },
  {
    answerID: 3,
    content:
      "BFS uses a queue and explores level by level, whereas DFS uses a stack and explores depth-wise.",
    dateAnswered: "2024-03-02T11:45:00Z",
    upvote: 22,
    downvote: 0,
    questionID: 3,
    userID: 1,
  },
];

export default answers;
