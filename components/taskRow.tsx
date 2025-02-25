import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRef } from 'react';

export default function TaskRow() {
    const reanimatedRef = useRef<SwipeableMethods>(null);

    const completeTask = () => {
        reanimatedRef.current!.close();
    }

    const renderDeleteButton = () => {       
        return (
            <View style={styles.delete}>
                <TouchableOpacity onPress={completeTask}>
                    <MaterialCommunityIcons name="check" size={30} color='black'/>
                </TouchableOpacity>
            </View>
        );
    }
   
    return (
        <GestureHandlerRootView>   
            <ReanimatedSwipeable ref={reanimatedRef} renderRightActions={renderDeleteButton}>
                <View style={styles.row}> 
                    <View style={styles.details}> 
                        <Text style={styles.title}> Task Name </Text>
                        <Text style={styles.subTitle}> February 26th 2025 </Text>
                    </View>

                    <View style={styles.planners}>
                        <Text style={[styles.planner, {backgroundColor: '#f09999'}]}> 1 </Text>
                        <Text style={[styles.planner, {backgroundColor: '#f0cc99'}]}> 2 </Text>
                        <Text style={[styles.planner, {backgroundColor: '#f0ec99'}]}> 3 </Text>
                        <Text style={[styles.planner, {backgroundColor: '#cdf099'}]}> 4 </Text>
                        <Text style={[styles.planner, {backgroundColor: '#99f0e0'}]}> 5 </Text>
                        <Text style={[styles.planner, {backgroundColor: '#99cdf0'}]}> 6 </Text>
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
        flexWrap: 'wrap',
        flexDirection: 'row',

        verticalAlign: 'middle',
        justifyContent: 'flex-end'
    },

    planner: {
        height: 25,
        width: 25,

        margin: 2,

        borderWidth: 1,
        borderBottomWidth: 2,

        textAlign: 'center',

        verticalAlign: 'middle'
    },

    delete: {
        backgroundColor: '#f56767',

        width: 80,

        marginTop: 8,
        marginBottom: 5,

        borderWidth: 1,
        borderBottomWidth: 4,

        padding: 10,

        justifyContent:"center", 
        alignItems:"center"
    }
});