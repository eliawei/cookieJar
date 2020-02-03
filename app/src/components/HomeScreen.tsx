import React from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function HomeScreen({ navigation }) {
    const { navigate } = navigation;

    async function signOut() {
        await auth().signOut();
        navigation.navigate('AuthLoading');
    }

    return (<View>
        <Button onPress={() => signOut()} title="Press here"></Button>
    </View>
    );
}