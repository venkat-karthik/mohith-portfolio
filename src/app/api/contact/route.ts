import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    const contact = await prisma.contact.findFirst();
    return NextResponse.json(contact || {});
  } catch (error) {
    logger.error("Failed to fetch contact", {}, error);
    return NextResponse.json({ error: "Failed to fetch contact info" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = contactSchema.safeParse(bodyResult.data);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;
    const existing = await prisma.contact.findFirst();
    
    let updated;
    if (existing) {
      updated = await prisma.contact.update({ where: { id: existing.id }, data });
    } else {
      updated = await prisma.contact.create({ data });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    logger.error("Failed to update contact", {}, error);
    return serverErrorResponse("Failed to update contact info");
  }
}
