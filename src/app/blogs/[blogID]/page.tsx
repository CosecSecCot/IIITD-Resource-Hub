import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import blogs from "@/data/blogs";
import users from "@/data/users";
import comments from "@/data/comments";
import commentOnBlog from "@/data/comments-on-blog";
import CommentSection from "@/components/comment-section";

export default function BlogPage({
  params,
}: {
  params: { blogID: string };
}) {
  const blogID = parseInt(params.blogID, 10);

  const blog = blogs.find((b) => b.blogID === blogID);
  if (!blog) notFound();

  const user = users.find((u) => u.userID === blog.userID);
  if (!user) notFound();

  // Fetch all comments linked to this blog
  const currentComments = commentOnBlog
    .filter((c) => c.blogID === blogID)
    .map(({ commentID }) => comments.find((cmt) => cmt.commentID === commentID))
    .filter((cmt) => cmt !== undefined);

  return (
    <div className="flex justify-center">
      <main className="md:w-[765px] w-full px-10 mt-10 mb-20 space-y-6">
        {/* Author Info */}
        <div className="flex gap-2 items-center">
          <Avatar className="w-[48px] h-[48px]">
            <AvatarImage src={""} />
            <AvatarFallback>
              {user.email.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </div>

        {/* Blog Title */}
        <h1 className="text-5xl font-bold">{blog.title}</h1>

        {/* Blog Content */}
        <div className="prose prose-neutral">
          {blog.content.split("\n\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Metadata Badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">
            {new Date(blog.dateCreated).toDateString()}
          </Badge>
          <Badge>👁️ {blog.views}</Badge>
          <Badge>👍 {blog.upvote}</Badge>
          <Badge variant="destructive">👎 {blog.downvote}</Badge>
        </div>

        {/* Placeholder thumbnails */}
        <div className="w-full flex gap-6 flex-wrap">
          <div className="min-w-[192px] aspect-square rounded-xl bg-secondary" />
          <div className="min-w-[192px] aspect-square rounded-xl bg-secondary" />
          <div className="min-w-[192px] aspect-square rounded-xl bg-secondary" />
        </div>

        {/* Comments */}
        <CommentSection comments={currentComments} />
      </main>
    </div>
  );
}
