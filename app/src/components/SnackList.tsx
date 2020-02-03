import React, {Component, useState, useEffect} from 'react';

import { StyleSheet, View, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';

import Text, { ColoredText } from './common/Text';
import { useNavigation } from 'react-navigation-hooks';


const FUNCTIONS_BASE_URL = 'https://us-central1-cookie-jar-c7a3a.cloudfunctions.net/';

const styles = StyleSheet.create({
    topSection: {
        flex: 1,
    },
    titleBar: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    welcomeHeader: {
        fontSize: 26,
        textAlign: 'center',
        flex: 1
    },
    settingsIcon: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
    dial: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    snackSection: {
        flex: 2,
        backgroundColor: '#ddd',
        paddingVertical: 7,
        flexWrap: "wrap",
        flexDirection: 'row'
    },
    snackItem: {
        flexDirection: 'row',
        width: '50%',
        height: '100%',

        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
        maxHeight: '50%'
    },
    snackImage: {
        alignSelf: 'stretch',
        // aspectRatio: 1,
        // height: '100%',
        flex: 1,

        backgroundColor: '#aaa',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#bbb',
        overflow: 'hidden'
    },
    snackDescription: {
        flex: 1,
        // height: 105,
        marginStart: 10
    },
    emptyState: {
        flex: 1,
        // alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addSnack: {
        borderRadius: 100,
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'green',
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center'
    }

});


interface ISnackListProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

function handlePress() {
    ToastAndroid.show('aaa', ToastAndroid.BOTTOM);
}

function handleGetItem(helixId) {
    fetch(`${FUNCTIONS_BASE_URL}iotAction?actionType=get&helixIndex=${helixId}`)
        .then(resp => resp.json())
        .then(respJson => {
            if (respJson.status === 'error') {
                ToastAndroid.show(respJson.result, ToastAndroid.BOTTOM);
            }
        })
        .catch(error => {
            ToastAndroid.show(error, ToastAndroid.BOTTOM);
        })
}

export default function SnackList({ navigation }) {

    const [currentUser, setCurrentUser] = useState();
    const [machine, setMachine] = useState();
    const [snackMap, setSnackMap] = useState();

    const machineRef = firestore().collection('machines').doc('o5AkuMpP2Vb2bpQvGx70');
    const userRef = firestore().collection('users').doc('benbs93@gmail.com');

    useEffect(() => {
        return userRef.onSnapshot(doc => {
            const user =  doc.data();

            setCurrentUser(user);
        });
    }, []);

    useEffect(() => {
        return machineRef.onSnapshot(querySnapshots => {
            const machine = querySnapshots.data();
            setMachine(machine);
            
            const snackPromises = Object.values<any[]>(machine.inventory)
            .filter(items => items && items.length)
            .map(items => items && items.length && items[0].get());
            
            
            const snackMap = {};
            Promise.all(snackPromises).then(results => {
                for (let snack of results) {
                    snackMap[snack.id] = snack.data();
                }
                setSnackMap(snackMap);
            })
        })
    }, []);

    if (!machine || !currentUser || !snackMap) {
        return <Text>loading...</Text>;
    }

    const inventoryEntries = Object.entries <any[]>(machine.inventory)
        .filter(([_, helixItems]) => helixItems && helixItems.length)
        .map(([helixId, helixItems]) => [helixId, snackMap[helixItems[0].id]])
        .filter(([helixId, item]) => item);
    

    return <>
        <View style={styles.topSection}>
            <View style={styles.titleBar}>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Image 
                        style={styles.settingsIcon}
                        source={require('../../assets/images/settings.png')}
                    ></Image>
                </TouchableOpacity>
                <Text style={styles.welcomeHeader}>Welcome, {currentUser.name}</Text>
            </View>
            <View style={styles.dial}>
                <Image
                    style={{resizeMode: 'center'}}
                    source={require('../../assets/images/dial.png')}>
                </Image>
            </View>
        </View>
        <View style={styles.snackSection}>
            {inventoryEntries.length ? inventoryEntries.map(([idx, snack]) => (
                <TouchableOpacity style={styles.snackItem} key={idx} onPress={() => handleGetItem(idx)}>
                    <View style={styles.snackImage}>
                        <Image
                            style={{ flex: 1, width: undefined, height: undefined }}
                            resizeMode="cover"
                            source={{ uri: snack.image }}
                        />
                    </View>
                    {/* <View style={styles.snackDescription}>
                        <Text style={{ fontSize: 20 }}>{snack.name}</Text>
                        <Text style={{ fontSize: 12 }}>{snack.description}</Text>
                    </View> */}
                </TouchableOpacity>
            )) : 
                <View style={styles.emptyState}>
                    <Image source={require('../../assets/images/cookie.png')}
                        style={{width: 200, height: 200, marginBottom: 20}}></Image>
                    <Text>Your Jar is empty!</Text>
                    <Text>Add Candies</Text>
                </View>
            }

            <TouchableOpacity style={styles.addSnack} onPress={() => navigation.navigate('Scanner')}><ColoredText color="white" style={{fontSize: 50}}>+</ColoredText></TouchableOpacity>
        </View>

    </>;
}