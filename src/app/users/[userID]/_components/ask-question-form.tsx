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

const questionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  question: z.string().min(1, "Please enter your question details"),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export interface QuestionData extends QuestionFormData {
  questionID?: number;
}

interface QuestionFormProps {
  userID: number;
  initialData?: QuestionData;
}

export function QuestionForm({ userID, initialData }: QuestionFormProps) {
  const router = useRouter();
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      question: initialData?.question ?? "",
    },
  });

  const onSubmit = async (values: QuestionFormData) => {
    if (initialData?.questionID) {
      const res = await fetch(`/api/questions/${initialData.questionID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, ...values }),
      });
      if (res.ok) {
        toast("Question updated successfully!");
      } else {
        toast("Uh oh! Something went wrong.", {
          description: "There was a problem updating the question.",
        });
      }
    } else {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, ...values }),
      });
      if (res.ok) {
        toast("Question created successfully!");
      } else {
        toast("Uh oh! Something went wrong.", {
          description: "There was a problem creating the question.",
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
        className="space-y-6"
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
