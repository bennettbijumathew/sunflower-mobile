import { collection, onSnapshot, query, where } from '@firebase/firestore';
import { FlatList, View, Text } from 'react-native';
import { Task } from '../interfaces/taskInterface';
import { database } from '../firebaseConfig';
import { useEffect, useState } from 'react';
import TaskRow from '../components/taskRow';

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([])
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
            const q = query(collection(database, 'tasks'), where('planners', 'array-contains-any', visiblePlanners));

            // Using the query, onSnapshot() listens to changes within the document.
            onSnapshot(q, (querySnapshot) => {
                setTasks([]);

                // Adds a tasks to the tasks array.
                querySnapshot.forEach((doc) => {
                    setTasks((previous) => [...previous, {
                        id: doc.id, 
                        name: doc.data().name, 
                        date:  doc.data().date, 
                        complete:  doc.data().complete, 
                        planners: doc.data().planners
                    }]);
                });
            });
        }

        else {
            setTasks([]);
        }
    }, [visiblePlanners])
    
    return (
        <FlatList
            data={tasks}
            keyExtractor={
                (item) => item.id
            }
            renderItem={ 
                ({item}) => <TaskRow id={item.id} name={item.name} date={item.date} complete={item.complete} planners={item.planners}/> 
            }
        />
    );
}