import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, ToastAndroid } from 'react-native';
import Text from '../common/Text';
import { useNavigation } from 'react-navigation-hooks';


const styles = StyleSheet.create({
    settingsList: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        // backgroundColor: 'gray',
    },
    settingsButton: {
        width: 175,
        height: 175,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    settingsButtonText: {
        marginTop: 5
    },
    settingsButtonIcon: {
        maxWidth: 130,
        maxHeight: 130
    }
})

const SettingsButton = ({ title, icon, screen }) => {
    const navigation = useNavigation();
    return <TouchableOpacity onPress={() => screen ? navigation.navigate(screen) : ToastAndroid.show('Coming Soon!', ToastAndroid.BOTTOM)}>
        <View style={styles.settingsButton}>
            <Image source={icon} style={styles.settingsButtonIcon}></Image>
            <Text style={styles.settingsButtonText}>{title}</Text>
        </View>
    </TouchableOpacity>;
};

export default function SettingsScreen() {
    const basePath = '../../../assets/images/';
    return <View style={styles.settingsList}>
        <SettingsButton screen="ProfileSettings" title="Profile" icon={require(basePath + 'man.png')}></SettingsButton>
        <SettingsButton screen="SnacksSettings" title="Snacks" icon={require(basePath + 'chocolate.png')}></SettingsButton>
        <SettingsButton screen={null} title="Jar" icon={require(basePath + 'food-and.png')}></SettingsButton>
        <SettingsButton screen={null} title="Restrictions & Rules" icon={require(basePath + 'password.png')}></SettingsButton>
    </View>
}