import { View, Button, TextInput, Text, ScrollView, TouchableOpacity } from "react-native";
import { FIREBASE_DB } from "../../firebaseConfig";
import { setDoc, getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import ChildrenList from "../../components/ChildrenList";
import { useCollectionData } from "react-firebase-hooks/firestore";
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
  const [darkMode, setDarkMode] = useState(false);

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

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#2b2042" : "white" }]}>
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
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            dropDownContainerStyle={{
              position: "relative",
              top: 0,
            }}
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
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            dropDownContainerStyle={{
              position: "relative",
              top: 0,
            }}
            placeholderStyle={{
              color: "gray",
            }}
          />
        </View>
      </View>

      <View style={styles.notification}>
        <Text style={darkMode ? styles.notificationTextDarkMode : styles.notificationText}>Notification</Text>
        <View style={styles.notifBtn}>
          <View style={styles.dateBtn}>
            <Button color="#7402cc" onPress={showDatepicker} title="Date" />
          </View>
          <View style={styles.dateBtn}>
            <Button color="#7402cc" onPress={showTimepicker} title="Time" />
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
          placeholderTextColor={darkMode ? "white" : "black"}
          onChangeText={(text) => setTitle(text)}
          value={title}
          maxLength={25}
          style={[styles.input, { backgroundColor: darkMode ? "#5e5e5e" : "white", color: darkMode ? "white" : "black" }]}
        />
        <TextInput
          placeholder="Add note"
          placeholderTextColor={darkMode ? "white" : "black"}
          onChangeText={(text) => setNote(text)}
          value={note}
          maxLength={150}
          style={[styles.input, { backgroundColor: darkMode ? "#5e5e5e" : "white", color: darkMode ? "white" : "black" }]}
        />
        <View style={styles.btnContainer}>
          <Button
            color="#7402cc"
            onPress={() => {
              handleSubmit(`categories/${category}/children`);
              schedulePushNotification(title, note, date);
              setNote("");
              setTitle("");
              setCategory(null);
              setPrio(null);
            }}
            title="Add new note"
            disabled={note === "" || title === "" || category === null || prio === null}
          />
        </View>
      </View>
      <View style={styles.line} />
      <ScrollView>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          docs.map((doc) => (
            <View key={doc.name} style={[styles.categoryContainer, { backgroundColor: darkMode ? "#7402cc" : "#c9b2db" }]}>
              <View style={styles.noteContainer}>
                <Text style={[styles.noteText, { color: darkMode ? "white" : "black" }]}>{doc.name}</Text>
                <Ionicons
                  name="trash-bin-outline"
                  size={24}
                  color="white"
                  onPress={() => deleteCategory(doc)}
                />
              </View>
              <View style={styles.childList}>
                <ChildrenList
                  key={doc.name}
                  path={`categories/${doc.name}/children`}
                  navigation={navigation}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeButton}>
        <Text style={styles.darkModeButtonText}>
          {darkMode ? " ☀︎ " : " ☾ "}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 5,
    height: "100%",
  },
  form: {
    flexDirection: "column",
    marginVertical: 5,
    marginHorizontal: 15,
  },
  input: {
    borderWidth: 1,
    height: 50,
    width: "100%",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    color: "black",
  },
  categoryContainer: {
    flexDirection: "column",
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 15,
  },
  noteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  childList: {
    backgroundColor: "#c9b2db",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  noteText: {
    fontSize: 20,
    color: "white",
  },
  btnContainer: {
    width: "100%",
    marginVertical: 10,
  },
  dropDownPickers: {
    flexDirection: "column",
    marginVertical: 10,
    marginHorizontal: 15,
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
    justifyContent: "start",
    marginVertical: 5,
  },
  notification: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationText: {
    fontSize: 16,
    marginHorizontal: 15,
    color: "black",
  },
  notificationTextDarkMode: {
    fontSize: 16,
    marginHorizontal: 15,
    color: "white",
  },
  dateBtn: {
    marginHorizontal: 5,
    width: 100,
  },
  line: {
    width: "100%",
    height: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
