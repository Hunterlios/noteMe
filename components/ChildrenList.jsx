import { View, Text } from "react-native";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FIREBASE_DB } from "../firebaseConfig";
import { collection } from "firebase/firestore";

const ChildrenList = ({ path }) => {
  const query = collection(FIREBASE_DB, path);
  const [docs, loading, error, snapshot] = useCollectionData(query);
  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        docs
          .sort((a, b) => a.priority - b.priority)
          .map((doc) => <Text key={doc.title}>{doc.title}</Text>)
      )}
    </View>
  );
};

export default ChildrenList;
