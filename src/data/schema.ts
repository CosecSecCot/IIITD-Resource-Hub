export interface User {
  userID: number;
  name: string;
  email: string;
  contribution: number;
  registrationDate: string;
}

export interface Resource {
  resourceID: number;
  title: string;
  description: string;
  type: "Note" | "PYQ" | "Tutorial" | "Miscellaneous";
  uploadDate: string;
  subject: string;
  year: number;
  semester: number;
  userID: number;
}

export interface ResourceFile {
  resourceFileID: number;
  url: string;
  resourceID: number;
}

export interface Comment {
  commentid: number;
  content: string;
  date: string;
  upvote: number;
  downvote: number;
  isdeleted: boolean;
  userid: number;
}

export interface Blog {
  blogid: number;
  title: string;
  content: string;
  datecreated: string;
  views: number;
  upvote: number;
  downvote: number;
  userid: number;
}

export interface Question {
  questionID: number;
  content: string;
  dateAsked: string;
  upvote: number;
  downvote: number;
  userID: number;
}

export interface Answer {
  answerID: number;
  content: string;
  dateAnswered: string;
  upvote: number;
  downvote: number;
  verified?: boolean;
  questionID: number;
  userID: number;
}

export interface CommentOnComment {
  commentID: number;
  parentCommentID: number;
}

export interface CommentOnResource {
  commentID: number;
  resourceID: number;
}

export interface CommentOnBlog {
  commentID: number;
  blogID: number;
}

export interface CommentOnAnswer {
  commentID: number;
  answerID: number;
}
