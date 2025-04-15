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

// Define the blog schema.
const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

// Infer the TypeScript type.
type BlogFormData = z.infer<typeof blogSchema>;

// Accept an optional initialData prop.
interface PostBlogFormProps {
  userID: number;
  initialData?: Partial<BlogFormData>;
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

  const onSubmit = async (values: BlogFormData) => {
    // Branch logic based on whether we're updating or creating.
    if (initialData) {
      console.log("Updated blog:", { userID, ...values });
    } else {
      console.log("Submitted blog:", { userID, ...values });
    }
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
