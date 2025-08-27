"use server";
import { db } from "@/db";
import { z } from "zod";

const topicSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name 3tadan koproq xarf bolishi kerak",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Name faqat harflar, raqamlar va underscore dan iborat bolishi kerak",
    }),
  description: z.string().min(10, {
    message: "Description 10dan ortiq bolishi kerak",
  }),
});

export async function createTopic(prevState: any, formData: FormData) {
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const result = topicSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    // Check if topic already exists
    const existingTopic = await db.topic.findUnique({
      where: { slug: result.data.name.toLowerCase() },
    });

    if (existingTopic) {
      return { error: { name: ['This community name already exists'] } };
    }

    const response = await db.topic.create({
      data: {
        slug: result.data.name.toLowerCase(),
        description: result.data.description,
      },
    });

    return { success: true, topic: response };
  } catch (error) {
    console.error('Error creating topic:', error);
    return { error: { _form: ['Failed to create community'] } };
  }
}