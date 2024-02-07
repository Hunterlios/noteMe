import { View, Text, TextInput, Button } from "react-native";
import React from "react";
import { useState } from "react";
import { FIREBASE_DB } from "../../firebaseConfig";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet } from "react-native";

const Edit = ({ route }) => {
  const { _doc } = route.params;
  const { _path } = route.params;
  const { _navigation } = route.params;
  const [title, setTitle] = useState(_doc.title);
  const [note, setNote] = useState(_doc.note);
  const [prioOpen, setPrioOpen] = useState(false);
  const [prio, setPrio] = useState(null);
  const priority = [
    { label: "High", value: 1 },
    { label: "Medium", value: 2 },
    { label: "Low", value: 3 },
  ];

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

  return (
    <View style={styles.container}>
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
            color: "gray",
          }}
        />
      </View>
      <TextInput
        style={styles.titleInput}
        value={title}
        maxLength={25}
        onChangeText={(text) => setTitle(text === "" ? null : text)}
      />
      <TextInput
        style={styles.titleInput}
        value={note}
        maxLength={150}
        onChangeText={(text) => setNote(text === "" ? null : text)}
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
    marginHorizontal: 20,
    marginVertical: 20,
    height: "30%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  prioPicker: {
    zIndex: 1000,
    marginVertical: 5,
  },
  titleInput: {
    borderWidth: 1,
    height: 50,
    width: "100%",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
  },
  btn: {
    width: "100%",
    marginVertical: 10,
  },
});
