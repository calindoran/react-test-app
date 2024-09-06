import { Result } from "src/types/Result";
/**
 * Retrieves suggestions based on a search term.
 * @param searchTerm - The term to search for.
 * @returns An array of suggestions.
 */
export default async function getSuggestions(searchTerm: string | undefined) {
  if (!searchTerm) return [];
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${searchTerm}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch suggestions");
    }
    const data: Result[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
