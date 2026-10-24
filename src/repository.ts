import { NewSpell, NewWizard, Spell, Wizard } from "./types";
import { ValidateSpellPower } from "./decorators";
export class Repository<T extends { id: number }> {
  protected items: T[] = [];
  protected nextId = 1;

  add(item: Omit<T, "id">): T {
    const created = { ...item, id: this.nextId++ } as unknown as T;
    this.items.push(created);
    return created;
  }

  getAll(): readonly T[] {
    return this.items;
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }
}

export class WizardRepository extends Repository<Wizard> {
  // Ex 1 : enregistre un sorcier et lui attribue un id
  register(newWizard: NewWizard): Wizard {
    return this.add(newWizard);
  }

  // Ex 2 : filtrer par maison (Wizard["house"] = type à accès indexé)
  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.items.filter((wizard) => wizard.house === house);
  }
}

export class SpellRepository extends Repository<Spell> {
  // Ex 4 : validation de la puissance via décorateur
  @ValidateSpellPower
  add(spell: NewSpell): Spell {
    return super.add(spell);
  }
}