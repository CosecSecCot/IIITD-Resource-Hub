import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import users from "@/data/users"; // assuming you have user info
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, HeartCrack } from "lucide-react";

export function QuestionCard({
  questionID,
  content,
  dateAsked,
  upvote,
  downvote,
  userID,
}: {
  questionID: number;
  content: string;
  dateAsked: string;
  upvote: number;
  downvote: number;
  userID: number;
}) {
  const user = users.find((u) => u.userID === userID);
  if (!user) return null;

  return (
    <Card className="cursor-pointer">
      <Link href={`/questions/${questionID}`}>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <CardTitle className="text-lg">{content}</CardTitle>
              <CardDescription>
                {new Date(dateAsked).toDateString()}
              </CardDescription>
              <div className="flex space-x-4">
                <div className="flex space-x-2 items-center">
                  <Heart className="h-4 w-4" />
                  <span>{upvote}</span>
                </div>
                <div className="flex space-x-2 items-center">
                  <HeartCrack className="h-4 w-4" />
                  <span>{downvote}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Avatar className="w-[40px] h-[40px]">
                <AvatarImage src="" />
                <AvatarFallback>
                  {user.email?.slice(0, 2).toUpperCase() || "AU"}
                </AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
