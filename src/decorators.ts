// Ex 4 : refuse un sort dont la puissance est négative
export function ValidateSpellPower(
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;

  descriptor.value = function (
    this: unknown,
    spell: { power: number },
    ...rest: unknown[]
  ) {
    if (spell.power < 0) {
      throw new Error(`Spell power must be >= 0 (received ${spell.power})`);
    }
    return original.call(this, spell, ...rest);
  };

  return descriptor;
}

// Ex 5 : cache par instance, la clé = arguments sérialisés
export function Memoize(
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;
  const caches = new WeakMap<object, Map<string, unknown>>();

  descriptor.value = function (this: object, ...args: unknown[]) {
    let cache = caches.get(this);
    if (!cache) {
      cache = new Map<string, unknown>();
      caches.set(this, cache);
    }

    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`[cache hit] ${propertyKey}(${args.join(", ")})`);
      return cache.get(key);
    }

    const result = original.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}