import type { NewItem } from "./types";

// The API's rules, checked before calling it: the person sees what to fix next to the field.

export interface ItemFormErrors {
  name?: string;
  description?: string;
}

export function validateNewItem(
  name: string,
  description: string,
): { value?: NewItem; errors: ItemFormErrors } {
  const errors: ItemFormErrors = {};
  const cleanName = name.trim();
  const cleanDescription = description.trim();
  if (!cleanName) errors.name = "Informe o nome.";
  else if (cleanName.length > 80) errors.name = "Use no máximo 80 caracteres.";
  if (cleanDescription.length > 300) errors.description = "Use no máximo 300 caracteres.";
  return errors.name || errors.description
    ? { errors }
    : { value: { name: cleanName, description: cleanDescription }, errors };
}
