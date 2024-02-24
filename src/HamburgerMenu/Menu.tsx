import React from 'react';
import { Text, View, StyleSheet, FlatList, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import MenuButton from '../Components/Buttons/GeneralButtonLight'
import GeneralButtonDark from '../Components/Buttons/GeneralButtonDark';
import GeneralButtonLight from '../Components/Buttons/GeneralButtonLight';


//Hamburger menu that shows all of the options for accessing other features of the app
//IMPORTANT!: When using this menu, wrap it with a view with the style "zIndex: (the largest zIndex on the page)" applied to it. It will not function otherwise!
//Additionally, it must be the FIRST element rendered.
export default function Menu(): React.JSX.Element {
    let [menuVisible, updateMenuVisible] = React.useState(false);

    let menuIcon = <Ionicons name="menu-sharp" size={50} color="black" style={{position: 'absolute'}} onPress={() => updateMenuVisible(!menuVisible)} />;

    let menu = (
        <View style={{zIndex: 1}}>
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    <Text style={styles.header}>
                        Journal Buddy
                    </Text>
                    <FlatList 
                        renderItem={({item}) => <GeneralButtonLight containerStyle={styles.containterDimensions} textStyle={styles.textStyle} buttonText={item} onPress={() => console.log("hello!")}/>}
                        data={DATA}
                    />
                </View>
                <Pressable style={{backgroundColor: '#00000050', flex: .75}} onPress={() => updateMenuVisible(!menuVisible)}/>
                {menuIcon}
            </View>
        </View>);

    return menuVisible ? menu: menuIcon;
}

//Array of strings that will be the title of the buttons
//TODO: Figure out a different system for this because it sucks 👎
const DATA = ["test.", "test.", "test.", "test."]

const styles = StyleSheet.create( {
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
    },
    container: {
        flexDirection: 'column',
        alignItems: 'baseline',
        backgroundColor: 'white',
        borderBottomColor: 'black',
        height: 1000,
        flex: 1,
    },
    containterDimensions: {
        flex: 1,
        flexBasis: 75,
        marginBottom: 20
    },
    textStyle: {
        fontSize: 20,
    },
    header: {
        fontSize: 25,
        paddingLeft: 50,
        marginBottom: 20 
    }
})