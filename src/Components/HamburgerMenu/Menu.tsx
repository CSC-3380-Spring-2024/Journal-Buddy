import React from 'react';
import { Text, View, StyleSheet, FlatList, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import GeneralButtonLight from '../Buttons/GeneralButtonLight';
import { useNavigation } from '@react-navigation/native';
import { Inter_400Regular, useFonts } from '@expo-google-fonts/inter';

//Hamburger menu that shows all of the options for accessing other features of the app
//IMPORTANT!: When using this menu, wrap it with a view with the style "zIndex: (the largest zIndex on the page)" applied to it. It will not function otherwise!
//Additionally, it must be the FIRST element rendered.
export default function Menu(): React.JSX.Element {
    let [menuVisible, updateMenuVisible] = React.useState(false);
    const navigation = useNavigation();
    const [fontsLoaded] = useFonts({Inter_400Regular});
    let menuIcon = <Ionicons name="menu-sharp" size={50} color="black" style={{position: 'absolute'}} onPress={() => updateMenuVisible(!menuVisible)} />;

    let menu = (
        <View style={{zIndex: 1}}>
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    <Text style={styles.header}>
                        Journal Buddy
                    </Text>
                    <FlatList 
                        renderItem={
                            ({item}) => 
                                <GeneralButtonLight 
                                    containerStyle={styles.containterDimensions} 
                                    textStyle={styles.textStyle} 
                                    buttonText={item} 
                                    onPress={() => null}
                                />
                        }
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
const DATA = ["Log In", "Sign Up", "Journal", "Habit", "Calendar", "Settings"]

const styles = StyleSheet.create( {
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        fontFamily: "Inter_400Regular"
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
        marginBottom: 20,
        margin: 10
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