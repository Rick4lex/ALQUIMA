import type { ImagePlaceholder } from "./placeholder-images";

/**
 * Extracts a numeric value from price strings like "12.000 und" -> 12000
 */
export function parsePrice(priceStr?: string): number | null {
  if (!priceStr) return null;
  const digitsOnly = priceStr.replace(/[^0-9]/g, "");
  if (!digitsOnly) return null;
  const num = parseInt(digitsOnly, 10);
  return isNaN(num) ? null : num;
}

/**
 * Normalizes strings by lowercasing and removing accents/diacritics for accurate searching
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Formats numeric price back to Colombian Pesos style: 12000 -> "$12.000"
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("es-CO")}`;
}

export type SortOption =
  | "default"
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "available-first";

export type PriceRangePreset = "all" | "under-10k" | "10k-20k" | "over-20k" | "custom";

export interface FilterOptions {
  searchQuery?: string;
  selectedSeries?: string;
  priceRange?: PriceRangePreset;
  customMinPrice?: number | null;
  customMaxPrice?: number | null;
  showOnlyAvailable?: boolean;
  sortBy?: SortOption;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  series: string;
  onlyAvailable: boolean;
  priceRange: PriceRangePreset;
  sortBy: SortOption;
  customMinPrice?: number;
  customMaxPrice?: number;
}

export function getSeriesList(artifact: ImagePlaceholder): string[] {
  if (!artifact.imageHint) return [];
  if (Array.isArray(artifact.imageHint)) {
    return artifact.imageHint.filter(Boolean);
  }
  return [artifact.imageHint];
}

export const matchesSearchQuery = matchesQuery;

/**
 * Checks if an artifact matches a search query against title, hints/franchise, description, and details
 */
export function matchesQuery(artifact: ImagePlaceholder, query: string): boolean {
  if (!query || !query.trim()) return true;
  const q = normalizeText(query.trim());

  const title = normalizeText(artifact.title || "");
  const details = normalizeText(artifact.details || "");
  const description = normalizeText(artifact.description || "");
  const category = normalizeText(artifact.category || "");

  let hints = "";
  if (Array.isArray(artifact.imageHint)) {
    hints = normalizeText(artifact.imageHint.join(" "));
  } else if (artifact.imageHint) {
    hints = normalizeText(artifact.imageHint);
  }

  // Check if any word in query matches
  const words = q.split(/\s+/).filter(Boolean);
  return words.every(
    (w) =>
      title.includes(w) ||
      hints.includes(w) ||
      category.includes(w) ||
      details.includes(w) ||
      description.includes(w)
  );
}

/**
 * Applies all filters and sorting to the artifacts list
 */
export function filterAndSortArtifacts(
  artifacts: ImagePlaceholder[],
  filters: FilterOptions
): ImagePlaceholder[] {
  let result = artifacts.filter((artifact) => Boolean(artifact.category));

  // 1. Text search
  if (filters.searchQuery && filters.searchQuery.trim()) {
    result = result.filter((a) => matchesQuery(a, filters.searchQuery!));
  }

  // 2. Availability filter
  if (filters.showOnlyAvailable) {
    result = result.filter((a) => a.available === true);
  }

  // 3. Series / anime filter
  if (filters.selectedSeries && filters.selectedSeries !== "all") {
    result = result.filter((artifact) => {
      if (Array.isArray(artifact.imageHint)) {
        return artifact.imageHint.includes(filters.selectedSeries!);
      }
      return artifact.imageHint === filters.selectedSeries;
    });
  }

  // 4. Price range filter
  if (filters.priceRange && filters.priceRange !== "all") {
    result = result.filter((artifact) => {
      const price = parsePrice(artifact.price);
      if (price === null) return false;

      switch (filters.priceRange) {
        case "under-10k":
          return price <= 10000;
        case "10k-20k":
          return price >= 10000 && price <= 20000;
        case "over-20k":
          return price > 20000;
        case "custom": {
          const min = filters.customMinPrice ?? 0;
          const max = filters.customMaxPrice ?? Infinity;
          return price >= min && price <= max;
        }
        default:
          return true;
      }
    });
  }

  // 5. Sorting
  const sorted = [...result];
  switch (filters.sortBy) {
    case "price-asc":
      sorted.sort((a, b) => {
        const pA = parsePrice(a.price) ?? Number.MAX_SAFE_INTEGER;
        const pB = parsePrice(b.price) ?? Number.MAX_SAFE_INTEGER;
        return pA - pB;
      });
      break;
    case "price-desc":
      sorted.sort((a, b) => {
        const pA = parsePrice(a.price) ?? -1;
        const pB = parsePrice(b.price) ?? -1;
        return pB - pA;
      });
      break;
    case "name-asc":
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || "", "es"));
      break;
    case "name-desc":
      sorted.sort((a, b) => (b.title || "").localeCompare(a.title || "", "es"));
      break;
    case "default":
    default:
      // Keep original order
      break;
  }

  return sorted;
}
