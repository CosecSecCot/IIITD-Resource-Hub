import { Blog } from "@/data/schema";

const blogs: Blog[] = [
  {
    blogID: 1,
    title: "How to Ace DSA Interviews",
    content: "A comprehensive guide to mastering Data Structures & Algorithms.",
    dateCreated: "2024-01-20T10:00:00Z",
    views: 1200,
    upvote: 250,
    downvote: 10,
    userID: 1,
  },
  {
    blogID: 2,
    title: "Understanding Memory Management in OS",
    content: "A deep dive into paging, segmentation, and virtual memory.",
    dateCreated: "2024-02-10T15:30:00Z",
    views: 950,
    upvote: 180,
    downvote: 5,
    userID: 3,
  },
  {
    blogID: 3,
    title: "The Rise of AI in Software Development",
    content: "Exploring the impact of AI-assisted coding tools.",
    dateCreated: "2024-03-01T12:15:00Z",
    views: 1500,
    upvote: 300,
    downvote: 15,
    userID: 2,
  },
];

export default blogs;
