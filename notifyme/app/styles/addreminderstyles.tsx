import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  reminderCard: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    backgroundColor: '#7FCDCD',
    borderRadius: 25,
    padding: 25,
    paddingTop: 35,
    height: 250,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reminderInput: {
    fontSize: 16,
    marginBottom: 30,
    backgroundColor: '#9ED8D8',
    borderRadius: 15,
    padding: 15,
    color: '#333',
    height: 50,
    marginTop: 5,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  categoryButton: {
    backgroundColor: '#9ED8D8',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryButtonText: {
    color: '#333',
  },
  calendarButton: {
    backgroundColor: '#9ED8D8',
    padding: 8,
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0B6477',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 40,
    color: '#000',
    fontWeight: 'bold',
    lineHeight: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    marginTop: -2,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#C5DEE3',
    borderRadius: 15,
    padding: 20,
    width: '50%',
    position: 'absolute',
    top: '40%',
    left: '25%',
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  createNewButton: {
    padding: 10, 
    alignItems: 'center',
    borderRadius: 5, // Optional: Add rounded corners
  },
  createNewButtonText: {
    color: '#000', // Set text color to black
    fontSize: 14, // Adjust font size to make it smaller
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    zIndex: 1,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  createCategoryModalContent: {
    backgroundColor: '#C5DEE3',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    position: 'absolute',
    top: '40%',
    left: '10%',
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    padding: 5,  // Makes the touch target larger
  },
  modalCloseButton: {  // Renamed to avoid duplicate property name
    fontSize: 20,
    color: '#666',
  },
  createCategoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    
  },
  categoryInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    
  },
  flatList: {
    maxHeight: '70%', // Set max height for FlatList
  },
  flatListContent: {
    paddingBottom: 10,
  },
 


  saveButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor:'#C5DEE3',
    borderRadius: 30,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
  },
  calendarModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  calendarContainer: {
    backgroundColor: '#C5DEE3',
    padding: 15,
    borderRadius: 15,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  navigationArrow: {
    fontSize: 16,
    color: '#333',
    padding: 10,
  },
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#9ED8D8',
  },
  dayHeader: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  calendarDate: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  prevMonthDate: {
    color: '#999',
    width: '14.28%',
    aspectRatio: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  todayText: {
    fontWeight: 'bold',
  },
  selectedDateText: {
    color: '#007AFF',
  },
  reminderInputContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    gap: 10,
  },
  inputRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#9ED8D8',
    paddingVertical: 8,
    gap: 10,
  },
  timeInputField: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#9ED8D8',
    paddingVertical: 8,
    gap: 10,
  },
  doneButton: {
    backgroundColor: '#9ED8D8',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  doneButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  calendarModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContent: {
    width: '85%',
    backgroundColor: '#C5DEE3',  // Light blue background
    borderRadius: 15,
    padding: 15,
  },
 
  monthText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  arrowText: {
    fontSize: 16,
    color: '#333',
    padding: 5,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDayText: {
    width: 40,
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  inputsContainer: {
    marginTop: 20,
    gap: 15,
  },
 
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  doneText: {
    color: '#333',
    fontSize: 14,
  },
  timeModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  timeModalContent: {
    backgroundColor: '#E0F4F4',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 350,
  },
  timeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  timeModalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  timeModalClose: {
    padding: 5,
  },
  
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 40,
  },
  timeInputGroup: {
    alignItems: 'center',
    width: 60,
  },
  timeInput: {
    fontSize: 24,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    width: '100%',
  },
  timeLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  timeColon: {
    fontSize: 24,
    marginHorizontal: 10,
    paddingTop: 5,
  },
  amPmContainer: {
    marginLeft: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
  },
  amPmButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  amPmButtonActive: {
    backgroundColor: '#007AFF',
  },
  amPmText: {
    fontSize: 16,
    color: '#666',
  },
  amPmTextActive: {
    color: '#fff',
  },
  timeDoneButton: {
    alignSelf: 'flex-end',
  },
  timeDoneText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  reminderModalContainer: {
    width: '1000%', // Reduce width to 80% of the screen to avoid overflow
    height: 'auto', // Adjust height according to content (or you can set a fixed height like '70%' or a pixel value)
    maxHeight: '80%', // Prevent it from growing too large vertically
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    position: 'absolute',
    top: '10%', // Optional: to ensure it doesn't stick to the very top
    left: '10%', // Optional: to ensure it is centered horizontally
    padding: 20, // Add padding if needed inside the modal
    borderRadius: 15, // Optional: rounded corners for the modal
},

  reminderModalContent: {
    backgroundColor: '#E0F4F4',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 350,
  },
  reminderModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reminderModalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  reminderModalClose: {
    padding: 5,
    position: 'absolute',
    right: -10,
    top: -10,
  },
  
  soundSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  soundText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  reminderDoneButton: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  reminderDoneText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  soundOptionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  soundOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedSoundOption: {
    backgroundColor: '#E8F0FE',
  },
  soundOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSoundOptionText: {
    color: 'black',
  },
  saveReminderButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#9ED8D8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveReminderText: {
    color: '#black',
    fontSize: 16,
    fontWeight: 'bold',
  },


  // ... existing styles ...


});


export default styles; 