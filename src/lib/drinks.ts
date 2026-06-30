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
