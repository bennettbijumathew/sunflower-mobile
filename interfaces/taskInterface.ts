import { Timestamp } from "@react-native-firebase/firestore";

export interface Task {
    id: string,
    name: string, 
    date: Date,
    complete: boolean,
    planners: string[]
}