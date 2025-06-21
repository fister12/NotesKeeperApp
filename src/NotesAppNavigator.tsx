import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import EditNoteScreen from './screens/EditNoteScreen';
import ViewNoteScreen from './screens/ViewNoteScreen';

export type RootStackParamList = {
  Home: undefined;
  AddNote: undefined;
  EditNote: { note: any };
  ViewNote: { note: any };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function NotesAppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Notes' }} />
      <Stack.Screen name="AddNote" component={AddNoteScreen} options={{ title: 'Add Note' }} />
      <Stack.Screen name="EditNote" component={EditNoteScreen} options={{ title: 'Edit Note' }} />
      <Stack.Screen name="ViewNote" component={ViewNoteScreen} options={{ title: 'View Note' }} />
    </Stack.Navigator>
  );
}
