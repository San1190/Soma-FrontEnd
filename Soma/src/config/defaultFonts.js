import { Text as RNText, TextInput as RNTextInput, StyleSheet } from 'react-native';
import React from 'react';

// Override default Text component to use Afacad
export const Text = (props) => {
    const { style, ...otherProps } = props;
    return <RNText {...otherProps} style={[styles.defaultText, style]} />;
};

// Override default TextInput component to use Afacad
export const TextInput = (props) => {
    const { style, ...otherProps } = props;
    return <RNTextInput {...otherProps} style={[styles.defaultTextInput, style]} />;
};

const styles = StyleSheet.create({
    defaultText: {
        fontFamily: 'Afacad_400Regular',
    },
    defaultTextInput: {
        fontFamily: 'Afacad_400Regular',
    },
});
