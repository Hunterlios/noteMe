import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { FIREBASE_DB } from "../../firebaseConfig";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Edit = ({ route }) => {
  const { _doc } = route.params;
  const { _path } = route.params;
  const { _navigation } = route.params;
  const [title, setTitle] = useState(_doc.title);
  const [note, setNote] = useState(_doc.note);
  const [prioOpen, setPrioOpen] = useState(false);
  const [prio, setPrio] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const priority = [
    { label: "High", value: 1 },
    { label: "Medium", value: 2 },
    { label: "Low", value: 3 },
  ];

  useEffect(() => {
    loadDarkModeState();
  }, []);

  const loadDarkModeState = async () => {
    try {
      const value = await AsyncStorage.getItem("darkMode");
      if (value !== null) {
        setDarkMode(JSON.parse(value));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveDarkModeState = async (value) => {
    try {
      await AsyncStorage.setItem("darkMode", JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  const updateDoc = async () => {
    const oldDocRef = doc(FIREBASE_DB, _path, _doc.title);
    await deleteDoc(oldDocRef);
    const docRef = doc(FIREBASE_DB, _path, title === null ? _doc.title : title);
    await setDoc(docRef, {
      title: title === null ? _doc.title : title,
      note: note === null ? _doc.note : note,
      priority: prio === null ? _doc.priority : prio,
      date: _doc.date,
    }).then(() => {
      _navigation.navigate("Notes");
    });

    setPrio(null);
    setTitle(null);
    setNote(null);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    saveDarkModeState(newMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#2b2042" : "white" }]}>
      <View style={styles.prioPicker}>
        <DropDownPicker
          open={prioOpen}
          value={prio}
          items={priority}
          setOpen={setPrioOpen}
          setValue={setPrio}
          placeholder={
            _doc.priority === 1
              ? "High"
              : _doc.priority === 2
                ? "Medium"
                : "Low"
          }
          placeholderStyle={{
            color: darkMode ? "white" : "gray",
          }}
          style={{
            backgroundColor: darkMode ? "#5e5e5e" : "white",
            borderColor: darkMode ? "#555" : "#ccc",
          }}
          dropDownContainerStyle={{
            backgroundColor: darkMode ? "#5e5e5e" : "white",
            borderColor: darkMode ? "#555" : "#ccc",
          }}
        />
      </View>
      <TextInput
        style={[styles.titleInput, { backgroundColor: darkMode ? "#5e5e5e" : "white", color: darkMode ? "white" : "black" }]}
        value={title}
        maxLength={25}
        onChangeText={(text) => setTitle(text === "" ? null : text)}
        placeholder="Edit title"
        placeholderTextColor={darkMode ? "white" : "black"}
      />
      <TextInput
        style={[styles.noteInput, { backgroundColor: darkMode ? "#5e5e5e" : "white", color: darkMode ? "white" : "black" }]}
        value={note}
        maxLength={150}
        onChangeText={(text) => setNote(text === "" ? null : text)}
        placeholder="Edit note"
        placeholderTextColor={darkMode ? "white" : "black"}
        multiline
      />
      <View style={styles.btn}>
        <Button
          color="#7402cc"
          title="Save"
          onPress={updateDoc}
          disabled={title === null && note === null && prio === null}
        />
      </View>
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  prioPicker: {
    zIndex: 1000,
    width: "80%",
    marginBottom: 20,
  },
  titleInput: {
    borderWidth: 1,
    height: 50,
    width: "80%",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  noteInput: {
    borderWidth: 1,
    height: 150,
    width: "80%",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  btn: {
    width: "80%",
    marginBottom: 20,
  },

  darkModeButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#7402cc",
    padding: 10,
    borderRadius: 8,
  },
  darkModeButtonText: {
    color: "white",
    fontSize: 26,
  },
});
