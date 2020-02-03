import React, { useRef, useState } from 'react';
import { RNCamera } from 'react-native-camera';
import { View, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import Text, { ColoredText } from './common/Text';
import { useNavigation } from 'react-navigation-hooks';

const ActionButton = ({ color, bgcolor, children, onPress }) => {
  return <TouchableOpacity style={{...styles.actionButton, backgroundColor: bgcolor}} onPress={onPress}>
    <ColoredText color={color} style={{ fontWeight: 'bold' }}>{children}</ColoredText>
  </TouchableOpacity>
}

async function putAction(barcode) {
  const FUNCTIONS_BASE_URL = 'https://us-central1-cookie-jar-c7a3a.cloudfunctions.net/';
  // const FUNCTIONS_BASE_URL = '192.168.1.105:5001/cookie-jar-c7a3a/us-central1/iotFinishJob';
  try {
    const resp = await fetch(`${FUNCTIONS_BASE_URL}iotAction?actionType=put&barcode=${barcode}`);
    const content = await resp.json();
    if (content.status === 'error') {
        ToastAndroid.show(content.result.toString() || 'unknown error', ToastAndroid.BOTTOM);
        return false;
    }
    return true;
  } catch (error) {
    ToastAndroid.show(error.result, ToastAndroid.BOTTOM);
    return false;
  }
}

const BarcodeSelectedScreen = ({ barcode, onAccept, onCancel, onRetry }) => {

  return <View style={styles.container}>
    <Image source={require('../../assets/images/scan.png')} style={{ width: 200, height: 200, alignSelf: "center", marginTop: 100 }}></Image>
    <Text style={{ alignSelf: 'center', fontWeight: 'bold', flex: 1 }}>{barcode}</Text> 
    <View style={{ height: 50, flexDirection: 'row' }}>
      <ActionButton color="white" bgcolor="#0FCD79" onPress={() => onAccept()}>Accept</ActionButton>
      <ActionButton color="black" bgcolor="white" onPress={() => onRetry()}>Try Again</ActionButton>
      <ActionButton color="white" bgcolor="#F32E30" onPress={() => onCancel()}>Cancel</ActionButton>
    </View>
  </View>
}

export default function () {
  const camera: any = useRef(null);
  const [barcode, setBarcode] = useState(null);
  const navigation = useNavigation();

  function onRead(results) {
    if (results.data != null) {
      setBarcode(results.data);
    }
    return;
  }

  if (barcode) {
    return <BarcodeSelectedScreen barcode={barcode}
      onAccept={async () => {
        if (await putAction(barcode)) {
          navigation.navigate('SnackList');
        }
      }}
      onCancel={() => {
        navigation.navigate('SnackList');
      }}
      onRetry={() => setBarcode(null)}
    ></BarcodeSelectedScreen>
  }

  return <View style={styles.container}>
    <RNCamera
      ref={camera}
      flashMode={camera.flashMode}
      onBarCodeRead={onRead}
      captureAudio={false}
      // onFocusChanged={() => {}}
      // onZoomChanged={() => {}}
      style={styles.preview}
      type={camera.type}
    />
  </View>;
}

const styles = {
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
};
