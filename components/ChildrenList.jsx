import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FIREBASE_DB } from "../firebaseConfig";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChildrenList = ({ path, navigation }) => {
  const _path = path;
  const query = collection(FIREBASE_DB, _path);
  const [docs, loading, error, snapshot] = useCollectionData(query);

  const deleteNote = async (_doc) => {
    const docRef = doc(FIREBASE_DB, _path, _doc.title);
    await deleteDoc(docRef);
  };

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        docs
          .sort((a, b) => a.priority - b.priority)
          .map((doc) => (
            <View key={doc.name} style={styles.container}>
              <TouchableOpacity
                style={styles.note}
                onPress={() =>
                  navigation.navigate("Edit", {
                    _doc: doc,
                    _path: _path,
                    _navigation: navigation,
                  })
                }
              >
                <Text style={styles.text} key={doc.title}>
                  {doc.title}
                </Text>
              </TouchableOpacity>
              <Ionicons
                name="trash-bin-outline"
                size={24}
                color="black"
                onPress={() => deleteNote(doc)}
              />
            </View>
          ))
      )}
    </View>
  );
};

export default ChildrenList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  note: {
    paddingVertical: 10,
    margin: 10,
    width: "80%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
  },
});
