/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const convertToPlainObj = <T>(value: T) =>
  JSON.parse(JSON.stringify(value));

export const formatNumWithDecimal = (num: number) => {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
};

export const formatErr = (err: any): string => {
  if (err.name === "ZodError") {
    return err.errors[0].message as string;
  } else if (err.name === "PrismaClientKnownRequestError") {
    const field = err.meta?.target ? (err.meta?.target[0] as string) : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return err.message;
  }
};

export const round2 = (value: string | number) => {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
};

export const formatId = (id: string) => {
  return `...${id.substring(id.length - 6)}`;
};
export const formatDateTime = (dateString: Date) => {
  const dateTimeOption: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const dateOption: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  };
  const timeOption: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-us",
    dateTimeOption
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-us",
    dateOption
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-us",
    timeOption
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};
