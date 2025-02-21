import { StyleSheet, Text, View } from 'react-native';
import { Lora_700Bold, useFonts } from '@expo-google-fonts/lora';
import TaskList from './screens/taskList';

export default function App() {
	const [fontsLoaded] = useFonts({Lora_700Bold});

	if (!fontsLoaded) {
		return <Text>Loading fonts...</Text>;
	}
	
	return (
		<View style={styles.container}>  
			<View>
				<TaskList></TaskList>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: '#f7f0e6',
		fontFamily: 'Lora_700Bold',
		paddingTop: 50,
		paddingBottom: 50,
	}
});

exports.App = App;
