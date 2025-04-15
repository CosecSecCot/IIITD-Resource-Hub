"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the blog schema.
const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

// Infer the TypeScript type.
type BlogFormData = z.infer<typeof blogSchema>;

// Extend the type to include an optional blogID for editing.
interface BlogData extends BlogFormData {
  blogID?: number;
}

// Accept an optional initialData prop.
interface PostBlogFormProps {
  userID: number;
  initialData?: BlogData;
}

export default function PostBlogForm({
  userID,
  initialData,
}: PostBlogFormProps) {
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (values: BlogFormData) => {
    if (initialData && initialData.blogID) {
      // If editing an existing blog, call the update endpoint.
      const res = await fetch(`/api/blogs/${initialData.blogID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, ...values }),
      });
      if (res.ok) {
        console.log("Blog updated successfully:", { userID, ...values });
        toast("Blog updated successfully!");
      } else {
        console.error("Error updating blog");
        toast("Uh oh! Something went wrong.", {
          description: "There was a problem updating the blog!",
        });
      }
    } else {
      // If creating a new blog, call the create endpoint.
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, ...values }),
      });
      if (res.ok) {
        console.log("Blog created successfully:", { userID, ...values });
        toast("Blog created successfully!");
      } else {
        console.error("Error creating blog");
        toast("Uh oh! Something went wrong.", {
          description: "There was a problem creating the blog!",
        });
      }
    }
    router.push(`/users/${userID}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="mt-10 space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a catchy blog title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog content here..."
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4">
          {initialData ? "Update" : "Publish"}
        </Button>
      </form>
    </Form>
  );
}
