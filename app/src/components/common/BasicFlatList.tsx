/*
Mr Nguyen Duc Hoang
https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
FlatList Component with Images
*/
import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View, Image,TouchableHighlight } from 'react-native';




class FlatListItem extends Component<{item:any, index:any, itemOnPress:Function},{}> {
  
  
  
    render() {          
        return (        
            <View style={{
                flex: 1,
                flexDirection:'column',                                
            }}>            
                <View style={{
                        flex: 1,
                        flexDirection:'row',
                        backgroundColor: 'green',
                        justifyContent: 'center'
                }}>
                    <TouchableHighlight onPress={()=>this.props.itemOnPress(this.props.item)}>
                      <Image 
                          source={{uri: this.props.item.image}}
                          style={{width: 100, height: 100, margin: 5}}
                      />
                    </TouchableHighlight>      
                </View>
                <View style={{
                    height: 1,
                    backgroundColor:'white'                            
                }}>
            
                </View>
          </View>
        );
    }
}
const styles = StyleSheet.create({
    flatListItem: {
        color: 'white',
        padding: 10,
        fontSize: 16,  
    }
});

 export default class BasicFlatList extends Component<{flatListData:Array<any>,onPress:Function},{}> {
    render() {
      return (
        <View style={{flex: 1, marginTop: 22}}>
            <FlatList 
                data={this.props.flatListData}
                renderItem={({item, index})=>{
                    return (
                    <FlatListItem item={item} index={index} itemOnPress={this.props.onPress}>

                    </FlatListItem>);
                }}
                >

            </FlatList>
        </View>
      );
    }
}