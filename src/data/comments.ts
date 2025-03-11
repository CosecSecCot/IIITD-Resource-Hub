import { Comment } from "@/data/schema";

const comments: Comment[] = [
  {
    commentID: 1,
    content: "Great resource! Helped a lot.",
    date: "2024-02-16T12:00:00Z",
    upvote: 15,
    downvote: 2,
    isDeleted: false,
    userID: 2,
  },
  {
    commentID: 2,
    content: "Can you add more explanations?",
    date: "2024-03-02T09:30:00Z",
    upvote: 7,
    downvote: 1,
    isDeleted: false,
    userID: 3,
  },
  {
    commentID: 3,
    content: "This needs an update for the latest syllabus.",
    date: "2024-01-25T17:45:00Z",
    upvote: 5,
    downvote: 3,
    isDeleted: false,
    userID: 1,
  },
];

export default comments;
