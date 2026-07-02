import { timingSafeEqual } from "crypto";

export function checkRegistrationToken(provided: string | undefined): boolean {
  const expected = process.env.ADMIN_REGISTRATION_TOKEN;
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
