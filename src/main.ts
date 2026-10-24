import {
  AcademyEvent,
  HOUSES,
  House,
  NewWizard,
  SpellCastEvent,
  Wizard,
} from "./types";
import { SpellRepository, WizardRepository } from "./repository";
import { Memoize } from "./decorators";

const wizards = new WizardRepository();
const spells = new SpellRepository();

// ---------- Ex 1 : ajouter un sorcier ----------
console.log("=== Ex 1 : register wizard ===");
const harryData: NewWizard = { name: "Harry Potter", house: "Gryffindor", year: 5 };
const harry = wizards.register(harryData);
console.log(harry);

wizards.register({ name: "Hermione Granger", house: "Gryffindor", year: 5 });
wizards.register({ name: "Draco Malfoy", house: "Slytherin", year: 5 });
wizards.register({ name: "Luna Lovegood", house: "Ravenclaw", year: 4 });
wizards.register({ name: "Cedric Diggory", house: "Hufflepuff", year: 6 });

// ---------- Ex 2 : filtrer par maison ----------
console.log("\n=== Ex 2 : findByHouse ===");
console.log("Gryffindor:", wizards.findByHouse("Gryffindor").map((w) => w.name));
console.log("Slytherin :", wizards.findByHouse("Slytherin").map((w) => w.name));
// wizards.findByHouse("Durmstrang"); // erreur de compilation (décommente pour tester)

// ---------- Ex 3 : Extract pour les événements de sort ----------
console.log("\n=== Ex 3 : spell-cast handler ===");
function handleSpellCast(event: SpellCastEvent): void {
  const status = event.success ? "réussi" : "échoué";
  console.log(`Wizard #${event.wizardId} a lancé le sort #${event.spellId} : ${status}`);
}

function eventHandler(event: AcademyEvent): void {
  if (event.type === "spell-cast") {
    handleSpellCast(event);
  } else {
    console.log(`Événement ignoré : ${event.type}`);
  }
}

eventHandler({ type: "spell-cast", wizardId: 1, spellId: 1, success: true });
eventHandler({ type: "enrolled", wizardId: 2 });

// ---------- Ex 4 : décorateur ValidateSpellPower ----------
console.log("\n=== Ex 4 : ValidateSpellPower ===");
console.log(spells.add({ name: "Expelliarmus", power: 50 }));
try {
  spells.add({ name: "Broken Spell", power: -10 });
} catch (error) {
  console.log("Refusé :", (error as Error).message);
}

// ---------- Ex 5 : décorateur Memoize ----------
console.log("\n=== Ex 5 : Memoize ===");
class SpellCalculator {
  @Memoize
  computeDamage(basePower: number, multiplier: number): number {
    console.log(`[calcul] computeDamage(${basePower}, ${multiplier})`);
    return basePower * multiplier;
  }
}

const calcA = new SpellCalculator();
const calcB = new SpellCalculator();

console.log(calcA.computeDamage(10, 3)); // calcul
console.log(calcA.computeDamage(10, 3)); // cache hit
console.log(calcA.computeDamage(5, 2));  // calcul
console.log(calcB.computeDamage(10, 3)); // calcul (cache séparé par instance)

// ---------- Ex 6 : Type Guards ----------
console.log("\n=== Ex 6 : Type Guards ===");
function isHouse(value: unknown): value is House {
  return typeof value === "string" && (HOUSES as readonly string[]).includes(value);
}

function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "number" &&
    typeof v.name === "string" &&
    isHouse(v.house) &&
    typeof v.year === "number"
  );
}

const validCase: unknown = { id: 99, name: "Neville Longbottom", house: "Gryffindor", year: 5 };
const invalidHouse: unknown = { id: 100, name: "Viktor Krum", house: "Durmstrang", year: 6 };
const notAnObject: unknown = "Hogwarts";

console.log("valid      :", isWizard(validCase));    // true
console.log("Durmstrang :", isWizard(invalidHouse)); // false
console.log("string     :", isWizard(notAnObject));  // false

if (isWizard(validCase)) {
  console.log(`Bienvenue ${validCase.name} de ${validCase.house}`);
}