import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, StatusBar, TextInput, Picker } from 'react-native';
import Text, { ColoredText } from '../common/Text';
import firestore from '@react-native-firebase/firestore';
import useDebounce from '../common/utils';
import { SettingsLabel, SettingsTextInput } from '../common/Input';

const BGCOLOR = 'darkblue';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        // backgroundColor: 'gray'
    },
    imageView: {
        flex: 1,
        backgroundColor: BGCOLOR,
        alignItems: 'center'
    },
    profileImage: {
        marginTop: 15,
        width: 140,
        height: 140
    },
    detailsView: {
        flex: 2.5,
        padding: 20
    }
});



export default function () {
    const [user, setUser] = useState(null);

    const userRef = firestore().collection('users').doc('benbs93@gmail.com');

    useEffect(() => {
        return userRef.onSnapshot(doc => {
            const user = doc.data();

            setUser(user);
        });
    }, []);

    async function updateUser(field, value) {
        await userRef
           .update({
            [field]: value
          });
      }

    if (!user) {
        return <></>;
    }

    return <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={BGCOLOR} />
        <View style={styles.imageView}>
            <ColoredText color="white">Edit Profile</ColoredText>
            <Image style={styles.profileImage} source={require('../../../assets/images/man.png')}></Image>
        </View>
        <View style={styles.detailsView}>
            <SettingsLabel>Name</SettingsLabel>
            <SettingsTextInput value={user.name} placeholder="enter your name" onChange={value => updateUser('name', value)}></SettingsTextInput>

            <SettingsLabel>Gender</SettingsLabel>
            <Picker
                selectedValue={user.gender}
                onValueChange={(itemValue, _) => updateUser('gender', itemValue)
            }>
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
            </Picker>

            <SettingsLabel>Age</SettingsLabel>
            <SettingsTextInput value={user.age.toString()} onChange={value => updateUser('age', value)} keyboardType="number-pad" placeholder="enter your age" ></SettingsTextInput>

            <SettingsLabel>Height</SettingsLabel>
            <SettingsTextInput value={user.height.toString()} onChange={value => updateUser('height', value)} keyboardType="number-pad" placeholder="enter your height"></SettingsTextInput>

            <SettingsLabel>Weight</SettingsLabel>
            <SettingsTextInput value={user.weight.toString()} onChange={value => updateUser('weight', value)} keyboardType="number-pad" placeholder="enter your weight"></SettingsTextInput>

            <SettingsLabel>I Exercise...</SettingsLabel>
            <Picker
                selectedValue={user.exercise}
                onValueChange={(itemValue, _) => updateUser('exercise', itemValue)
            }>
                <Picker.Item label="Sometimes" value="0" />
                <Picker.Item label="Once a Week" value="1" />
                <Picker.Item label="Twice a Week" value="2" />
                <Picker.Item label="Three Times a Week" value="3" />
                <Picker.Item label="Four Times a Week" value="4" />
                <Picker.Item label="Every Day" value="5" />
                <Picker.Item label="Everyday (Including Weekends)" value="6" />
            </Picker>

        </View>
    </View>
}
