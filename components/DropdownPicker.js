import React from "react";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

const DropdownPicker = ({ updateCategories }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      searchable={true}
      placeholder="Category"
      searchTextInputProps={{
        maxLength: 25,
      }}
      addCustomItem={true}
      placeholderStyle={{
        color: "gray",
      }}
    />
  );
};

export default DropdownPicker;
