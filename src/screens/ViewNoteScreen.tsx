import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ViewNoteScreen() {
  const route = useRoute<any>();
  const { note } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: note.color || '#fff' }]}> 
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.date}>Created: {new Date(note.createdAt).toLocaleString()}</Text>
      <Text style={styles.date}>Updated: {new Date(note.updatedAt).toLocaleString()}</Text>
      <Text style={styles.content}>{note.content}</Text>
      {note.pinned && <Text style={styles.pin}>📌 Pinned</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  content: { fontSize: 16, marginTop: 10 },
  date: { color: '#888', fontSize: 12 },
  pin: { marginTop: 10, color: '#e67e22', fontWeight: 'bold' },
});
