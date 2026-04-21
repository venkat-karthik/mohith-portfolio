import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { achievementSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { order: "asc" }
    });
    return NextResponse.json(achievements);
  } catch (error) {
    logger.error("Failed to fetch achievements", {}, error);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = achievementSchema.safeParse(bodyResult.data);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;
    const newItem = await prisma.achievement.create({ data });
    return NextResponse.json(newItem);
  } catch (error) {
    logger.error("Failed to create achievement", {}, error);
    return serverErrorResponse("Failed to create achievement");
  }
}
