import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, StatusBar, TextInput, Picker, FlatList, TouchableOpacity, PermissionsAndroid } from 'react-native';
import Text, { ColoredText } from '../common/Text';
import firestore from '@react-native-firebase/firestore';
import storage, {firebase} from '@react-native-firebase/storage';
import useDebounce, { uriToBlob } from '../common/utils';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from 'react-navigation-hooks';
import { SettingsLabel, SettingsTextInput } from '../common/Input';
import ImagePicker from 'react-native-image-picker';

const BGCOLOR = 'darkblue';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        // backgroundColor: 'gray'
    },
    imageView: {
        flex: 1,
        alignItems: 'center'
    },
    snackImage: {
        marginTop: 15,
        width: 140,
        height: 140,
        borderRadius: 10
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
    snackInfo: {
        justifyContent: 'center',
        paddingHorizontal: 10
    }
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function uploadToFirebase(blob) {
    return new Promise((resolve, reject) => {
        const storageRef = storage().ref();
        try {
            const child = storageRef.child(`uploads/${uuidv4()}.png`);
            const uploadTask = child.put(blob);
            uploadTask.then(snapshot => {
                child.getDownloadURL().then(url => resolve(url));
            })
    } catch (err) {
        reject(err);
    }
    })
    
}

async function requestPermission(permision, permissionName, explanation) {
  try {
    const granted = await PermissionsAndroid.request(
      permision,
      {
        title: `CookieJar ${permissionName} Permission`,
        message:
          `CookieJar needs access to your ${permissionName.toLowerCase()} ` +
          explanation,
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
    } else {
        throw Error('permission denied');
    }
  } catch (err) {
      console.warn(err);
      throw err;
  }
}
  

export default function () {
    const navigation = useNavigation();
    const [snack, setSnack] = useState();
    const snackId = navigation.getParam('snackId');

    const snackRef = firestore().collection('snacks').doc(snackId);

    useEffect(() => {
        return snackRef.onSnapshot(doc => {
            setSnack({
                id: doc.id,
                ...doc.data()
            });
            
        });
    }, []);

    async function updateSnack(field, value) {
        if (value) {
            await snackRef
               .update({
                [field]: value
              });
        }
    }

    async function onImagePress() {
        await requestPermission(PermissionsAndroid.PERMISSIONS.CAMERA, 'Camera', 'so you can take a photo of your snacks');
        await requestPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, 'Read files', 'so you can upoad snack images');
        const options = {
            title: 'Select Snack Image',
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
          };
          
          /**
           * The first arg is the options object for customization (it can also be null or omitted for default options),
           * The second arg is the callback which sends object: response (more info in the API Reference)
           */
          ImagePicker.showImagePicker(options, async (response) => {
          
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
                const blobResp = await fetch(response.uri);
                const blob = await blobResp.blob();

                const url = await uploadToFirebase(blob);
                updateSnack('image', url);
            }
          });
    }

    if (!snack) {
        return <></>;
    }

    return <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={navigation.getParam('color', BGCOLOR)} />
        <View style={{ ...styles.imageView, backgroundColor: navigation.getParam('color', BGCOLOR) }}>
            <ColoredText color="white">{snack.name}</ColoredText>
            <TouchableOpacity onPress={onImagePress}><Image style={styles.snackImage} source={{uri: snack.image}}></Image></TouchableOpacity>
        </View>
        <View style={styles.detailsView}>
            <SettingsLabel>Barcode</SettingsLabel>
            <Text style={{marginBottom: 10, marginLeft: 10}}>{snack.id}</Text>

            <SettingsLabel>Name</SettingsLabel>
            <SettingsTextInput value={snack.name} placeholder="enter a name" onChange={value => updateSnack('name', value)}></SettingsTextInput>

            <SettingsLabel>Calories</SettingsLabel>
            <SettingsTextInput value={snack.calories} keyboardType="number-pad" placeholder="enter calories" onChange={value => updateSnack('calories', value)}></SettingsTextInput>

        </View>
    </View>
}

