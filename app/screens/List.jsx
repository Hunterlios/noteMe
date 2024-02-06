import { View, Button, TextInput, Text, TouchableOpacity } from "react-native";
import { FIREBASE_DB } from "../../firebaseConfig";
import { setDoc, getDocs, collection, doc } from "firebase/firestore";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import ChildrenList from "../../components/ChildrenList";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { deleteDoc } from "firebase/firestore";
import Notification from "../../components/Notification";

const List = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const query = collection(FIREBASE_DB, "categories");
  const [docs, loading, error, snapshot] = useCollectionData(query);

  const deleteCategory = async (category) => {
    const categoryRef = doc(FIREBASE_DB, `categories/${category.name}`);
    const colRef = collection(
      FIREBASE_DB,
      `categories/${category.name}/children`
    );
    const snapshot = await getDocs(colRef);
    snapshot.docs?.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    deleteDoc(categoryRef);
    setCategory(null);
  };

  const getCategories = async () => {
    const query = collection(FIREBASE_DB, "categories");
    const snapshot = await getDocs(query);
    const categories = [];
    snapshot.docs?.forEach((doc) => {
      categories.push({ label: doc.data().name, value: doc.data().name });
    });
    setCategories(categories);
  };

  useEffect(() => {
    getCategories();
  }, [open]);

  const handleSubmit = async (path) => {
    const docRef = doc(FIREBASE_DB, path, title);
    await setDoc(docRef, { title: title, note: note });
  };

  const handleAddCategory = async () => {
    const docRef = doc(FIREBASE_DB, "categories", category);
    await setDoc(docRef, { name: category });
  };

  return (
    <View style={styles.container}>
      <View style={styles.picker}>
        <DropDownPicker
          open={open}
          value={category}
          items={categories}
          setOpen={setOpen}
          setValue={setCategory}
          onChangeValue={handleAddCategory}
          searchable={true}
          style={styles.picker}
          placeholder="Category"
          searchTextInputProps={{
            maxLength: 25,
          }}
          addCustomItem={true}
          placeholderStyle={{
            color: "gray",
          }}
        />
      </View>
      <Notification />
      <View style={styles.form}>
        <TextInput
          placeholder="Add title"
          onChangeText={(text) => setTitle(text)}
          value={title}
          style={styles.input}
        />
        <TextInput
          placeholder="Add note"
          onChangeText={(text) => setNote(text)}
          value={note}
          style={styles.input}
        />
        <View style={styles.btnContainer}>
          <View style={styles.btn}>
            <Button
              onPress={() => {
                handleSubmit(`categories/${category}/children`),
                  setNote(""),
                  setTitle(""),
                  setCategory(null);
              }}
              title="Add new note"
              disabled={note === "" || title === "" || category === null}
            />
          </View>
          <View style={styles.btn}>
            <Button
              onPress={() => {
                // W tym miejscu Kuba bedzie używane DataTimePicker :)
              }}
              title="Set time"
            />
          </View>
        </View>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        docs.map((doc) => (
          <View key={doc.name} style={styles.noteContainer}>
            <TouchableOpacity style={styles.note}>
              <Text style={styles.noteText}>{doc.name}</Text>
            </TouchableOpacity>
            <Ionicons
              name="trash-bin-outline"
              size={24}
              color="red"
              onPress={() => deleteCategory(doc)}
            />
            <ChildrenList
              key={doc.name}
              path={`categories/${doc.name}/children`}
            />
          </View>
        ))
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
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
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
  btn: {
    marginLeft: 10,
  },
  picker: {
    zIndex: 1,
    marginVertical: 10,
  },
});
