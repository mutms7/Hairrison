export interface LookRecord {
  id: string;
  label: string;
  prompt: string;
  beforeUrl: string;
  afterUrl: string;
  createdAt: string;
}

const HISTORY_KEY = 'hairrison.history';
const MAX_ITEMS = 24;

export function getHistory(): LookRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as LookRecord[]) : [];
  } catch {
    return [];
  }
}

export function addToHistory(record: LookRecord): LookRecord[] {
  const next = [record, ...getHistory()].slice(0, MAX_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
