import { CommentSection } from "@/components/comment-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import comments from "@/data/comments";
import commentOnResource from "@/data/comments-on-resource";
import resources from "@/data/resources";
import users from "@/data/users";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { resourceID: string }; // resourceID from the URL
}) {
  const resourceID = parseInt(params.resourceID, 10);

  const resource = resources.find((res) => res.resourceID == resourceID);
  if (!resource) {
    notFound();
  }
  const user = users.find((user) => user.userID === resource.userID);
  if (!user) {
    notFound();
  }
  const currentComments = commentOnResource
    .filter((comment) => comment.resourceID == resourceID)
    .map(({ commentID }) => comments.find((cmt) => cmt.commentID == commentID))
    .filter((comment) => comment != undefined);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <div className="flex justify-center">
        <main className="md:w-[765px] w-full px-10 mt-10 mb-20 space-y-6">
          <div className="flex gap-2 items-center">
            <Avatar className="w-[48px] h-[48px]">
              <AvatarImage src="" />
              <AvatarFallback>
                {user.email.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </div>
          <h1 className="text-5xl font-bold">{resource.title}</h1>
          <p className="">
            {resource.description}
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam placeat
            nobis saepe illo delectus vel cumque pariatur aspernatur laudantium
            facilis est minima reiciendis magni facere voluptatibus, suscipit
            nisi numquam explicabo?
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge>{resource.type}</Badge>
            <Badge variant="secondary">{resource.subject}</Badge>
          </div>
          <div className="w-full flex gap-6 flex-wrap">
            <div className="min-w-[192px] aspect-square rounded-xl bg-secondary" />
            <div className="min-w-[192px] aspect-square rounded-xl bg-secondary" />
            <div className="min-w-[192px] aspect-square rounded-xl bg-secondary" />
          </div>
          <CommentSection comments={currentComments} />
        </main>
      </div>
    </div>
  );
}
