import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function ({ navigation }) {
    const [initilizing, setInitilizing] = useState(true);
    const [user, setUser] = useState();
 
    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initilizing) setInitilizing(false);
        navigation.navigate(user ? 'SnackList' : 'SignIn');
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    return <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
    </View>
}