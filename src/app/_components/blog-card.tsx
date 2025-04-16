import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export type BlogCardProps = {
  blogid: number;
  title: string;
  content: string;
  datecreated: string;
  useremail: string;
  username: string;
  userimgurl?: string;
};

export function BlogCard({
  blogid,
  title,
  content,
  datecreated,
  useremail,
  username,
  userimgurl,
}: BlogCardProps) {
  return (
    <Card className="cursor-pointer">
      <Link href={`blogs/${blogid}`}>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>
                {new Date(datecreated).toDateString()}
              </CardDescription>
              <p className="line-clamp-3">{content}</p>
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
