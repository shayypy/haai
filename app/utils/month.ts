export const MIN_YEAR = 2008;
export const MIN_MONTH = 5; // May, 1-indexed

// use browser localization instead of hardcoding
export const getMonthLabel = (month: number) => {
  return new Date(
    `2000-${month.toString().padStart(2, "0")}-01T00:00`,
  ).toLocaleString(undefined, { month: "short" });
};

export interface YearMonth {
  year: number;
  month: number; // 1-12
}

export const stripDay = <T = string | null>(value: T): T => {
  if (!value) return null as T;
  return (value as string).split("-").slice(0, 2).join("-") as T;
};

export function parseYearMonth(
  value: string | null | undefined,
): YearMonth | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})$/.exec(stripDay(value));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

export function formatYearMonth(
  value: string | null | undefined,
): string | null {
  const parsed = parseYearMonth(value);
  return parsed ? `${getMonthLabel(parsed.month)} ${parsed.year}` : null;
}

export function toYearMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function isYearMonthInRange(
  year: number,
  month: number,
  maxYear: number,
  maxMonth: number,
): boolean {
  if (year < MIN_YEAR || (year === MIN_YEAR && month < MIN_MONTH)) {
    return false;
  }
  if (year > maxYear || (year === maxYear && month > maxMonth)) {
    return false;
  }
  return true;
}

/** Inclusive lower bound for filtering */
export function yearMonthStart({ year, month }: YearMonth): Date {
  return new Date(year, month - 1, 1);
}

/** Exclusive upper bound for filtering (first day of the following month) */
export function yearMonthEndExclusive({ year, month }: YearMonth): Date {
  return new Date(year, month, 1);
}
