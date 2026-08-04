// Smart Fuzzy Search Utility with Location and Typo Tolerance Support

function normalizeText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // replace punctuation with space
    .replace(/\s+/g, ' ')
    .trim();
}

// Strip Bengali location/possessive suffixes e.g. "uttarar" -> "uttara", "mirpurer" -> "mirpur"
function stripLocationSuffixes(word: string): string[] {
  if (!word) return [];
  const results = [word];

  if (word.length > 4) {
    if (word.endsWith('rer') && word.length > 5) results.push(word.slice(0, -3));
    if (word.endsWith('er') && word.length > 4) results.push(word.slice(0, -2));
    if (word.endsWith('ar') && word.length > 4) results.push(word.slice(0, -2));
    if (word.endsWith('ir') && word.length > 4) results.push(word.slice(0, -2));
    if (word.endsWith('r') && word.length > 4) results.push(word.slice(0, -1));
    if (word.endsWith('te') && word.length > 4) results.push(word.slice(0, -2));
  }

  return Array.from(new Set(results));
}

// Collapse consecutive duplicate letters (e.g., "chillox" -> "chilox", "kacchi" -> "kachi")
function collapseDuplicates(str: string): string {
  if (!str) return '';
  return str.replace(/(.)\1+/g, '$1');
}

// Calculate Levenshtein distance between two strings
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Checks if a single query token (or its stemmed variants) fuzzy matches target text
 */
function isTokenFuzzyMatch(rawToken: string, targetText: string): boolean {
  if (!rawToken || !targetText) return false;

  const normTarget = normalizeText(targetText);
  if (!normTarget) return false;

  // Variants of token including location-stripped forms (e.g., "uttarar" -> ["uttarar", "uttara"])
  const tokenVariants = stripLocationSuffixes(rawToken);

  for (const qToken of tokenVariants) {
    if (!qToken) continue;

    // Direct substring match
    if (normTarget.includes(qToken)) return true;

    // Collapsed duplicate match (e.g. "chilox" vs "chillox")
    const qCol = collapseDuplicates(qToken);
    const targetCol = collapseDuplicates(normTarget);
    if (targetCol.includes(qCol)) return true;

    // Target word-by-word fuzzy comparison
    const targetWords = normTarget.split(/\s+/).filter(Boolean);

    const wordMatched = targetWords.some((tWord) => {
      // Exact or substring match on word
      if (tWord.includes(qToken) || qToken.includes(tWord)) return true;

      const tCol = collapseDuplicates(tWord);
      if (tCol.includes(qCol) || qCol.includes(tCol)) return true;

      // Levenshtein distance check based on token length
      const minLen = Math.min(qToken.length, tWord.length);
      const maxDist = minLen <= 3 ? 0 : minLen <= 6 ? 1 : 2;

      const dist = levenshteinDistance(qToken, tWord);
      if (dist <= maxDist) return true;

      const distCol = levenshteinDistance(qCol, tCol);
      if (distCol <= maxDist) return true;

      return false;
    });

    if (wordMatched) return true;
  }

  return false;
}

/**
 * Smart fuzzy search function for any multi-word query across target text fields
 */
export function isFuzzySearchMatch(query: string, fields: (string | string[] | undefined)[]): boolean {
  if (!query || !query.trim()) return false;

  const normQuery = normalizeText(query);
  if (!normQuery) return false;

  // Combine all target field values into a single string array or text
  const targetFieldsText: string[] = [];
  fields.forEach((field) => {
    if (!field) return;
    if (Array.isArray(field)) {
      field.forEach((f) => {
        if (f) targetFieldsText.push(f);
      });
    } else if (typeof field === 'string') {
      targetFieldsText.push(field);
    }
  });

  if (targetFieldsText.length === 0) return false;

  // Split query into tokens
  const queryTokens = normQuery.split(/\s+/).filter(Boolean);
  if (queryTokens.length === 0) return false;

  // Every query token must match at least one target field/word
  return queryTokens.every((token) => {
    return targetFieldsText.some((targetText) => isTokenFuzzyMatch(token, targetText));
  });
}
