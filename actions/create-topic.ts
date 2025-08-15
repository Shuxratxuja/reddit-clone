"use server";
import { db } from "@/db";
import { z } from "zod";

const topicSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Name 5tadan koproq xarf bolishi kerak",
    })
    .regex(/^[a-zA-Z]+$/, {
      message: "Name faqat xarflardan iborat bolishi kerak",
    }),
  description: z.string().min(10, {
    message: "Descrioption 10dan ortiq bolishi kerak",
  }),
});

interface FormStateType {
  error: {
    name?: string[];
    description?: string[];
  };
}

export async function createTopic(
  formState: FormStateType,
  formData: FormData
): Promise<FormStateType> {
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const result = topicSchema.safeParse(data);

  if (!result.success) {
    const error = result.error?.flatten().fieldErrors;

    return { error };
  }

  const response = await db.topic.create({
    data: {
      slug: result.data.name,
      description: result.data.description,
    },
  });

  console.log(response);

  return { error: {} };
  // revalidate
}
