import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import resources from "@/data/resources";
import users from "@/data/users";
import { Resource } from "@/data/schema";

export default function Resources() {
  return (
    <div className="">
      <main className="md:w-[765px] px-10 mx-auto mt-20 mb-20">
        <h1 className="md:text-6xl text-5xl font-bold">Resources</h1>
        <p className="text-muted-foreground mt-4">
          Search any type of resource across the whole platform.
        </p>
        <div className="flex md:flex-row flex-col gap-2 mt-20">
          <Input placeholder="Search Resources..." />
          <Button className="w-fit" type="submit">
            Search
          </Button>
        </div>
        <div className="mt-10 space-y-6">
          {resources.map((resource, index) => {
            return <ResourceCard key={index} {...resource} />;
          })}
        </div>
      </main>
    </div>
  );
}

function ResourceCard({
  resourceID,
  userID,
  title,
  description,
  type,
  subject,
}: Resource) {
  const user = users.find((user) => user.userID === userID);
  if (!user) return;

  return (
    <Card className="cursor-pointer">
      <Link href={`resources/${resourceID}`}>
        <CardContent>
          <div className="flex md:flex-row flex-col gap-6">
            <div className="md:min-w-[256px] min-h-[256px] bg-secondary rounded-lg" />
            <div className="flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <div className="flex"></div>
                <div className="flex gap-2">
                  <Badge>{type}</Badge>
                  <Badge variant="secondary">{subject}</Badge>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Avatar className="w-[40px] h-[40px]">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {user.email.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
