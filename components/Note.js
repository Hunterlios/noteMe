import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React from "react";

const createTwoButtonAlert = (prio) =>
  Alert.alert("Note priority", `${prio}`, [
    { text: "OK", onPress: () => console.log("OK Pressed") },
  ]);

const Note = ({ item, onPress, backgroundColor, textColor }) => {
  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor }]}
      onPress={() => {
        onPress;
        createTwoButtonAlert(item.prio);
      }}
    >
      <View style={styles.itemLeft}>
        <TouchableOpacity style={styles.square}></TouchableOpacity>
        <Text style={[styles.itemText, { color: textColor }]}>
          {item.title}
        </Text>
      </View>
      <View style={styles.circular}></View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: "#55bcf6",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: "80%",
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: "#55bcf6",
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default Note;
