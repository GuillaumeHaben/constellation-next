/**
 * Create a URL-safe slug from a string by:
 * - Normalizing accents (é → e, ñ → n, etc.)
 * - Converting to lowercase
 * - Replacing spaces and special chars with hyphens
 * - Removing consecutive hyphens
 */
export function createSlug(text) {
  if (!text) return '';
  
  return text
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Create a slug from first and last name
 */
export function createUserSlug(firstName, lastName) {
  const first = createSlug(firstName);
  const last = createSlug(lastName);
  return first && last ? `${first}-${last}` : first || last;
}
