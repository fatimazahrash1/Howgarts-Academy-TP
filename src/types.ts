export type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

export const HOUSES: readonly House[] = [
  "Gryffindor",
  "Slytherin",
  "Ravenclaw",
  "Hufflepuff",
];

export interface Wizard {
  id: number;
  name: string;
  house: House;
  year: number;
}

export interface Spell {
  id: number;
  name: string;
  power: number;
}
// Ex 1 : l'appelant ne fournit pas l'id
export type NewWizard = Omit<Wizard, "id">;
export type NewSpell = Omit<Spell, "id">;
export type AcademyEvent =
  | { type: "spell-cast"; wizardId: number; spellId: number; success: boolean }
  | { type: "enrolled"; wizardId: number }
  | { type: "house-points"; house: House; points: number };

// Ex 3 : on extrait uniquement l'événement de lancement de sort
export type SpellCastEvent = Extract<AcademyEvent, { type: "spell-cast" }>;