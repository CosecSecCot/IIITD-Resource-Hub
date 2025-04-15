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

// Define the question schema.
const questionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  question: z.string().min(1, "Please enter your question details"),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  userID: number;
  // Accept optional initial data for edit mode.
  initialData?: Partial<QuestionFormData>;
}

export function QuestionForm({ userID, initialData }: QuestionFormProps) {
  // Set up default values ensuring they are never undefined.
  const defaultValues: QuestionFormData = {
    title: initialData?.title ?? "",
    question: initialData?.question ?? "",
  };

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  const onSubmit = async (data: QuestionFormData) => {
    if (initialData) {
      console.log("Updated question:", { userID, ...data });
    } else {
      console.log("Submitted question:", { userID, ...data });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a brief title for your question"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your question in detail..."
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{initialData ? "Update" : "Submit"}</Button>
      </form>
    </Form>
  );
}
