import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Linking, Button, TouchableHighlight } from 'react-native';



type MyProps = {name:string,barCode:number,calories:number ,image:string, cancelPress: Function};/*props*/
type MyState = { colors: Array<string>, index: number, visible: boolean };/*state props*/

export default class SnackPage extends Component<MyProps,MyState> {


    render(){
     return(
                
                <View style={styles.container}>
                  
                  <View style={{flex:7}}>
                    
                    <View style={{flex:2, justifyContent:'flex-start'}}>
                      
                      <Image
                      style={{ flex: 1,width: undefined, height: undefined}}
                      source={{uri: this.props.image}}
                     />
                    </View>
                    <View style={{flex: 3}}>
                      <View style={{flex: 1}}>
                         <Button onPress={()=>{}} title="Eat me!"/>
                      </View>
                      <View style={{flex: 2}}>
                        <Button onPress={()=>this.props.cancelPress()} title="Cancel"/>
                      </View>
                      
                    </View>
                  </View>    
              
                  <View style={{flex:5,justifyContent:'flex-start'}}>
                  <Text>{this.props.name}</Text> 
                    
                    <View>
                      <Text>Barcode: {this.props.barCode}</Text>
                    </View>
                    <View>
                      <Text>Calories: {this.props.calories}</Text>
                    </View>
                  </View>

                </View>

    );
}

    
};

const styles = StyleSheet.create({
    container: {
        flex: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10
       },
       header: {
        flex: 0.1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around'}
       
});