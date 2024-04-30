import React, {useEffect, useState} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform } from 'react-native';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage



export default function App() {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [completedTaskItems, setCompletedTaskItems] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          console.log("tasks found in localstorage: ",savedTasks);
          setTaskItems(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        // Handle error, such as showing an error message to the user or resetting the taskItems state
      }
    };
  
    const loadCompletedTasks = async () => {
      try {
        const savedCompletedTasks = await AsyncStorage.getItem('completedTasks');
        if (savedCompletedTasks) {
          console.log("completed tasks found in localstorage: ",savedCompletedTasks);
          setCompletedTaskItems(JSON.parse(savedCompletedTasks));
        }
      } catch (error) {
        console.error('Error loading completed tasks:', error);
        // Handle error, such as showing an error message to the user or resetting the completedTaskItems state
      }
    };
  
    loadTasks();
    loadCompletedTasks();
  }, []);
  

    // Save tasks to local storage whenever taskItems state changes
    useEffect(() => {
      AsyncStorage.setItem('tasks', JSON.stringify(taskItems));
    }, [taskItems]);
  
    // Save completed tasks to local storage whenever completedTaskItems state changes
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
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >

      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
          {/* This is where the tasks will go! */}
          {
            taskItems.map((item, index) => {
              return (
                <Task
                key={index}
                text={item}
                onDelete={() => DeleteTask(index)} // Pass delete handler
                onComplete={() => completeTask(index)}
              />
              );
            })
          }
        </View>
      </View>

      {/* completed task section */}
      <View style={styles.completedTasksWrapper}>
        <Text style={styles.sectionTitle}>Completed Tasks</Text>
        <View style={styles.items}>
          {
            completedTaskItems.map((item, index) => {
 
              return (
              <Task
                  key={index}
                  text={item}
                  onDelete={() => DeleteCompletedTask(index)}
              />

              );
            })
          }
        </View>
      </View>
        
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',

  },
  completedTasksWrapper: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  tasksWrapper: {
    paddingTop: 80, // Add padding to the top
    paddingHorizontal: 20, // Add horizontal padding
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30, // Add margin to the top of items
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
