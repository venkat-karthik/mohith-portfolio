import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { blogSchema } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const blogs = await prisma.blog.findMany({
      where: session ? undefined : { isPublished: true },
      orderBy: session ? { date: "desc" } : { order: "asc" }
    });
    return NextResponse.json(blogs);
  } catch (error) {
    logger.error("Failed to fetch blogs", {}, error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = blogSchema.safeParse(bodyResult.data);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;
    const newBlog = await prisma.blog.create({ data });
    return NextResponse.json(newBlog);
  } catch (error) {
    logger.error("Failed to create blog", {}, error);
    return serverErrorResponse("Failed to create blog");
  }
}
