import DailyPrompt from './src/Components/Journal-Pages/DailyPrompt';
import { Image, SafeAreaView, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeMenu from './src/Components/HomePage/HomeMenu';
import Menu from './src/Components/HamburgerMenu/Menu';
import JournalEntries from './src/Components/Journal-Pages/JournalEntries';
import { FontAwesome5 } from '@expo/vector-icons';

//TODO: Allow each page to change the currentPage state in order to switch which page is being displayed.
//TODO: Create bottom taskbar

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function TabGroup() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: (focused: boolean, color: string, size: number) => {
          let iconName;
          if (route.name === "Home")
            iconName = "home";
          else if (route.name === "NewJournal")
            iconName = "plus-square";
          else if (route.name === "Calendar")
            iconName = "calendar";

          return (<FontAwesome5 name={iconName} size={size} color={color} />);
        }
      })}
      
    >
      <Tab.Screen name="Home" component={HomeMenu}/>
      <Stack.Screen name="NewJournal" component={DailyPrompt} />
      <Tab.Screen name="Calendar" component={HomeMenu}/>
    </Tab.Navigator>
  );
}

function HomeStack() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabGroup} />
    </Stack.Navigator>
  );
}

function DrawerGroup() {
  return(
    <Drawer.Navigator initialRouteName='HomeStack'>
      <Stack.Screen name="HomeStack" component={HomeStack} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return(
    <NavigationContainer>
      <DrawerGroup />
    </NavigationContainer>
  );
}