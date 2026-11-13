import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { deleteNote, insertNote, listNotes, updateNote, type Note } from '@/labs/notes/db';
import { loadQuote, type CachedQuote } from '@/labs/notes/quote';
import { useAppTheme } from '@/labs/theme/ThemeProvider';

type Draft = {
  id: number | null;
  title: string;
  body: string;
};

export function NotesScreen() {
  const { colors } = useAppTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [quote, setQuote] = useState<CachedQuote | null>(null);
  const [online, setOnline] = useState(true);

  const refresh = useCallback(async () => {
    setNotes(await listNotes());
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = Boolean(state.isConnected && state.isInternetReachable !== false);
      setOnline(connected);
      loadQuote(connected).then((result) => setQuote(result.quote));
    });
    return unsubscribe;
  }, [refresh]);

  function confirmDelete(note: Note) {
    Alert.alert('წაშლა', 'ნამდვილად წავშალო ჩანაწერი?', [
      { text: 'გაუქმება', style: 'cancel' },
      {
        text: 'წაშლა',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(note.id);
          await refresh();
        },
      },
    ]);
  }

  async function saveDraft() {
    if (!draft) {
      return;
    }
    const title = draft.title.trim();
    const body = draft.body.trim();
    if (!title) {
      return;
    }
    if (draft.id == null) {
      await insertNote(title, body);
    } else {
      await updateNote(draft.id, title, body);
    }
    setDraft(null);
    await refresh();
  }

  if (draft) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{draft.id == null ? 'ახალი ჩანაწერი' : 'რედაქტირება'}</Text>
        <TextInput
          value={draft.title}
          onChangeText={(title) => setDraft({ ...draft, title })}
          placeholder="სათაური"
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
        <TextInput
          value={draft.body}
          onChangeText={(body) => setDraft({ ...draft, body })}
          placeholder="ტექსტი"
          placeholderTextColor={colors.muted}
          multiline
          style={[styles.input, styles.bodyInput, { color: colors.text, borderColor: colors.border }]}
        />
        <Pressable accessibilityRole="button" onPress={saveDraft} style={styles.primary}>
          <Text style={styles.primaryText}>შენახვა</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => setDraft(null)}>
          <Text style={styles.link}>გაუქმება</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {!online ? <Text style={styles.banner}>ოფლაინ რეჟიმი — ნაჩვენებია შენახული ციტატა</Text> : null}
      <View style={[styles.quote, { backgroundColor: colors.card }]}>
        <Text style={[styles.quoteText, { color: colors.text }]}>{quote?.text ?? 'ციტატა ჯერ არ არის'}</Text>
        <Text style={[styles.quoteMeta, { color: colors.muted }]}>
          {quote ? `${quote.author} · ${new Date(quote.fetchedAt).toLocaleString()}` : 'განახლება არ მომხდარა'}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {notes.map((note) => (
          <Pressable key={note.id} onPress={() => setDraft(note)} style={[styles.note, { backgroundColor: colors.card }]}>
            <View style={styles.noteHeader}>
              <Text style={[styles.noteTitle, { color: colors.text }]}>{note.title}</Text>
              <Pressable accessibilityRole="button" onPress={() => confirmDelete(note)}>
                <Text style={styles.delete}>წაშლა</Text>
              </Pressable>
            </View>
            <Text style={[styles.noteBody, { color: colors.muted }]}>{note.body}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        accessibilityRole="button"
        onPress={() => setDraft({ id: null, title: '', body: '' })}
        style={styles.add}>
        <Text style={styles.primaryText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  banner: {
    backgroundColor: '#3C178C',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },
  quote: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quoteMeta: {
    fontSize: 12,
  },
  list: {
    gap: 10,
    paddingBottom: 80,
  },
  note: {
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  noteTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  noteBody: {
    fontSize: 14,
  },
  delete: {
    color: '#D92D20',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  bodyInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  primary: {
    backgroundColor: '#6B2FD6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    color: '#6B2FD6',
    fontWeight: '700',
    textAlign: 'center',
  },
  add: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6B2FD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
