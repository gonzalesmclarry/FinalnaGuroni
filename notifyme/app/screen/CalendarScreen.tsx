import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          {/* Calendar */}
          <Calendar
            minDate={new Date().toISOString().split('T')[0]} // Today
            maxDate={'2030-12-31'}
            onDayPress={(day: any) => console.log('Selected day:', day)}
            theme={{
              arrowColor: '#47d0e6',
              todayTextColor: 'red',
            }}
          />

          <TouchableOpacity style={styles.updateButton}>
            <Text style = {styles.updateButtonText}> Update </Text>

          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    height: height * 0.6, // Adjust size to fit the calendar
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 7,
    right: 8,
    zIndex: 1,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: '#47d0e6',
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalendarModal;
