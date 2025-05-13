import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const colors = {
  primary: '#0B6477',       // Deep teal - primary brand color
  secondary: '#7FCDCD',     // Light teal - secondary brand color
  accent: '#025A6C',        // Dark teal - for accents and highlights
  light: '#9ED8D8',         // Very light teal - for backgrounds
  white: '#FFFFFF',         // White - for text and backgrounds
  dark: '#333333',          // Dark gray - for primary text
  medium: '#666666',        // Medium gray - for secondary text
  lightGray: '#EEEEEE',     // Light gray - for dividers and inactives
  success: '#4CAF50',       // Green - for success states
  danger: '#F44336',        // Red - for errors and warnings
  overlay: 'rgba(0, 0, 0, 0.65)', // Darker overlay for better contrast
};

const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    elevation: 8,
  },
};

const styles = StyleSheet.create({
  // Main Reminder Card
  reminderCard: {
    position: 'absolute',
    bottom: 90,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    paddingTop: 35,
    height: 'auto',
    minHeight: 280,
    ...shadows.large,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
  },
  
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  
  reminderInput: {
    fontSize: 18,
    marginBottom: 30,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    color: colors.dark,
    height: 55,
    marginTop: 10,
    fontWeight: '500',
    ...shadows.small,
  },
  
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10,
  },
  
  categoryButton: {
    backgroundColor: colors.light,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    ...shadows.small,
  },
  
  categoryButtonText: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: '500',
  },
  
  calendarButton: {
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 12,
    ...shadows.small,
  },
  
  // Add Button (Plus Button)
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  
  addButtonText: {
    fontSize: 36,
    color: colors.white,
    fontWeight: '300',
    lineHeight: 42,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  
  // Modal Styles
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Category Modal
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
    ...shadows.large,
  },
  
  categoryItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  
  categoryItemText: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '500',
  },
  
  createNewButton: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: colors.light,
  },
  
  createNewButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Create Category Modal
  createCategoryModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    width: '85%',
    ...shadows.large,
  },
  
  closeButtonContainer: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
    padding: 5,
  },
  
  closeButtonText: {
    fontSize: 20,
    color: colors.medium,
    fontWeight: '500',
  },
  
  createCategoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 15,
    color: colors.dark,
    textAlign: 'center',
  },
  
  categoryInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    fontSize: 16,
    backgroundColor: colors.lightGray,
  },
  
  flatList: {
    maxHeight: height * 0.4,
  },
  
  flatListContent: {
    paddingBottom: 15,
  },
  
  saveButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: colors.primary,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    ...shadows.small,
  },
  
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Calendar Modal
  calendarModalContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  calendarContent: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    ...shadows.large,
  },
  
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    marginBottom: 10,
  },
  
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  
  arrowText: {
    fontSize: 18,
    color: colors.primary,
    padding: 8,
  },
  
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  
  weekDayText: {
    width: 40,
    textAlign: 'center',
    color: colors.medium,
    fontSize: 14,
    fontWeight: '600',
  },
  
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 15,
  },
  
  calendarDate: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  
  dateText: {
    fontSize: 15,
    color: colors.dark,
    textAlign: 'center',
    padding: 10,
  },
  
  prevMonthDate: {
    color: colors.medium,
    opacity: 0.5,
    width: '14.28%',
    aspectRatio: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  
  todayText: {
    fontWeight: 'bold',
    backgroundColor: colors.light,
    borderRadius: 20,
    overflow: 'hidden',
  },
  
  selectedDateText: {
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: 20,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  
  inputsContainer: {
    marginTop: 15,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 20,
  },
  
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    gap: 10,
  },
  
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
  },
  
  doneButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 25,
    marginHorizontal: 10,
    ...shadows.small,
  },
  
  doneText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Time Modal
  timeModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  
  timeModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 350,
    ...shadows.large,
  },
  
  timeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingBottom: 15,
  },
  
  timeModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
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
    width: 70,
  },
  
  timeInput: {
    fontSize: 28,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 8,
    width: '100%',
    color: colors.dark,
  },
  
  timeLabel: {
    marginTop: 8,
    fontSize: 14,
    color: colors.medium,
  },
  
  timeColon: {
    fontSize: 28,
    marginHorizontal: 10,
    paddingTop: 5,
    color: colors.dark,
  },
  
  amPmContainer: {
    marginLeft: 25,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 3,
    ...shadows.small,
  },
  
  amPmButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 2,
  },
  
  amPmButtonActive: {
    backgroundColor: colors.primary,
  },
  
  amPmText: {
    fontSize: 16,
    color: colors.medium,
    fontWeight: '500',
  },
  
  amPmTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  
  timeDoneButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    ...shadows.small,
  },
  
  timeDoneText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Save Reminder Button
  saveReminderButton: {
    marginTop: 25,
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    ...shadows.medium,
  },
  
  saveReminderText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Extra styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 10,
    marginLeft: 5,
  },
  
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  iconContainer: {
    marginRight: 10,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  closeIcon: {
    fontSize: 22,
    color: colors.medium,
  },
});

export default styles;