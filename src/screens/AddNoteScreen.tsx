import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { getNotes, saveNotes } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';

const COLORS = ['#fff', '#f8d7da', '#d1ecf1', '#d4edda', '#fff3cd'];

export default function AddNoteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [pinned, setPinned] = useState(false);
  const navigation = useNavigation();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Title and content cannot be empty.');
      return;
    }
    const notes = await getNotes();
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      color,
      pinned,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {title: 'prev1' , content : '' , color: '' , pinned: false , updatedAt: ''},
        {title: 'prev2' , content : '' , color: '' , pinned: false , updatedAt: ''},
        {title: 'prev3' , content : '' , color: '' , pinned: false , updatedAt: ''}
      ],

    };
    await saveNotes([newNote, ...notes]);
    navigation.goBack();
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
