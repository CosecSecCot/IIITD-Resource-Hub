"use client";
import { Suspense, useEffect, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Toggle } from "./ui/toggle";
import { Heart, HeartCrack } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type UserCommentProps = {
  commentid: number;
  content: string;
  date: string;
  upvote: number;
  downvote: number;
  isdeleted: boolean;
  useremail: string;
  username: string;
  userimgurl: string;
  noReplies: boolean;
};

export function CommentSection({
  comments,
  resourceID,
  blogID,
  questionID,
  answerID,
}: {
  comments: UserCommentProps[] | Record<string, unknown>[];
  resourceID?: number;
  blogID?: number;
  questionID?: number;
  answerID?: number;
}) {
  // Count how many of the optional IDs are defined
  const idCount =
    Number(resourceID !== undefined) +
    Number(blogID !== undefined) +
    Number(questionID !== undefined) +
    Number(answerID !== undefined);

  if (idCount !== 1) {
    throw new Error(
      "Exactly one of resourceID, blogID, questionID, or answerID must be provided.",
    );
  }

  const router = useRouter();

  const [userID, setUserID] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/currentDBUserID");
      if (!res.ok) {
        console.error("Failed to fetch DB user");
        return;
      }
      const dbUser = await res.json();
      setUserID(dbUser.userid);
    }

    fetchUser();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    const content = (formData.get("comment") ?? "").toString();
    if (!content.trim()) {
      toast("Uh oh! Something went wrong.", {
        description: "There was a problem creating the comment!",
      });
      return;
    }

    if (!userID) {
      toast("Uh oh! Something went wrong.", {
        description: "There was a problem creating the comment!",
      });
      return;
    }

    // Post new comment to the API endpoint
    let res: Response;
    if (resourceID) {
      res = await fetch("/api/comments/resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          userID: userID,
          resourceID: resourceID,
        }),
      });
    } else if (blogID) {
      res = await fetch("/api/comments/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, userID: userID, blogID: blogID }),
      });
    } else if (questionID) {
      res = await fetch("/api/comments/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          userID: userID,
          questionID: questionID,
        }),
      });
    } else {
      res = await fetch("/api/comments/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, userID: userID, answerID: answerID }),
      });
    }

    if (res.ok) {
      toast("Comment added successfully!");
      form.reset();
      router.refresh();
    } else {
      toast("Uh oh! Something went wrong.", {
        description: "There was a problem creating the comment!",
      });
      console.error("Error creating comment");
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Comments</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Textarea name="comment" placeholder="Add a Comment..." />
        <Button type="submit">Submit</Button>
      </form>
      <div className="space-y-6 overflow-x-scroll px-2 py-4">
        {comments.map((comment, index) => {
          if (!comment) return;
          console.log(`comment ${index}:`, comment);
          return (
            <Suspense key={index} fallback={<div>Loading...</div>}>
              <UserComment key={index} {...comment} noReplies={false} />
            </Suspense>
          );
        })}
      </div>
    </div>
  );
}

export function UserComment({
  commentid,
  content,
  date,
  upvote,
  downvote,
  isdeleted,
  useremail,
  username,
  userimgurl,
  noReplies = false,
}: Partial<UserCommentProps>) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<UserCommentProps[]>([]);
  const [isPending, startTransition] = useTransition();

  async function loadReplies() {
    try {
      const res = await fetch(`/api/comments/${commentid}/replies`);
      if (!res.ok) {
        console.error("Error fetching replies");
        return;
      }
      const data: UserCommentProps[] = await res.json();
      setReplies(data);
    } catch (err) {
      console.error("Failed to load replies:", err);
    }
  }

  const handleShowReplies = () => {
    setShowReplies(true);
    startTransition(() => {
      loadReplies();
    });
  };

  return (
    <div className="flex flex-col pt-2 items-start">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={userimgurl} />
          <AvatarFallback>
            {useremail?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <div className="font-bold">{username}</div>
            <div className="text-xs text-muted-foreground">
              {date ? new Date(date).toDateString() : ""}
            </div>
          </div>
          <div className={`text-sm ${isdeleted ? "italic" : ""}`}>
            {isdeleted ? "This comment is deleted" : content}
          </div>
          <div className="flex space-x-2">
            <Toggle aria-label="Upvote" size="sm" className="cursor-pointer">
              <Heart className="h-4 w-4" />
              {upvote}
            </Toggle>
            <Toggle aria-label="Downvote" size="sm" className="cursor-pointer">
              <HeartCrack className="h-4 w-4" />
              {downvote}
            </Toggle>
          </div>
          {!showReplies && !noReplies && (
            <Button
              variant="outline"
              onClick={handleShowReplies}
              className="mt-2 w-fit cursor-pointer"
            >
              Show Replies
            </Button>
          )}
        </div>
      </div>
      {showReplies &&
        !noReplies &&
        (isPending ? (
          <div className="pt-4 ml-5 pl-11 border-l border-[#c4c4c5]">
            Loading Replies...
          </div>
        ) : (
          replies.map((reply, index) => (
            <div
              className="pt-4 ml-5 pl-11 border-l border-[#c4c4c5]"
              key={index}
            >
              <UserComment {...reply} noReplies={noReplies} />
            </div>
          ))
        ))}
    </div>
  );
}
