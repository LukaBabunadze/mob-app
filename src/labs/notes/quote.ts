import AsyncStorage from '@react-native-async-storage/async-storage';

const QUOTE_KEY = 'daily-quote';

export type CachedQuote = {
  text: string;
  author: string;
  fetchedAt: number;
};

export async function readCachedQuote() {
  const raw = await AsyncStorage.getItem(QUOTE_KEY);
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as CachedQuote;
}

export async function loadQuote(online: boolean) {
  const cached = await readCachedQuote();
  if (!online) {
    return { quote: cached, fromCache: true };
  }

  try {
    const response = await fetch('https://dummyjson.com/quotes/random');
    if (!response.ok) {
      throw new Error('Quote request failed');
    }
    const data = (await response.json()) as { quote: string; author: string };
    const quote: CachedQuote = {
      text: data.quote,
      author: data.author,
      fetchedAt: Date.now(),
    };
    await AsyncStorage.setItem(QUOTE_KEY, JSON.stringify(quote));
    return { quote, fromCache: false };
  } catch {
    return { quote: cached, fromCache: true };
  }
}
