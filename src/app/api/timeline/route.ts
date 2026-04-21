import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { timelineItemSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    const items = await prisma.timelineItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    logger.error("Failed to fetch timeline", {}, error);
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = timelineItemSchema.safeParse(bodyResult.data);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;
    const newItem = await prisma.timelineItem.create({ data });
    return NextResponse.json(newItem);
  } catch (error) {
    logger.error("Failed to create timeline item", {}, error);
    return serverErrorResponse("Failed to create timeline item");
  }
}
