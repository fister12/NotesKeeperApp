import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { getNotes, saveNotes } from '../utils/storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  ViewNote: { note: any };
  EditNote: { note: any };
  AddNote: undefined;
};

export default function HomeScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadNotes();
  }, [isFocused]);

  const loadNotes = async () => {
    const allNotes = await getNotes();
    setNotes(allNotes);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const newNotes = notes.filter(n => n.id !== id);
          setNotes(newNotes);
          await saveNotes(newNotes);
        }
      }
    ]);
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));
  const sortedNotes = [...filteredNotes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search notes..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={sortedNotes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.note, { backgroundColor: item.color || '#fff' }]}
            onPress={() => navigation.navigate('ViewNote', { note: item })}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.title}>{item.title}</Text>
              {item.pinned && <Text style={styles.pin}>📌</Text>}
            </View>
            <Text numberOfLines={2}>{item.content}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate('EditNote', { note: item })}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No notes found.</Text>}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddNote')}>
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  search: { backgroundColor: '#fff', borderRadius: 8, padding: 8, marginBottom: 12 },
  note: { padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  title: { fontWeight: 'bold', fontSize: 16 },
  pin: { marginLeft: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  edit: { color: 'blue', marginRight: 16 },
  delete: { color: 'red' },
  addBtn: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#007bff', borderRadius: 30, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  addBtnText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
});
