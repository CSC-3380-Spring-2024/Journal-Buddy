import DailyPrompt from './src/Components/Journal-Pages/DailyPrompt';
import { Image, SafeAreaView, View } from 'react-native';
import React from 'react';
import JournalEntries from './src/Components/Journal-Pages/JournalEntries';
import CheckboxButton from './src/Components/Buttons/CheckboxButton';
import GeneralButtonDark from './src/Components/Buttons/GeneralButtonDark';
import GeneralButtonLight from './src/Components/Buttons/GeneralButtonLight';
import HomeMenu from './src/Components/HomePage/HomeMenu';

//TODO: Allow each page to change the currentPage state in order to switch which page is being displayed.
//TODO: Create bottom taskbar
export default function App() {
  var [currentPageID, setCurrentPage] = React.useState(2);
  let currentPage: React.JSX.Element = <View />;

  switch(currentPageID){
    case 0: currentPage = <DailyPrompt />; break;
    case 1: currentPage = <JournalEntries />; break;
    case 2: currentPage = <HomeMenu/>; break;
    default: currentPage = <DailyPrompt />;
  }
  return (
      currentPage
  );
  
}