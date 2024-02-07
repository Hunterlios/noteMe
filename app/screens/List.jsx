import {
  View,
  Button,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FIREBASE_DB } from "../../firebaseConfig";
import { setDoc, getDocs, collection, doc } from "firebase/firestore";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import ChildrenList from "../../components/ChildrenList";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { deleteDoc } from "firebase/firestore";
import { schedulePushNotification } from "../../notifications/Notification";
import { Platform } from "react-native";

const List = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [prioOpen, setPrioOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [prio, setPrio] = useState(null);
  const priority = [
    { label: "High", value: 1 },
    { label: "Medium", value: 2 },
    { label: "Low", value: 3 },
  ];

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(true ? Platform.OS === "ios" : false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(true ? Platform.OS === "ios" : false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

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
    await setDoc(docRef, {
      title: title,
      note: note,
      date: date.toString(),
      priority: prio,
    });
  };

  const handleAddCategory = async () => {
    const docRef = doc(FIREBASE_DB, "categories", category);
    await setDoc(docRef, { name: category });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropDownPickers}>
        <View style={styles.catPicker}>
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
        <View style={styles.prioPicker}>
          <DropDownPicker
            open={prioOpen}
            value={prio}
            items={priority}
            setOpen={setPrioOpen}
            setValue={setPrio}
            style={styles.picker}
            placeholder="Priority"
            placeholderStyle={{
              color: "gray",
            }}
          />
        </View>
      </View>

      <View>
        <Text>Notification</Text>
        <View style={styles.notifBtn}>
          <View style={styles.dateBtn}>
            <Button onPress={showDatepicker} title="Date" />
          </View>
          <View style={styles.dateBtn}>
            <Button onPress={showTimepicker} title="Time" />
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
      </View>

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
          <Button
            onPress={() => {
              handleSubmit(`categories/${category}/children`),
                schedulePushNotification(title, note, date),
                setNote(""),
                setTitle(""),
                setCategory(null);
              setPrio(null);
            }}
            title="Add new note"
            disabled={
              note === "" || title === "" || category === null || prio === null
            }
          />

          <View style={styles.btn}></View>
        </View>
      </View>
      <ScrollView>
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
      </ScrollView>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  form: {
    flexDirection: "column",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    height: 50,
    width: "100%",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
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

  btnContainer: {
    flexDirection: "row",
    width: 200,
    marginVertical: 10,
  },

  dropDownPickers: {
    flexDirection: "column",
    marginVertical: 15,
    zIndex: 1000,
  },

  catPicker: {
    zIndex: 2000,
    marginVertical: 5,
  },
  prioPicker: {
    zIndex: 1000,
    marginVertical: 5,
  },
  notifBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  dateBtn: {
    marginHorizontal: 5,
    width: 100,
  },
});
