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
  {
    commentID: 4,
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque reprehenderit mollitia necessitatibus minus ullam voluptates excepturi deserunt quos consectetur accusantium placeat odit, iure dolorum dolor asperiores iste, voluptatem ea minima?",
    date: "2025-04-08",
    upvote: 5,
    downvote: 0,
    isDeleted: false,
    userID: 1,
  },
  {
    commentID: 5,
    content: "Another top-level comment.",
    date: "2025-04-08",
    upvote: 3,
    downvote: 1,
    isDeleted: false,
    userID: 2,
  },
  {
    commentID: 6,
    content: "This is a reply to comment 1.",
    date: "2025-04-08",
    upvote: 2,
    downvote: 0,
    isDeleted: false,
    userID: 3,
  },
  {
    commentID: 7,
    content: "This is also a reply to comment 1.",
    date: "2025-04-08",
    upvote: 4,
    downvote: 0,
    isDeleted: false,
    userID: 4,
  },
  {
    commentID: 9,
    content: "A reply to comment 3.",
    date: "2025-04-08",
    upvote: 5,
    downvote: 0,
    isDeleted: false,
    userID: 5,
  },
];

export default comments;
