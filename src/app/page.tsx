import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import users from "@/data/users";
import resources from "@/data/resources";
import questions from "@/data/questions";
import comments from "@/data/comments";
import blogs from "@/data/blogs";
import { QuestionCard } from "@/app/questions/page";
import { UserComment } from "@/components/comment-section";
import { BlogCard } from "@/app/blogs/page";
import Link from "next/link";

export default function Home() {
  // Group resource counts per user.
  const resourceCounts: Record<number, number> = {};
  resources.forEach((r) => {
    resourceCounts[r.userID] = (resourceCounts[r.userID] || 0) + 1;
  });

  // Top 10 users with the highest number of resources.
  const top10Users = users
    .map((user) => ({
      ...user,
      resourceCount: resourceCounts[user.userID] || 0,
    }))
    .sort((a, b) => b.resourceCount - a.resourceCount)
    .slice(0, 10);

  // Users with more than 3 resource uploads.
  const activeContributors = users
    .map((user) => ({
      ...user,
      resourceCount: resourceCounts[user.userID] || 0,
    }))
    .filter((user) => user.resourceCount > 3);

  // Most liked question.
  const mostLikedQuestion = [...questions].sort(
    (a, b) => b.upvote - a.upvote,
  )[0];

  // Most liked comment.
  const mostLikedComment = [...comments].sort((a, b) => b.upvote - a.upvote)[0];

  // Most liked blog.
  const mostLikedBlog = [...blogs].sort((a, b) => b.upvote - a.upvote)[0];

  return (
    <div className="space-y-12">
      <header className="flex justify-center bg-gray-100 py-10">
        <div className="text-center">
          <h1 className="text-6xl font-bold">IIITD Resource Hub</h1>
          <p className="mt-4 text-xl">
            Find PYQs, Quizes, Tutorials and Notes across IIITD.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/resources">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-10 space-y-12">
        <section>
          <h2 className="text-4xl font-bold mb-4">Top 10 Uploaders</h2>
          <ul className="space-y-2">
            {top10Users.map((user, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {user.email.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.resourceCount} resources uploaded
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-4xl font-bold mb-4">Active Contributors</h2>
          {activeContributors.length ? (
            <ul className="space-y-2">
              {activeContributors.map((user) => (
                <li key={user.userID} className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {user.email.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.resourceCount} resources uploaded
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users with more than 3 uploads.</p>
          )}
        </section>

        {mostLikedQuestion && (
          <section>
            <h2 className="text-4xl font-bold mb-4">Most Liked Question</h2>
            <QuestionCard {...mostLikedQuestion} />
          </section>
        )}

        {mostLikedComment && (
          <section>
            <h2 className="text-4xl font-bold mb-4">Most Liked Comment</h2>
            <UserComment comment={mostLikedComment} noReplies={false} />
          </section>
        )}

        {mostLikedBlog && (
          <section>
            <h2 className="text-4xl font-bold mb-4">Most Liked Blog</h2>
            <BlogCard {...mostLikedBlog} />
          </section>
        )}
      </main>
    </div>
  );
}
