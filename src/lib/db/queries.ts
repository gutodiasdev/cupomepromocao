"use server";

import { cookies } from "next/headers";
import { verifyToken } from "../auth/session";
import prisma from "./prisma";
import { z } from "zod";
import { addOfferSchema } from "@/components/AddOfferDialog";
import dayjs from "dayjs";

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

export async function addOffer(input: z.infer<typeof addOfferSchema>) {
  const expiresAtISOString = dayjs(input.expiresAt).toISOString();
  try {
    await prisma.offers.create({
      data: {
        title: input.title,
        thumbnail: input.thumbnail,
        price: input.price,
        oldPrice: input.oldPrice,
        affiliateLink: input.affiliateLink,
        expiresAt: expiresAtISOString,
        offeredBy: input.offeredBy,
      }
    });
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getOffers() {
  try {
    const offers = await prisma.offers.findMany();
    return offers;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function singleOffer(id: number) {
  try {
    const offer = await prisma.offers.findUnique({ where: { id } });
    return offer;
  } catch (error: any) {
    throw new Error(error);
  }
}