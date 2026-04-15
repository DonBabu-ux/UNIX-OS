import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { storage } from '../../../local_storage/storage';

const NotesApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [note, setNote] = useState(storage.get('internal_note') || '');

  useEffect(() => {
    storage.set('internal_note', note);
  }, [note]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>Close</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Start typing..."
        placeholderTextColor="#555"
        value={note}
        onChangeText={setNote}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  close: {
    color: '#3d5afe',
  },
  input: {
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    height: '90%',
  },
});

export default NotesApp;
