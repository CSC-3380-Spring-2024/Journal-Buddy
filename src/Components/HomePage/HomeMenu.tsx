import React from 'react';
import { Inter_400Regular, useFonts } from '@expo-google-fonts/inter';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, FlatList, Pressable} from 'react-native';
import GeneralButtonDark from '../Buttons/GeneralButtonDark';
import { Quotes} from '../../Types';
import { getAuth, signOut } from 'firebase/auth';
import GeneralButtonLight from '../Buttons/GeneralButtonLight';
import CheckboxButton from '../Buttons/CheckboxButton';
import { getDatabase, onValue, ref } from 'firebase/database'
import { Habit, addHabitTime, getHabitByID, getHabitsByCurrentUser } from '../../firebase/Database';
//import { FlatList } from 'react-native-gesture-handler';
// import { getapi } from '../../Quotes';


export default function HomeMenu({ navigation }: any) {
    //TODO: Add functions to do their respective tasks once they are implemented
    //TODO: Interface with the backend in order to save the user's response.
    let [DATA, setData] = React.useState([] as Habit[])
    //let [ data, setData ] = React.useState([] as Journal[])

    let [quote, updateQuote] = React.useState({q: 'haiii', a: '- T'});
    //let user = getAuth().currentUser?.uid;
    
    React.useEffect(() => {
        let ignore = false;
        async function getHabits(){
            getHabitsByCurrentUser().then((habits) => {
                if(!ignore){
                    setData(habits);
                }
            });
        }

        onValue(ref(getDatabase(), `users/${getAuth().currentUser?.uid}/habits`), (data) =>{
            getHabits();
        })
        return () => {ignore = true};
    }, []);
    const [fontsLoaded] = useFonts({Inter_400Regular});

    function UTCToTime(UTCms: number){
        return UTCms%86400000;
    }
    
    function HabitIsDone(habit : Habit): boolean {
        let currentDate: string = new Date().toDateString();
        let DaysDone =  habit.timesCompleted;
        if( DaysDone !== undefined){
            let timeKeys: string[] = Object.keys(DaysDone);
            //let lastDateDone: string = new Date(parseInt(timeKeys[timeKeys.length - 1])).toDateString(); //gets date of when it was last done
            let lastDone: number = Object.values(DaysDone[timeKeys[timeKeys.length - 1]])[0];
            
            //if they're same date, check for specific time slot
            if(currentDate === new Date().toDateString()){
                //let timesObject = Object.values(DaysDone);
                
                //get's latest habit time completed ... i think
                let recentTime: number = UTCToTime(Object.values(DaysDone[timeKeys[timeKeys.length - 1]])[0]);

                let timesToCompleteKeys: string[] = Object.keys(habit.timesToComplete);
                let i: number = 0;
                let currentTime = UTCToTime(Date.now());
                //keep going until it reaches just a past
                while(currentTime > Object.values(habit.timesToComplete[timesToCompleteKeys[i]])[0]){
                    i++;
                }

                let j: number = 0;
                while(recentTime > Object.values(habit.timesToComplete[timesToCompleteKeys[j]])[0]){
                    j++;
                }

                //if both times are in the same time slot to be done, then it's done
                return j===i;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } 
    

    async function getQuote(){
        const url:string ="https://zenquotes.io/api/random";
        const response = await fetch(url);
        let data = await response.json();
        let quotes: Quotes = data[0];
        updateQuote(quotes);
    }

    let [input, onChangeInput] = React.useState('');
    return (
        <SafeAreaView style={styles.overlord}>
            {/*<View style={{zIndex: 1}}>
                <Menu />
            </View>*/}
            <ScrollView style={styles.wrapper}>
                <View style={styles.container}>
                    <Text style={styles.header2}>
                            Hi, John!
                    </Text>
                    <View style={styles.headerWrapper}>
                        <Text style={styles.header2}>
                            {"\"" + quote.q + "\""}
                        </Text>
                        <Text style={styles.prompt}>
                            {"-" + quote.a}
                        </Text>
                    </View>
                    <View>
                        <Text>
                            {new Date().toDateString()}
                        </Text>
                    </View>
                    
                    <View style = {styles.buttonBox}>
                        {/* <GeneralButton buttonText={"Start Today's Entry"} onPress = {() => null}/> */}
                        <GeneralButtonDark onPress={() => navigation.navigate("NewJournal")} buttonText="Start Today's Entry" textStyle={styles.buttonText} containerStyle={styles.button}/>
                    </View>
                    <View>
                        <Text style={styles.header2}>
                            Today's Task
                        </Text>
                    </View>
                    <View style = {styles.habitBox}>
                        {   DATA.length > 0 ?
                            DATA.map((item, index) => {
                            return <CheckboxButton  onPress={() => {
                                    if(HabitIsDone(item)){
                                        console.log("Habit is done today, switch to not done");
                                        
                                        //item.daysCompleted?.push(new Date().toDateString());
                                        //add logic to update database
                                    } else {
                                        console.log("habit was not done, changing to completed");
                                        //item.daysCompleted?.pop();w
                                        addHabitTime(item.uid);
                                    }}} buttonText={(item.uid === undefined)? "Brush teeth" : item.title} containerStyle={styles.checkButton} checked = {HabitIsDone(item)} key = {index + ""}/>;
                            }) : <Text>:c</Text>
                        }
                    </View>

                    <View>
                    {/* <GeneralButtonLight buttonText='refresh' onPress={()=> getHa}></GeneralButtonLight> */}
                    </View>
                    <GeneralButtonDark onPress={ () => signOut(getAuth()) } buttonText='Sign Out'/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    container: {
        flex: 1,
        zIndex: 0,
        alignItems: 'center'
    },
    header: {
        fontSize: 30,
        // fontWeight: 'bold',
        color: 'black',
    },
    headerWrapper: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: '#f2f9ff',
        flex:1
    },
    header2: {
        fontSize: 20,
    },
    prompt: {
        fontSize: 15,
        color: 'black',
        padding: 10,
    },
    top: {
        fontSize: 30,
        // flexDirection: 'row',
        padding: 5,
        alignItems: 'center'
    },
    buttonBox:{
        width:'100%',
        alignItems:'center'
    },
    button: {
        height: 50,
        width: '90%',
        margin: 10,
        borderRadius: 12,
        flexDirection:'row',
    },
    checkButton:{
        height: 50,
        width: '90%',
        margin: 10,
        borderRadius: 12,
        justifyContent:'flex-start'
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center'
    },
    habitBox:{
        borderWidth:1,
        borderRadius: 12,
        width:'90%',
        height:400,
        alignItems:'center'
    },
    overlord: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: 'white',
        flex: 1,
        fontFamily: "Inter_400Regular"
    }
}
)