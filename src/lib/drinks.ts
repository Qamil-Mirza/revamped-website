export * from "@/lib/drinks-logic";

import { readJson, writeJson } from "@/lib/blob-store";
import { randomUUID } from "crypto";
import { sortDrinks, type Drink, type DrinkInput } from "@/lib/drinks-logic";

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
