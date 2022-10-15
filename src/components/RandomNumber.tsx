import React, {PropsWithChildren} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const RandomNumber: React.FC<
  PropsWithChildren<{
    number: number;
    isDisabled: boolean;
    id: number;
    onPress: Function;
  }>
> = ({number, isDisabled, id, onPress}) => {
  const handleClick = () => {
    if (isDisabled) return;
    onPress(id);
  };
  return (
    <TouchableOpacity onPress={handleClick}>
      <Text style={[isDisabled && styles.disabled, styles.random]}>
        {number}
      </Text>
    </TouchableOpacity>
  );
};

export default RandomNumber;

const styles = StyleSheet.create({
  random: {
    fontSize: 40,
    backgroundColor: '#e50',
    textAlign: 'center',
    margin: 18,
    minWidth: 120,
  },
  disabled: {
    opacity: 0.3,
  },
});
