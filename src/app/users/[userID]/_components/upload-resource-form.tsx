"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define schema
const resourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["Note", "PYQ", "Tutorial", "Assignment", "Miscellaneous"]),
  subject: z.string().min(1),
  year: z.number().min(2008).max(new Date().getFullYear()),
  semester: z.number().min(1).max(8),
  resourceFiles: z.array(z.string().url()),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

interface UploadResourceFormProps {
  userID: number;
  initialData?: ResourceFormData & { resourceID: number };
}

export default function UploadResourceForm({
  userID,
  initialData,
}: UploadResourceFormProps) {
  const router = useRouter();

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || "Miscellaneous",
      subject: initialData?.subject || "",
      year: initialData?.year || new Date().getFullYear(),
      semester: initialData?.semester || 1,
      resourceFiles: initialData?.resourceFiles || [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resourceFiles" as never,
  });

  const onSubmit = async (values: ResourceFormData) => {
    const endpoint = initialData?.resourceID
      ? `/api/resources/${initialData.resourceID}`
      : "/api/resources";
    const method = initialData?.resourceID ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, ...values }),
    });

    if (res.ok) {
      toast(
        `Resource ${method === "POST" ? "created" : "updated"} successfully!`,
      );
      router.push(`/users/${userID}`);
    } else {
      toast("Uh oh! Something went wrong.", {
        description: "There was a problem updating the blog!",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter resource title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Note">Note</SelectItem>
                    <SelectItem value="PYQ">PYQ</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Enter subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Semester" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>Google Drive Links</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`resourceFiles.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Enter Google Drive link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="destructive"
                type="button"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => append("")}>
            Add Link
          </Button>
        </div>

        <Button type="submit">
          {initialData ? "Update Resource" : "Create Resource"}
        </Button>
      </form>
    </Form>
  );
}
