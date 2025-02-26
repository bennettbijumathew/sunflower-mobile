import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Timestamp, collection, doc, onSnapshot, query, updateDoc, where } from '@firebase/firestore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Planner } from '../interfaces/plannerInterface';
import { Task } from '../interfaces/taskInterface';
import { useEffect, useRef, useState } from 'react';
import { database } from '../firebaseConfig';
import { days } from '../arrays/days';
import { months } from '../arrays/months';

export default function TaskRow(task: Task) {
    const [plannerList, setPlannerList] = useState<Planner[]>([])
    const swipeableRef = useRef<SwipeableMethods>(null);

    useEffect(() => {
        // The query asks to see planners matches the tasks' planner list.
        const q = query(collection(database, 'planners'), where('__name__', 'in', task.planners))

        // Using the query, onSnapshot() listens to changes within the document.
        onSnapshot(q, (querySnapshot) => {
            setPlannerList([]);

            // Adds a planners to the planners list.
            querySnapshot.forEach((doc) => {
                setPlannerList((previous) => [...previous, {
                    id: doc.id, 
                    name: doc.data().name, 
                    color:  doc.data().color, 
                    visible: doc.data().visible
                }]);
            });
        });
    }, []);

    // This function completes a task and closes the swipeable element.
    const completeTask = () => {
        const ref = doc(database, 'tasks', task.id);

        if (swipeableRef.current) {
            // Closes the swipeable element.
            swipeableRef.current.close();

            // Updates the complete value of the tasks in Firestore.
            updateDoc(ref, {
                complete: !task.complete
            });
        }
    };
    
    // This function creates a delete button. 
    const renderDeleteButton = () => {       
        return (
            <View style={styles.delete}>
                <TouchableOpacity onPress={completeTask} style={styles.deleteButton}>
                    <MaterialCommunityIcons name='check' size={30} color='black'/>
                </TouchableOpacity>
            </View>
        );
    }
   
    return (
        <GestureHandlerRootView key={task.id}>   
            <ReanimatedSwipeable ref={swipeableRef} renderRightActions={renderDeleteButton} childrenContainerStyle={styles.row}>
                <View style={styles.details}> 
                    <Text style={styles.title}> {task.name} </Text>
                    <Text style={styles.subTitle}> {days[task.date.getDay()]}, {task.date.getDate()} {months[task.date.getMonth()]} {task.date.getFullYear()} </Text>
                </View>
 
                <View style={styles.planners}>
                    <View style={styles.plannersRow}>
                        {
                            // This prints the tasks' first to fourth planners in a grid.  
                            plannerList.slice(0, 3).map((item) => (
                                <View style={[styles.planner, {backgroundColor: item.color}]} key={item.id}>
                                    <Text> {item.name[0].toUpperCase()} </Text>
                                </View>
                            ))
                        }
                    </View>

                    <View style={styles.plannersRow}>
                        {
                            // This prints the tasks' fifth to eigth planners in a grid.  
                            plannerList.slice(4, 7).map((item) => (
                                <View style={[styles.planner, {backgroundColor: item.color}]} key={item.id}>
                                    <Text> {item.name[0].toUpperCase()} </Text>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </ReanimatedSwipeable>
        </GestureHandlerRootView> 
    )
}

const styles = StyleSheet.create({
    row: {
        backgroundColor: '#f7f0e6',

        marginTop: 8,
        marginBottom: 5,

        borderWidth: 1,
        borderBottomWidth: 4,

        padding: 10,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    details: {
        justifyContent: 'center',
        flex: 2,
    },
  
    title: {
        fontSize: 16,
        fontWeight: 800
    },

    subTitle: {
        fontSize: 14,
        fontWeight: 400
    },

    planners: {
        display: 'flex',

        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },

    plannersRow: {
        flexDirection: 'row'
    },

    planner: {
        height: 25,
        width: 25,

        margin: 2,

        borderWidth: 1,
        borderBottomWidth: 2,

        textAlign: 'center',

        alignItems: 'center'
    },

    delete: {
        backgroundColor: '#f56767',

        width: 80,

        marginTop: 8,
        marginBottom: 5,

        borderWidth: 1,
        borderBottomWidth: 4,

        padding: 10
    },

    deleteButton: {
        justifyContent: 'center', 
        alignItems: 'center',

        height: '100%',
        width: '100%'
    }
});