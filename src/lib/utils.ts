import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}

export const moneyFormatter = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const chooseStore = (store: string): string => {
  switch (store) {
    case "mercado_livre":
      return "Mercado Livre";
    default:
      return "Cupom e Promoção";
  }
}

export function timeFromNow(date: string | Date): string {
  const now = dayjs();
  const targetDate = dayjs(date);

  const diffInMinutes = now.diff(targetDate, 'minute');
  const diffInHours = now.diff(targetDate, 'hour');

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutos atrás`;
  } else if (diffInHours === 1) {
    return `1 hora atrás`;
  } else {
    return `${diffInHours} horas atrás`;
  }
}