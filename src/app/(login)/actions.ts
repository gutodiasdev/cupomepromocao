"use server";

import { validatedAction } from "@/lib/auth/middleware";
import { comparePasswords, hashPassword, setSession } from "@/lib/auth/session";
import { generateNanoId } from "@/lib/db/generateNanoId";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signInSchema } from "./login";
import { ActivityType } from "@/lib/utils";
import { updateAccountSchema } from "../(dashboard)/dashboard/general/page";
import { getUser } from "@/lib/db/queries";

async function logActivity(
  userId: string,
  type: ActivityType,
  ipAddress?: string
) {
  if (userId === null || userId === undefined) {
    return;
  }
  // TODO: stabilsh more consistent type for new activity log
  const newActivity: any = {
    userId,
    action: type,
    ipAddress: ipAddress || '',
  };
  await prisma.activeLogs.create({
    data: {
      id: generateNanoId(),
      action: newActivity.action,
      userId: newActivity.userId,
      ipAddress: newActivity.ipAddress,
    }
  });
}

export const signIn = validatedAction(signInSchema, async (data) => {
  const { email, password } = data;

  const user = await prisma.users.findUnique({ where: { email: email } });

  if (!user) {
    return { error: 'Invalid email or password. Please try again.' };
  }

  const isPasswordValid = await comparePasswords(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    return { error: 'Invalid email or password. Please try again.' };
  }

  await Promise.all([
    setSession(user),
    logActivity(user.id, ActivityType.SIGN_IN),
  ]);

  redirect('/dashboard');
});

export const signInOnPage = async (data: z.infer<typeof signInSchema>) => {
  const { email, password } = data;

  const user = await prisma.users.findUnique({ where: { email: email } });

  if (!user) {
    return { error: 'Invalid email or password. Please try again.' };
  }

  const isPasswordValid = await comparePasswords(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    return { error: 'Invalid email or password. Please try again.' };
  }

  await Promise.all([
    setSession(user),
    logActivity(user.id, ActivityType.SIGN_IN),
  ]);
};

const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional(),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { name, email, password, inviteId } = data;

  const existingUser = await prisma.users.findUnique({ where: { email } });

  if (existingUser) {
    return { error: 'Failed to create user. Please try again.' };
  }

  const passwordHash = await hashPassword(password);

  // TODO: Adjust types
  const newUser: any = {
    email,
    passwordHash,
    role: 'owner',
  };

  const createdUser = await prisma.users.create({
    data: {
      id: generateNanoId(),
      name: name,
      email: newUser.email,
      passwordHash,
      role: newUser.role
    }
  });

  if (!createdUser) {
    return { error: 'Failed to create user. Please try again.' };
  }

  await Promise.all([
    logActivity(createdUser.id, ActivityType.SIGN_UP),
    setSession(createdUser),
  ]);

  redirect('/dashboard');
});

export const updateAccountOnPage = async (input: z.infer<typeof updateAccountSchema>) => {
  const { email, name } = input;
  const user = await getUser();
  if (!user) throw new Error("User is not authenticated");
  await Promise.all([
    prisma.users.update({
      where: { id: user.id },
      data: {
        email: email,
        name: name
      }
    }),
    logActivity(user.id, ActivityType.UPDATE_ACCOUNT)
  ]);
  return { success: true };
};