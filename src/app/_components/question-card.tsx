import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, HeartCrack } from "lucide-react";

export type QuestionProps = {
  questionid: number;
  content: string;
  upvote: string;
  downvote: string;
  dateasked: string;
  useremail: string;
  username: string;
  userimgurl?: string;
};

export function QuestionCard({
  questionid,
  content,
  dateasked,
  upvote,
  downvote,
  useremail,
  username,
  userimgurl,
}: QuestionProps) {
  return (
    <Card className="cursor-pointer">
      <Link href={`/questions/${questionid}`}>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <CardTitle className="text-lg">{content}</CardTitle>
              <CardDescription>
                {new Date(dateasked).toDateString()}
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
                <AvatarImage src={userimgurl} />
                <AvatarFallback>
                  {useremail?.slice(0, 2).toUpperCase() || "AU"}
                </AvatarFallback>
              </Avatar>
              <span>{username}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
