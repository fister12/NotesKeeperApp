import AsyncStorage from '@react-native-async-storage/async-storage';

export const NOTES_KEY = 'NOTES_KEY';

export async function getNotes() {
  const notes = await AsyncStorage.getItem(NOTES_KEY);
  return notes ? JSON.parse(notes) : [];
}

export async function saveNotes(notes: any[]) {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}
