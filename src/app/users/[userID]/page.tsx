import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import resources from "@/data/resources";
import blogs from "@/data/blogs";
import questions from "@/data/questions";
import comments from "@/data/comments";
import { UserComment } from "@/components/comment-section";
import commentReplies from "@/data/comments-on-comment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import { getClerkUserData } from "@/app/_actions/clerk";

const sql = neon(process.env.DATABASE_URL!);

export default async function Page({
  params,
}: {
  params: Promise<{ userID: string }>; // userID from the URL
}) {
  const userID = parseInt((await params).userID, 10);
  const user = (await sql`SELECT * FROM Users WHERE userid=${userID}`)[0];
  if (!user) {
    notFound();
  }
  console.log(user);

  const clerkCurrentUser = await getClerkUserData(user["clerkuserid"]);

  const userResources = resources.filter(
    (resource) => resource.userID === userID,
  );
  const userBlogs = blogs.filter((blog) => blog.userID === userID);
  const userQuestions = questions.filter((ques) => ques.userID === userID);
  const userComments = comments.filter((comment) => comment.userID === userID);

  // Get an array of IDs for comments authored by the user.
  const userCommentIDs = userComments.map((c) => c.commentID);

  // Filter the reply mapping to get replies to any of the user's comments.
  const repliesMappings = commentReplies.filter((mapping) =>
    userCommentIDs.includes(mapping.parentCommentID),
  );

  // For each mapping, find the reply comment.
  const userReplies = repliesMappings
    .map((mapping) => comments.find((c) => c.commentID === mapping.commentID))
    .filter((reply): reply is (typeof comments)[0] => Boolean(reply));

  return (
    <div>
      <div className="flex justify-center">
        <main className="flex lg:flex-row flex-col justify-around gap-8 md:w-[80vw] w-full px-10 mt-10 mb-20 space-y-6">
          <div className="space-y-4">
            <Avatar className="w-[256px] h-[256px] text-5xl">
              <AvatarImage src={clerkCurrentUser.imageUrl} />
              <AvatarFallback>
                {user["email"].slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-4">
              <h1>
                <span className="text-2xl block">{user.name}</span>
                <span className="text-xl text-secondary-foreground block">
                  {user["email"]}
                </span>
              </h1>
              <p>
                <span className="text-lg text-secondary-foreground block">
                  Registered:{" "}
                  {new Date(user["registrationdate"]).toDateString()}
                </span>
                <span
                  className={`text-lg font-bold block ${user["contribution"] >= 0 ? "text-green-600" : "text-destructive"}`}
                >
                  Contribution: {user["contribution"]}
                </span>
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full">Create</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/users/${userID}/upload/resource`}>
                      Upload Resource
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/users/${userID}/upload/blog`}>
                      Write a Blog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/users/${userID}/upload/question`}>
                      Ask a Question
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="lg:w-3/4 w-full space-y-4">
            <section className="w-full">
              <h2 className="text-3xl font-bold">Your Uploads</h2>
              <Tabs defaultValue="resources" className="w-full h-[256px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="blogs">Blogs</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                </TabsList>
                <TabsContent value="resources" className="overflow-y-scroll">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date Uploaded</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="w-0">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userResources.map((resource, idx) => {
                        return (
                          <TableRow key={idx}>
                            <TableCell>{resource.title}</TableCell>
                            <TableCell>{resource.uploadDate}</TableCell>
                            <TableCell>
                              <div className="flex gap-2 flex-wrap">
                                <Badge>{resource.type}</Badge>
                                <Badge variant="secondary">
                                  {resource.subject}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <ArrowUpRight className="h-4 w-4" />
                                <span className="sr-only">See More</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="blogs">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Upvotes</TableHead>
                        <TableHead>Downvotes</TableHead>
                        <TableHead className="w-0">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userBlogs.map((blog, idx) => {
                        return (
                          <TableRow key={idx}>
                            <TableCell>{blog.title}</TableCell>
                            <TableCell>{blog.dateCreated}</TableCell>
                            <TableCell>{blog.views}</TableCell>
                            <TableCell>{blog.upvote}</TableCell>
                            <TableCell>{blog.downvote}</TableCell>
                            <TableCell>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <ArrowUpRight className="h-4 w-4" />
                                <span className="sr-only">See More</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="questions">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Date Asked</TableHead>
                        <TableHead>Upvotes</TableHead>
                        <TableHead>Downvotes</TableHead>
                        <TableHead className="w-0">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userQuestions.map((ques, idx) => {
                        return (
                          <TableRow key={idx}>
                            <TableCell>{ques.content}</TableCell>
                            <TableCell>{ques.dateAsked}</TableCell>
                            <TableCell>{ques.upvote}</TableCell>
                            <TableCell>{ques.downvote}</TableCell>
                            <TableCell>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <ArrowUpRight className="h-4 w-4" />
                                <span className="sr-only">See More</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </section>
            <section>
              <h2 className="text-3xl font-bold">Your Activity</h2>
              <div className="space-y-4 my-4 h-[256px] overflow-y-scroll">
                {userComments.map((comment, idx) => (
                  <UserComment key={idx} comment={comment} noReplies />
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-3xl font-bold">Catch Up</h2>
              <div className="space-y-4 my-4 h-[256px] overflow-y-scroll">
                {userReplies.map((comment, idx) => (
                  <UserComment key={idx} comment={comment} noReplies />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
