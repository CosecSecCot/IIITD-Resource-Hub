import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

import { Comment } from "@/data/schema";
import users from "@/data/users";

export default function CommentSection({ comments }: { comments: Comment[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Comments</h2>
      <div className="space-y-4">
        <Textarea placeholder="Add a Comment..." />
        <Button type="submit">Submit</Button>
      </div>
      <div className="space-y-6">
        {comments.map((comment, index) => {
          if (!comment) return;
          return <UserComment key={index} {...comment} />;
        })}
      </div>
    </div>
  );
}

function UserComment({ content, date, isDeleted, userID }: Comment) {
  const user = users.find((user) => user.userID === userID);
  if (!user) {
    return;
  }
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-10 w-10 border">
        <AvatarImage src="" />
        <AvatarFallback>{user.email.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="grid gap-1.5">
        <div className="flex items-center gap-2">
          <div className="font-bold">{user.name}</div>
          <div className="text-xs text-muted-foreground">{date}</div>
        </div>
        <div className={`text-sm ${isDeleted ? "italic" : ""}`}>
          {isDeleted ? "This comment is deleted" : content}
        </div>
      </div>
    </div>
  );
}

