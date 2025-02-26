import { Timestamp, collection, onSnapshot, query, where } from '@firebase/firestore';
import { FlatList, View, Text } from 'react-native';
import { Task } from '../interfaces/taskInterface';
import { database } from '../firebaseConfig';
import { useEffect, useState } from 'react';
import TaskRow from '../components/taskRow';

export default function TaskList() {
    const [completeTasks, setCompleteTasks] = useState<Task[]>([])
    const [incompleteTasks, setIncompleteTasks] = useState<Task[]>([])
    const [visiblePlanners, setVisiblePlanners] = useState<string[]>([]);

    useEffect(() => {
        // The querys asks to see planners that are set to visible.
        const q = query(collection(database, 'planners'), where('visible', '==', true))

        // Using the query, onSnapshot() listens to changes within the document.
        onSnapshot(q, (querySnapshot) => {
            setVisiblePlanners([]);

            // Adds a planners to the visible planners.
            querySnapshot.forEach((doc) => {
                setVisiblePlanners((previous) => [...previous, doc.id]);
            });
        });
    }, []);

    useEffect(() => {
        if (visiblePlanners.length > 0) {
            // The querys asks to see tasks that are in the planners that are set to visible.
            const q = query(collection(database, 'tasks'), where('planners', 'array-contains-any', visiblePlanners), where('complete', '==', true));

            // Using the query, onSnapshot() listens to changes within the document.
            onSnapshot(q, (querySnapshot) => {
                setCompleteTasks([]);

                // Adds a tasks to the tasks array.
                querySnapshot.forEach((doc) => {
                    setCompleteTasks((previous) => [...previous, {
                        id: doc.id, 
                        name: doc.data().name, 
                        date:  doc.data().date.toDate(), 
                        complete:  doc.data().complete, 
                        planners: doc.data().planners
                    }]);
                });
            });
            
            // The querys asks to see tasks that are in the planners that are set to visible.
            const q2 = query(collection(database, 'tasks'), where('planners', 'array-contains-any', visiblePlanners), where('complete', '==', false));

            // Using the query, onSnapshot() listens to changes within the document.
            onSnapshot(q2, (querySnapshot) => {
                setIncompleteTasks([]);

                // Adds a tasks to the tasks array.
                querySnapshot.forEach((doc) => {
                    setIncompleteTasks((previous) => [...previous, {
                        id: doc.id, 
                        name: doc.data().name, 
                        date:  doc.data().date.toDate(), 
                        complete:  doc.data().complete, 
                        planners: doc.data().planners
                    }]);
                });
            });
        }

        else {
            setCompleteTasks([]);
            setIncompleteTasks([]);
        }
    }, [visiblePlanners])
    
    return (
        <View>
            <FlatList
                data={completeTasks}
                keyExtractor={
                    (item) => item.id
                }
                renderItem={ 
                    ({item}) => <TaskRow id={item.id} name={item.name} date={item.date} complete={item.complete} planners={item.planners}/> 
                }
            />

            <FlatList
                data={incompleteTasks}
                keyExtractor={
                    (item) => item.id
                }
                renderItem={ 
                    ({item}) => <TaskRow id={item.id} name={item.name} date={item.date} complete={item.complete} planners={item.planners}/> 
                }
            />
        </View>
    );
}