import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SkillChip } from '@/components/skill-chip';

const BANNER_URI =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&h=480&q=80';

const PROFILE_NAME = 'ნინო ბერიძე';
const BIO =
  'ბიზნესის, ტექნოლოგიების და განათლების ფაკულტეტის სტუდენტი. დაინტერესებულია მობილური აპლიკაციებით და მონაცემთა ბაზებით.';

const SKILLS = [
  { label: 'JavaScript', level: '4/5' },
  { label: 'React Native', level: '2/5' },
  { label: 'SQL', level: '3/5' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savedName, setSavedName] = useState<string | null>(null);

  const canSave = name.trim().length > 0 && EMAIL_PATTERN.test(email.trim());

  function handleSave() {
    if (!canSave) {
      return;
    }
    setSavedName(name.trim());
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}>
          <Text style={styles.title}>ჩემი პროფილი</Text>

          <View style={styles.bannerFrame}>
            <Image
              source={{ uri: BANNER_URI }}
              style={styles.banner}
              resizeMode="cover"
              accessibilityLabel="ბანერი"
            />
          </View>

          <View style={styles.identity}>
            <Image
              source={require('@/assets/images/avatar.png')}
              style={styles.avatar}
              accessibilityLabel="ავატარი"
            />
            <View style={styles.identityText}>
              <Text style={styles.profileName}>{PROFILE_NAME}</Text>
              <Text numberOfLines={2} style={styles.bio}>
                {BIO}
              </Text>
            </View>
          </View>

          <View style={styles.skills}>
            {SKILLS.map((skill) => (
              <SkillChip key={skill.label} label={skill.label} level={skill.level} />
            ))}
          </View>

          <View style={styles.form}>
            <Text style={styles.formLabel}>კონტაქტის მონაცემები</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="სახელი"
              placeholderTextColor="#A1A1AA"
              autoCapitalize="words"
              style={styles.input}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="ელფოსტა"
              placeholderTextColor="#A1A1AA"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="პაროლი"
              placeholderTextColor="#A1A1AA"
              secureTextEntry
              style={styles.input}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave }}
              disabled={!canSave}
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                !canSave && styles.saveButtonDisabled,
                pressed && canSave && styles.saveButtonPressed,
              ]}>
              <Text style={styles.saveLabel}>შენახვა</Text>
            </Pressable>

            {savedName ? (
              <Text style={styles.greeting}>მოგესალმებით, {savedName}!</Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  bannerFrame: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  identityText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  bio: {
    marginTop: 2,
    fontSize: 16,
    lineHeight: 22,
    color: '#6B6578',
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  form: {
    marginTop: 22,
    gap: 10,
  },
  formLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: '#8E8E93',
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6E6EA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    marginTop: 4,
    backgroundColor: '#6B2FD6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonPressed: {
    backgroundColor: '#2E1466',
  },
  saveLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  greeting: {
    color: '#6B2FD6',
    fontSize: 16,
    fontWeight: '600',
  },
});
