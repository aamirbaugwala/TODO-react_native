import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform } from 'react-native';
import Task from './components/Task';
import CompletedTask from './components/CompletedTask';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const TaskScreen = () => {
  const navigation = useNavigation();

  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [completedTaskItems, setCompletedTaskItems] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          setTaskItems(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
  
    const loadCompletedTasks = async () => {
      try {
        const savedCompletedTasks = await AsyncStorage.getItem('completedTasks');
        if (savedCompletedTasks) {
          setCompletedTaskItems(JSON.parse(savedCompletedTasks));
        }
      } catch (error) {
        console.error('Error loading completed tasks:', error);
      }
    };
  
    loadTasks();
    loadCompletedTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(taskItems));
  }, [taskItems]);
  
  useEffect(() => {
    AsyncStorage.setItem('completedTasks', JSON.stringify(completedTaskItems));
  }, [completedTaskItems]);
  
  const handleAddTask = () => {
    Keyboard.dismiss();
    if (task.trim()) {
      setTaskItems([...taskItems, task]);
      setTask('');
    }
  }

  const DeleteTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }

  const DeleteCompletedTask = (index) => {
    let itemsCopy = [...completedTaskItems];
    itemsCopy.splice(index, 1);
    setCompletedTaskItems(itemsCopy)
  }

  const completeTask = (index) => {
    let updatedTaskItems = [...taskItems];
    let completedTask = updatedTaskItems.splice(index, 1)[0];
    setTaskItems(updatedTaskItems);
    setCompletedTaskItems([...completedTaskItems, completedTask]);
  }
  
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CompletedTasksScreen')}>
        <Text style={{fontSize:15,fontWeight:'bold',textDecorationLine:'underline'}}>View completed Tasks</Text>
      </TouchableOpacity>
          <View style={styles.items}>
            {taskItems.map((item, index) => (
              <Task
                key={index}
                text={item}
                onDelete={() => DeleteTask(index)}
                onComplete={() => completeTask(index)} // Add onComplete handler
              />
            ))}
          </View>

        </View>
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      

    </View>
  );
}


const CompletedTasksScreen = () => {
  const [completedTaskItems, setCompletedTaskItems] = useState([]);

  useEffect(() => {
    const loadCompletedTasks = async () => {
      try {
        const savedCompletedTasks = await AsyncStorage.getItem('completedTasks');
        if (savedCompletedTasks) {
          setCompletedTaskItems(JSON.parse(savedCompletedTasks));
        }
      } catch (error) {
        console.error('Error loading completed tasks:', error);
      }
    };
  
    loadCompletedTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('completedTasks', JSON.stringify(completedTaskItems));
  }, [completedTaskItems]);
  
  const DeleteCompletedTask = (index) => {
    let itemsCopy = [...completedTaskItems];
    itemsCopy.splice(index, 1);
    setCompletedTaskItems(itemsCopy)
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={{
          flexGrow: 1,
          
        }}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Completed Tasks</Text>
          <View style={styles.items}>
            {completedTaskItems.map((item, index) => (
              <CompletedTask
                key={index}
                text={item}
                onDelete={() => DeleteCompletedTask(index)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TaskScreen" component={TaskScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CompletedTasksScreen" component={CompletedTasksScreen} options={{ title: 'Completed Tasks' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 300,
  },
  addWrapper: {
    width: 50,
    marginRight: 0,
    height: 50,
    backgroundColor: 'FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'C0C0C0',
    borderWidth: 1,
  },
  addText: {
    fontSize: 25,
    
  }
});

export default App;
