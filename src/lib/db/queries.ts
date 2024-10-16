"use server";

import { cookies } from "next/headers";
import { verifyToken } from "../auth/session";
import prisma from "./prisma";

export async function getUser() {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'string'
  ) {
    return null;
  }
  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }
  const user = await prisma.users.findFirst({
    where: {
      AND: [
        {
          id: sessionData.user.id
        },
        {
          deletedAt: null
        }
      ]
    }
  });
  if (user === null || user === undefined) {
    return null;
  }

  return user;
}


export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await prisma.activeLogs.findMany({
    where: {
      userId: user.id
    }
  });
}