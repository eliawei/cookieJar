import React from 'react';
import { Text as SystemText, StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    main: {
        color: 'black',
        fontFamily: 'FiraSans-ExtraLight'
    }
})

export default function Text({ children, style = {}, ...props }) {
    return <SystemText style={{ ...styles.main, ...style }} {...props}>{children}</SystemText>
}

export const ColoredText = ({ color, children, style = {}, ...props }) => {
    return <Text style={{ color, ...style }} {...props}>{children}</Text>;
};