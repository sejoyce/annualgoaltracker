import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';

import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import { Entypo } from '@expo/vector-icons';

export default function App() {
  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const addGoal = () => {
    if (!goalTitle || !goalTarget) return;

    const newGoal = {
      id: Date.now().toString(),
      title: goalTitle,
      target: parseInt(goalTarget),
      current: 0,
    };
    setGoals([...goals, newGoal]);
    setGoalTitle('');
    setGoalTarget('');
    setModalVisible(false);
  };

  const updateProgress = (id, direction) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const current = direction === 'up'
          ? Math.min(goal.current + 1, goal.target)
          : Math.max(goal.current - 1, 0);
        return { ...goal, current };
      }
      return goal;
    }));
  };

  const renderLeftActions = (goalId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        setGoals(goals.filter(g => g.id !== goalId));
      }}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>🎯 My Goals</Text>

        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Swipeable renderLeftActions={() => renderLeftActions(item.id)}>
              <View style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{item.title}</Text>
                  <TouchableOpacity onPress={() => {
                    setSelectedGoal(item);
                    setEditTitle(item.title);
                    setEditModalVisible(true);
                  }}>
                    <Entypo name="cog" size={20} color="#555" />
                  </TouchableOpacity>
                </View>

                <Progress.Bar
                  progress={item.current / item.target}
                  width={null}
                  height={10}
                  color="#4caf50"
                  borderRadius={5}
                />
                <Text style={styles.progressText}>{item.current} / {item.target}</Text>

                <View style={styles.controls}>
                  <TouchableOpacity style={styles.btn} onPress={() => updateProgress(item.id, 'down')}>
                    <Text style={styles.btnText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btn} onPress={() => updateProgress(item.id, 'up')}>
                    <Text style={styles.btnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Swipeable>
          )}
        />

        {/* ➕ Add Goal Button */}
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* ➕ Add Goal Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Goal</Text>
              <TextInput
                placeholder="Goal Title"
                style={styles.input}
                value={goalTitle}
                onChangeText={setGoalTitle}
              />
              <TextInput
                placeholder="Target Value"
                style={styles.input}
                value={goalTarget}
                onChangeText={setGoalTarget}
                keyboardType="numeric"
              />
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} color="gray" />
                <Button title="Add" onPress={addGoal} />
              </View>
            </View>
          </View>
        </Modal>

        {/* ⚙️ Edit/Delete Modal */}
        <Modal animationType="slide" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Goal</Text>
              <TextInput
                placeholder="Goal Title"
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
              />
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setEditModalVisible(false)} color="gray" />
                <Button title="Save" onPress={() => {
                  setGoals(goals.map(g => g.id === selectedGoal.id ? { ...g, title: editTitle } : g));
                  setEditModalVisible(false);
                }} />
              </View>
              <View style={{ marginTop: 10 }}>
                <Button title="Delete Goal" color="red" onPress={() => {
                  setGoals(goals.filter(g => g.id !== selectedGoal.id));
                  setEditModalVisible(false);
                }} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 18,
    flex: 1,
    textAlign: 'left',
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  btn: {
    marginHorizontal: 20,
    backgroundColor: '#2196f3',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  btnText: {
    fontSize: 18,
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#2196f3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    fontSize: 16,
    paddingVertical: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
