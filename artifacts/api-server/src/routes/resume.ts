import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, resumesTable } from "@workspace/db";
import { LookupResumeQueryParams, SaveResumeBody } from "@workspace/api-zod";

const router = Router();

router.get("/resume/lookup", async (req, res) => {
  const parsed = LookupResumeQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "email is required" });
    return;
  }

  const { email } = parsed.data;

  const rows = await db
    .select()
    .from(resumesTable)
    .where(eq(resumesTable.email, email.toLowerCase()))
    .limit(1);

  if (rows.length === 0) {
    res.json({ resume: null });
    return;
  }

  const row = rows[0];
  res.json({
    resume: {
      id: row.id,
      email: row.email,
      data: row.data,
      updatedAt: row.updatedAt.toISOString(),
    },
  });
});

router.post("/resume", async (req, res) => {
  const parsed = SaveResumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { email, data } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const rows = await db
    .insert(resumesTable)
    .values({
      email: normalizedEmail,
      data,
    })
    .onConflictDoUpdate({
      target: resumesTable.email,
      set: {
        data,
        updatedAt: new Date(),
      },
    })
    .returning();

  const row = rows[0];
  res.json({
    id: row.id,
    email: row.email,
    data: row.data,
    updatedAt: row.updatedAt.toISOString(),
  });
});

export default router;
