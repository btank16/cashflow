import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../Colors/colors.Js';

const CustomTitle = ({ title, style }) => {
  const [textWidth, setTextWidth] = useState(0);

  const onTextLayout = (event) => {
    setTextWidth(event.nativeEvent.lines[0].width);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, style]} onTextLayout={onTextLayout}>
        {title}
      </Text>
      <View style={[styles.underline, { width: textWidth }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.basicText,
    marginBottom: 5,
  },
  underline: {
    height: 2,
    backgroundColor: colors.accent,
  },
});

export default CustomTitle;