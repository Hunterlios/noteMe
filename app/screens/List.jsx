import {
  View,
  Button,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FIREBASE_DB } from "../../firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const List = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    const notesRef = collection(FIREBASE_DB, "notes");
    const subscriber = onSnapshot(notesRef, {
      next: (snapshot) => {
        const notes = [];
        snapshot.docs.forEach((doc) => {
          notes.push({ id: doc.id, ...doc.data() });
        });
        setNotes(notes);
      },
    });
    return () => subscriber();
  }, []);

  const addNote = async () => {
    const doc = await addDoc(collection(FIREBASE_DB, "notes"), {
      title: note,
    });
    setNote("");
  };

  const renderNotes = ({ item }) => {
    const ref = doc(FIREBASE_DB, `notes/${item.id}`);

    const getDetails = async () => {
      navigation.navigate("Details", { title: item.title });
    };

    const deleteNote = async () => {
      deleteDoc(ref);
    };

    return (
      <View style={styles.noteContainer}>
        <TouchableOpacity onPress={getDetails} style={styles.note}>
          <Text style={styles.noteText}>{item.title}</Text>
        </TouchableOpacity>
        <Ionicons
          name="trash-bin-outline"
          size={24}
          color="red"
          onPress={deleteNote}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          placeholder="Add new note"
          onChangeText={(text) => setNote(text)}
          value={note}
          style={styles.input}
        />
        <Button onPress={addNote} title="Add note" disabled={note === ""} />
      </View>
      {notes.length > 0 && (
        <FlatList
          data={notes}
          renderItem={renderNotes}
          keyExtractor={(note) => note.id}
        />
      )}
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  form: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    height: 40,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  noteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "yellow",
    marginVertical: 5,
    borderRadius: 5,
  },
  noteText: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  note: {
    flex: 1,
  },
});
