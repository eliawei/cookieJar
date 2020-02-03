import React, {useState} from 'react';
import { View, Text, StyleSheet, ViewStyle, TextInput,  ToastAndroid, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import BarcodeScannerScreen from '../BarcodeScannerScreen';

const centeredView = {
    alignItems: 'center',
    justifyContent: 'center'
} as ViewStyle;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'stretch'
    },
    logo: {
        ...centeredView,
        flex: 1,
        marginTop: 30
    },
    userLogin: {
        ...centeredView,
        flex: 1,
        alignItems: 'stretch',
        padding: 40
    },
    thirdPartyLogin: {
        ...centeredView,
        flex: 1,
        alignItems: 'stretch',
        padding: 40
    },
    loginInput: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        margin: 10
    },
    loginButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 2000,
        height: 40,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginButtonText: {
        fontSize: 20,
        fontWeight: '100',
    }
})

function LoginButton({ children , ...props}) {
    return (
        <TouchableOpacity {...props}
            style={styles.loginButton}>
            <Text style={styles.loginButtonText}>{children}</Text>
        </TouchableOpacity>
    );
}

export default function SignInScreen({navigation}) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    async function emailSignIn() {
        try {
            await auth().signInWithEmailAndPassword(email, password);
            navigation.navigate('SnackList');
            
        } catch (e) {
            ToastAndroid.show(e.message, ToastAndroid.BOTTOM);
        }
    }

    const { main } = styles;
    return <View style={main}>
        <View style={styles.logo}>
            <Text style={{fontSize: 36}}>Cookie Jar</Text>
        </View>
        <View style={styles.userLogin}>
            <TextInput style={styles.loginInput}
                placeholder="Username"
                placeholderTextColor="#969696"
                onChangeText={setEmail}
                value={email}></TextInput>
            <TextInput style={styles.loginInput}
                placeholder="Password"
                placeholderTextColor="#969696"
                onChangeText={setPassword}
                autoCompleteType="password"
                secureTextEntry={true}
                value={password}></TextInput>
            <LoginButton onPress={() => emailSignIn()}>GO</LoginButton>
        </View>
        <View style={styles.thirdPartyLogin}>
            <LoginButton>Continue with Facebook</LoginButton>
            <LoginButton>Continue with Google</LoginButton>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                <Text>or </Text><Text onPress={() => ToastAndroid.show(email, ToastAndroid.BOTTOM)} style={{color: 'rgb(78, 152, 255)'}}>Sign up</Text>
            </View>
        </View>
    </View>
}   