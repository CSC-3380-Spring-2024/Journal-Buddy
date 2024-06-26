import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import GeneralButtonDark from '../Buttons/GeneralButtonDark';
import { getAuth, signOut } from 'firebase/auth';
import CheckboxButton from '../Buttons/CheckboxButton';
import { getDatabase, onValue, ref } from 'firebase/database'
import { Habit, addHabitTime, removeHabitTime, getHabitsByCurrentUser } from '../../firebase/Database';
import { time } from 'console';
import { DailyContext } from '../../../App';
import { UTCToTime, UTCMidnight, isSameUTCDay, daysOfWeek} from '../times';
import { it } from 'node:test';
//import { FlatList } from 'react-native-gesture-handler';
// import { getapi } from '../../Quotes';


export default function HomeMenu({ navigation }: any) {
    //TODO: Add functions to do their respective tasks once they are implemented
    //TODO: Interface with the backend in order to save the user's response.
    let [DATA, setData] = React.useState([] as Habit[])
    //let [ data, setData ] = React.useState([] as Journal[])
    let days:string[] = ["sunday", "monday", "tuesday", "wednsday", "thursday", "friday", "sunday"];

    const daily = React.useContext(DailyContext);
    //let user = getAuth().currentUser?.uid;
    
    React.useEffect(() => {
        let ignore = false;
        async function getHabits(){
            getHabitsByCurrentUser().then((habits) => {
                if(!ignore){
                    let todaysHabits: Habit[] = [];
                    let currentDay:string = daysOfWeek[new Date().getDay()];
                    console.log(currentDay);
                    habits.forEach(function (i) {
                        if(i.timesToComplete !== undefined && i.timesToComplete[currentDay] !== undefined){
                            todaysHabits.push(i);
                        }
                        
                    });
                    console.log("finished processing");
                    //console.log(todaysHabits);
                    setData(todaysHabits);
                }
            });
        }

        onValue(ref(getDatabase(), `users/${getAuth().currentUser?.uid}/habits`), () =>{
            getHabits();
        })
        return () => {ignore = true};
    }, []);


    

    
    function HabitIsDoneCurrently(habit : Habit): boolean {
        if(habit.lastTimeComplete === undefined){
            return false;
        }

        //find the timeSlots the timestamp is in between
        let timestamp:number = Date.now();
        let date:Date = new Date(timestamp);
        let timeSlots: number[] = Object.values(habit.timesToComplete[daysOfWeek[date.getDay()]]).sort();

        let i: number = 0;
        let timeOfDayUTC:number = UTCToTime(timestamp);
        while(timeSlots[i] < timeOfDayUTC){
            i++;
        }

        //not allowed to do habit yet if it's before the first allowed time
        if(i === 0){
            console.log("not yet");
            return false;
        }

        return HabitTimeslotDone(habit, timestamp, i - 1, (i === timeSlots.length) ? 86399999 + UTCMidnight(timestamp): timeSlots[i] + UTCMidnight(timestamp));


    }

    //timestamp: UTC timestamp (whether current time or on calender a "fake" timestamp of a timeslot the habit checkbox represents)
    //2 UTC bounds to check for a time between beginning and end. *remember to convert time of day to full UTC
    function HabitTimeslotDone(habit: Habit, timestamp: number, earliestCanComplete: number, latestCanComplete: number):boolean{
        let timeKey = searchHabitTime(habit, timestamp, earliestCanComplete, latestCanComplete);
        return timeKey !== undefined ? true : false;
        // if(habit.timesCompleted === undefined){
        //     return false;
        // }
        // let datekey : string = UTCMidnight(timestamp) + '';

        // if(habit.timesCompleted[datekey] !== undefined){
        //     let times: number[] = Object.values(habit.timesCompleted[datekey]);
        //     //to ensure it's all sorted
        //     times = times.sort();
        //     let i: number = 0;
        //     //could do binary search ideally later but nah :3
        //     //find first time slot that is at or after earliest time you can complete the habit
        //     while(times[i] < earliestCanComplete){
        //         i++;
        //     }

        //     //no slot found :(
        //     if(i === times.length){
        //         return false;
        //     } else {
        //         return (times[i] < latestCanComplete);
        //     }
        // } else {
        //     return false;
        // }
    }

    function searchHabitTime(habit: Habit, timestamp: number, earliestCanComplete: number, latestCanComplete: number):string|undefined{
        if(habit.timesCompleted === undefined){
            return undefined;
        }
        let datekey : string = UTCMidnight(timestamp) + '';

        if(habit.timesCompleted[datekey] !== undefined){
            
            // let objects = Object.entries(habit.timesCompleted);
            let times = habit.timesCompleted[datekey];
            for (let key in times) {
                let value : number = times[key];
                if (value >= earliestCanComplete && value < latestCanComplete) {
                    return key; // Return the key if value is within the range
                }
            }
            return undefined;
        } else {
            return undefined;
        }
    }

    function getRemoveKey(habit: Habit, timestamp: number){
        if(habit.lastTimeComplete === undefined){
            console.log("Error with removing habit. No latest time log found");
            return;
        }
        //find the timeSlots the timestamp is in between
        
        let date:Date = new Date(timestamp);
        let timeSlots: number[] = Object.values(habit.timesToComplete[daysOfWeek[date.getDay()]]).sort();
        
        let i: number = 0;
        let timeOfDayUTC:number = UTCToTime(timestamp);
        while(timeSlots[i] < timeOfDayUTC){
            i++;
        }

        //not allowed to do habit yet if it's before the first allowed time
        if(i === 0){
            console.log("Premature removal");
            return;
        }
        let dateKey = searchHabitTime(habit, timestamp, i - 1, (i === timeSlots.length) ? 86399999 + UTCMidnight(timestamp): timeSlots[i] + UTCMidnight(timestamp));
        
        return dateKey;
    }
    

    let [input, onChangeInput] = React.useState('');
    return (
        <SafeAreaView style={styles.overlord}>
            {/*<View style={{zIndex: 1}}>
                <Menu />
            </View>*/}
            <ScrollView style={styles.wrapper}>
                <View style={styles.container}>
                    <View style={styles.headerWrapper}>
                        <Text style={styles.header2}>
                            {"\"" + daily.quote.q + "\""}
                        </Text>
                        <Text style={styles.prompt}>
                            {"-" + daily.quote.a}
                        </Text>
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
                                    if(HabitIsDoneCurrently(item)){
                                        console.log("Habit is done today, switch to not done");
                                        let timestamp:number = Date.now();
                                        let key = getRemoveKey(item, timestamp);
                                        if(key !== undefined){
                                            removeHabitTime(item, key, UTCMidnight(timestamp), timestamp);
                                        } else {
                                            console.log("No worky :(");
                                        }
                                        //uncomment later when you have habiti time removal done
                                        //item.lastTimeComplete = undefined;
                                        //add database logic later :3
                                    } else {
                                        console.log("habit was not done, changing to completed");
                                        let timestamp: number = Date.now();
                                        
                                        addHabitTime(item, timestamp);
                                        
                                    }}} buttonText={(item.uid === undefined)? ":c" : item.title} containerStyle={styles.checkButton} checked = {HabitIsDoneCurrently(item)} key = {index + ""}/>;
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
        color: '#050B24',
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 40 : 0,
        backgroundColor: 'white',
        flex: 1,
    }
}
)