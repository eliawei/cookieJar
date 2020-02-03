import React, { useEffect, useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import useDebounce from './utils';
import { ColoredText } from './Text';

const Input = ({ label, value, onChangeText, placeHolder, secureTextEntry }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;
  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeHolder}
        autoCorrect={false}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2 // 2/3 of the space is allocated to input and 1/3 is allocated to label
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};
export { Input };

export const SettingsLabel = ({ children }) => {
  return <ColoredText color="#999999" style={{
      fontSize: 14,
      margin: 0,
      padding: 0
  }}>{children}</ColoredText>;
}

export const SettingsTextInput = ({ placeholder, onChange, value, ...props }) => {
  const [innerValue, setValue] = useState(value);
  const debouncedValue = useDebounce(innerValue, 500);

  useEffect(() => {
      if (onChange) {
          onChange(innerValue);
      }
  }, [debouncedValue]);

  return <>        
      <TextInput placeholder={placeholder}
          style={{
              fontSize: 18,
              margin: 0,
              paddingVertical: 0,
              paddingBottom: 2,
              marginBottom: 20,
          }}
          onChangeText={value => setValue(value)} value={innerValue} {...props}></TextInput>
  </>;
}