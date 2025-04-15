"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["Note", "PYQ", "Tutorial", "Miscellaneous"]),
  subject: z.string().min(1, "Subject is required"),
  year: z.coerce
    .number({
      required_error: "Year is required",
      invalid_type_error: "Year must be a number",
    })
    .min(2008, "Year must be at least 2008")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  semester: z.coerce
    .number({
      required_error: "Semester is required",
      invalid_type_error: "Semester must be a number",
    })
    .min(1, "Semester cannot be less than 1")
    .max(8, "Semester cannot be greater than 8"),
  resourceFiles: z
    .array(
      z
        .string()
        .url({ message: "Must be a valid URL" })
        .refine((url) => url.includes("drive.google.com"), {
          message: "Must be a Google Drive link",
        }),
    )
    .min(1, "At least one Google Drive link is required"),
});

export type ResourceFormData = z.infer<typeof resourceSchema>;

interface UploadResourceFormProps {
  userID: number;
  initialData?: Partial<Omit<ResourceFormData, "resourceFiles">> & {
    resourceFiles?: string[];
  };
}

export default function UploadResourceForm({
  userID,
  initialData,
}: UploadResourceFormProps) {
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

  // useFieldArray to handle dynamic array of resourceFiles.
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resourceFiles" as never,
  });

  const onSubmit = (values: ResourceFormData) => {
    if (initialData) {
      console.log("Updated resource:", { userID, ...values });
    } else {
      console.log("Submitted resource:", { userID, ...values });
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <Input placeholder="Enter subject name" {...field} />
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

        {/* Resource Files: Dynamic array of Google Drive links */}
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
