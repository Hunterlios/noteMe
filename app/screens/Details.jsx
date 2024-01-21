import { View, Text } from "react-native";
import React from "react";

const Details = ({ route }) => {
  const { title } = route.params;
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

export default Details;
