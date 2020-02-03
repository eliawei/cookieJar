'use strict';
import React, { PureComponent, Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';



 export default class BarcodeScannerScreen2 extends Component {

    camera: any;
    renderBarcode = ({ bounds, data }) => (
        <React.Fragment key={data + bounds.origin.x}>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 10,
              position: 'absolute',
              borderColor: '#F00',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: 10,
              ...bounds.size,
              left: bounds.origin.x,
              top: bounds.origin.y,
            }}
          >
            <Text style={{
              color: '#F00',
              flex: 1,
              position: 'absolute',
              textAlign: 'center',
              backgroundColor: 'transparent',
            }}>{data}</Text>
          </View>
        </React.Fragment>
      );
        state = {
          barcodes: [],
        }
      barcodeRecognized =()=>{console.warn(this.type)};
    render() {
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: 'black',
            },
            preview: {
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
            capture: {
                flex: 0,
                backgroundColor: '#fff',
                borderRadius: 5,
                padding: 15,
                paddingHorizontal: 20,
                alignSelf: 'center',
                margin: 20,
            },
        });
        return (
            <View style={styles.container}>

                <RNCamera
                    ref={(ref: any) => {
                        this.camera = ref;
                    }}
                    style={{
                        flex: 1,
                        width: '100%',
                    }}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    onBarCodeRead={this.barcodeRecognized}
                >
                </RNCamera>
            </View>
        );
    }
}
