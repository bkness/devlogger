"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/db";

export async function createLog(title: string, content: string) {
  await prisma.log.create({ data: { title, content } });
  updateTag("logs");
}

export async function updateLog(id: number, title: string, content: string) {
  await prisma.log.update({ where: { id }, data: { title, content } });
  updateTag("logs");
}

export async function deleteLog(id: number) {
  await prisma.log.delete({ where: { id } });
  updateTag("logs");
}
