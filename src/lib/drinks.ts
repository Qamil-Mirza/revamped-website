import { readJson, writeJson } from "@/lib/blob-store";
import { randomUUID } from "crypto";

export type Drink = {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  note: string;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: string; // ISO
};

export type DrinkInput = { date: string; name: string; note: string };

export type ValidationResult =
  | { ok: true; value: DrinkInput }
  | { ok: false; errors: string[] };

export const OWNER_TZ = "America/Los_Angeles";

export function todayInOwnerTz(now: Date = new Date()): string {
  // en-CA gives YYYY-MM-DD formatting.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: OWNER_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateDrinkInput(raw: {
  date?: string;
  name?: string;
  note?: string;
}): ValidationResult {
  const errors: string[] = [];
  const date = (raw.date ?? "").trim();
  const name = (raw.name ?? "").trim();
  const note = (raw.note ?? "").trim();

  // Date.parse on a YYYY-MM-DD string interprets it as UTC midnight; we only use it to reject invalid calendar dates (NaN).
  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(date))) {
    errors.push("date must be a valid YYYY-MM-DD");
  }
  if (name.length < 1 || name.length > 80) {
    errors.push("name must be 1–80 characters");
  }
  if (note.length < 1 || note.length > 140) {
    errors.push("note must be 1–140 characters");
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: { date, name, note } };
}

export function sortDrinks(drinks: Drink[]): Drink[] {
  return [...drinks].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.createdAt < b.createdAt ? 1 : -1;
  });
}

export function selectFeatured(
  drinks: Drink[],
  today: string,
): { ordered: Drink[]; featuredIndex: number } {
  const ordered = sortDrinks(drinks);
  if (ordered.length === 0) return { ordered, featuredIndex: -1 };
  const todayIndex = ordered.findIndex((d) => d.date === today);
  return { ordered, featuredIndex: todayIndex >= 0 ? todayIndex : 0 };
}

export const DRINKS_KEY = "drinks/index.json";

export async function getDrinks(): Promise<Drink[]> {
  const drinks = await readJson<Drink[]>(DRINKS_KEY, []);
  return sortDrinks(drinks);
}

export async function addDrink(
  input: DrinkInput & { imageUrl: string; width: number; height: number },
): Promise<Drink> {
  const drinks = await readJson<Drink[]>(DRINKS_KEY, []);
  const drink: Drink = {
    id: randomUUID(),
    date: input.date,
    name: input.name,
    note: input.note,
    imageUrl: input.imageUrl,
    width: input.width,
    height: input.height,
    createdAt: new Date().toISOString(),
  };
  await writeJson(DRINKS_KEY, [...drinks, drink]);
  return drink;
}

export async function deleteDrink(id: string): Promise<Drink | null> {
  const drinks = await readJson<Drink[]>(DRINKS_KEY, []);
  const removed = drinks.find((d) => d.id === id) ?? null;
  if (!removed) return null;
  await writeJson(
    DRINKS_KEY,
    drinks.filter((d) => d.id !== id),
  );
  return removed;
}
