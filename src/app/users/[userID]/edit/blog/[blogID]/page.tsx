import { notFound } from "next/navigation";
import users from "@/data/users";
import blogs from "@/data/blogs";
import PostBlogForm from "@/app/users/[userID]/_components/upload-blog-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Page({
  params,
}: {
  params: Promise<{ userID: string; blogID: string }>;
}) {
  const resolvedParams = await params;
  const userID = parseInt(resolvedParams.userID, 10);
  const blogID = parseInt(resolvedParams.blogID, 10);

  const user = users.find((user) => user.userID === userID);
  if (!user) {
    notFound();
  }

  const blogToEdit = blogs.find((blog) => blog.blogID === blogID);
  if (!blogToEdit) {
    notFound();
  }

  const initialData = {
    title: blogToEdit.title,
    content: blogToEdit.content,
  };

  return (
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
        <h1 className="text-5xl font-bold">Edit Your Blog</h1>
        <PostBlogForm userID={userID} initialData={initialData} />
      </main>
    </div>
  );
}
