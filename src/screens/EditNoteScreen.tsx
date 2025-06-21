import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { getNotes, saveNotes } from '../utils/storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const COLORS = ['#fff', '#f8d7da', '#d1ecf1', '#d4edda', '#fff3cd'];

export default function EditNoteScreen() {
  const route = useRoute<any>();
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color || COLORS[0]);
  const [pinned, setPinned] = useState(note.pinned || false);
  const [history, setHistory] = useState(note.history || []);
  const navigation = useNavigation();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Title and content cannot be empty.');
      return;
    }
    const notes = await getNotes();
    // Push current state to history (max 3)
    const prevState = {
      title: note.title,
      content: note.content,
      color: note.color,
      pinned: note.pinned,
      updatedAt: note.updatedAt,
    };
    let newHistory = [...history, prevState];
    if (newHistory.length > 3) newHistory = newHistory.slice(newHistory.length - 3);
    const updatedNote = {
      ...note,
      title,
      content,
      color,
      pinned,
      updatedAt: new Date().toISOString(),
      history: newHistory,
    };
    const newNotes = notes.map((n: any) => (n.id === note.id ? updatedNote : n));
    await saveNotes(newNotes);
    navigation.goBack();
  };

  const handleRollback = async () => {
    if (!history.length) return;
    const lastState = history[history.length - 1];
    setTitle(lastState.title);
    setContent(lastState.content);
    setColor(lastState.color);
    setPinned(lastState.pinned);
    setHistory(history.slice(0, -1));
    // Optionally, save immediately or wait for user to press Save
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <View style={styles.row}>
        <Text>Pin Note</Text>
        <Switch value={pinned} onValueChange={setPinned} />
      </View>
      <View style={styles.row}>
        <Text>Color:</Text>
        {COLORS.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.color, { backgroundColor: c, borderWidth: color === c ? 2 : 1 }]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
      {history.length > 0 && (
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#6c757d' }]} onPress={handleRollback}>
          <Text style={styles.saveBtnText}>Rollback</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 8, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  color: { width: 30, height: 30, borderRadius: 15, marginHorizontal: 4, borderColor: '#333' },
  saveBtn: { backgroundColor: '#007bff', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
