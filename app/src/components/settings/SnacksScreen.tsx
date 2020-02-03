import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, StatusBar, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { ColoredText } from '../common/Text';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from 'react-navigation-hooks';

const BGCOLOR = 'darkblue';
const LIST_COLORS = [
    '#FFC34E',
    '#FB5607',
    '#FF006E',
    '#23EA26',
    '#3A86FF'
]

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
    },
    snackItem: {
        marginVertical: 5,
        height: 75,
        width: '100%',
        flexDirection: 'row',
        borderWidth: 2,
        overflow: 'hidden',
    },
    snackImage: {
        width: 75,
        height: 75
    },
    snackInfo: {
        justifyContent: 'center',
        paddingHorizontal: 10
    }
});

const SnackItem = ({ snack, color }) => {
    const navigation = useNavigation();
    return <TouchableOpacity onPress={() => navigation.navigate('SnackInfoSettings', {snackId: snack.id, color})} style={{ ...styles.snackItem, backgroundColor: color, borderColor: color}}>
        <>
            <Image source={{ uri: snack.image }} style={styles.snackImage} />
            <View style={styles.snackInfo}>
                <ColoredText color="white" style={{fontSize: 18, fontFamily: 'FiraSans-Bold'}}>{snack.name}</ColoredText>
            </View>
        </>
    </TouchableOpacity>;
}

export default function () {
    const [snacks, setSnacks] = useState([]);

    const snacksCollectionRef = firestore().collection('snacks');

    useEffect(() => {
        return snacksCollectionRef.onSnapshot(querySnapshot => {
            const docs = [];
            querySnapshot.forEach(doc => {
                docs.push({
                    id: doc.id,
                    ...doc.data()
                });
            })
            setSnacks(docs);
        });
    }, []);

    return <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={BGCOLOR} />
        <View style={styles.imageView}>
            <ColoredText color="white">Snacks</ColoredText>
            <Image style={styles.profileImage} source={require('../../../assets/images/chocolate.png')}></Image>
        </View>
        <View style={styles.detailsView}>
            <ScrollView>
            <FlatList
                data={snacks}
                renderItem={({ item }) => <SnackItem snack={item} color={LIST_COLORS[snacks.indexOf(item) % LIST_COLORS.length]} />}
                keyExtractor={item => item.id}
            />
            </ScrollView>
        </View>
    </View>
}
