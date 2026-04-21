import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import prisma from "@/lib/prisma";
import { timelineItemSchema } from "@/lib/validations";
import {
  invalidResourceIdResponse,
  notFoundResponse,
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
  validateResourceId,
} from "@/lib/api-security";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const partialValidation = timelineItemSchema.partial().safeParse(bodyResult.data);
    if (!partialValidation.success) {
      return validationErrorResponse(partialValidation.error);
    }

    const existing = await prisma.timelineItem.findUnique({
      where: { id: idResult.data },
    });
    if (!existing) return notFoundResponse("Timeline item");

    const dataValidation = timelineItemSchema.safeParse({
      ...existing,
      ...partialValidation.data,
    });
    if (!dataValidation.success) {
      return validationErrorResponse(dataValidation.error);
    }

    const updated = await prisma.timelineItem.update({
      where: { id: idResult.data },
      data: dataValidation.data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    logger.error("Failed to update timeline item", {}, error);
    return serverErrorResponse("Failed to update timeline item");
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req);
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    const deleted = await prisma.timelineItem.deleteMany({
      where: { id: idResult.data },
    });
    if (!deleted.count) return notFoundResponse("Timeline item");

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete timeline item", {}, error);
    return serverErrorResponse("Failed to delete timeline item");
  }
}
