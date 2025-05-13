import { StyleSheet } from 'react-native';

const colors = {
  primary: '#0B6477',
  secondary: '#5CD3C8',
  background: '#A8D8E4',
  cardBackground: '#C5DEE3',
  text: '#333333',
  white: '#FFFFFF',
  lightGray: '#F0F0F0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  danger: '#ff4444',
  success: '#4CAF50',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 20,
  },

  // Header Section
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },

  bellButton: {
    padding: 8,
    marginRight: 5,
  },

  logo: {
    width: 180,
    height: 70,
    resizeMode: 'contain',
    marginLeft: 10,
  },

  menuButton: {
    padding: 8,
  },

  // Menu Tabs
  menuTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  
  tabScrollView: {
    width: '100%',
    maxHeight: 50,
    marginTop: 5,
    marginBottom: 10,
  },
  
  tabScrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  
  tabButton: {
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  
  activeTab: {
    backgroundColor: colors.primary,
  },
  
  activeTabText: {
    color: colors.white,
    fontWeight: '500',
  },

  // Reminders Section
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
    width: '100%',
  },
  
  remindersText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },

  reminderCount: {
    fontSize: 16,
    color: '#666666',
  },
  
  emptyStateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    width: '100%',
  },
  
  emptyStateIcon: {
    marginBottom: 20,
  },
  
  emptyStateText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 15,
  },

  remindersContainer: {
    flex: 1,
    width: '95%',
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 70, // Add space for the bottom tab bar
  },

  remindersList: {
    width: '100%',
    paddingHorizontal: 5,
  },

  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: colors.white,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  // Checkbox Styles
  checkboxContainer: {
    marginRight: 15,
  },
  
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  
  checkedBox: {
    backgroundColor: '#e8f5e9',
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  reminderTextContainer: {
    flex: 1,
    paddingVertical: 5,
  },
  
  reminderTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  
  reminderDateTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  starButton: {
    padding: 8,
  },
  
  calendarButton: {
    padding: 8,
  },
  
  deleteButton: {
    padding: 8,
  },

  // Completed Reminders Section
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    marginTop: 15,
    borderRadius: 10,
  },
  
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  
  completedList: {
    maxHeight: 200,
  },
  
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#f9f9f9',
  },
  
  completedTitle: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  
  completedDateTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  modalIcon: {
    marginBottom: 15,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  deleteButtonText: {
    color: colors.danger,
  },
  
  completeButton: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  
  completeButtonText: {
    color: colors.white,
  },

  // Bottom Tab Bar Styles
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    width: '92%',
    position: 'absolute',
    bottom: 15,
    left: '4%',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    height: 65,
    paddingHorizontal: 15,
    zIndex: 2,
  },
  
  tabButtonNew: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 50,
    position: 'relative',
  },
  
  tabIconContainer: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 21,
  },
  
  tabIconContainerActive: {
    backgroundColor: colors.primary,
  },
  
  tabIcon: {
    width: 22,
    height: 22,
  },
  
  tabIconLight: {
    tintColor: colors.white,
  },
  
  tabText: {
    color: colors.text,
    fontSize: 10,
    marginTop: 3,
    opacity: 0.7,
  },
  
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
    opacity: 1,
  },
  
  tabActiveIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  
  iconContainer: {
    alignItems: 'center',
  },
  
  centerTabButton: {
    width: 60,
    height: 60,
    backgroundColor: colors.secondary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  
  centerTabIcon: {
    width: 24,
    height: 24,
    tintColor: colors.white,
  },

  // Sidebar Styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 5,
  },
  
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '75%',
    backgroundColor: colors.background,
    zIndex: 10,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  
  sidebarScrollView: {
    flex: 1,
  },
  
  sidebarHeader: {
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderTopRightRadius: 25,
  },
  
  logoWrapper: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  
  sidebarLogo: {
    width: 180,
    height: 90,
    resizeMode: 'contain',
  },
  
  sidebarCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 8,
  },
  
  dividerLine: {
    height: 1,
    backgroundColor: '#D0D0D0',
    marginVertical: 8,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  sectionTitle: {
    fontSize: 18,
    marginLeft: 12,
    flex: 1,
    fontWeight: '600',
    color: colors.text,
  },
  
  categoriesList: {
    paddingLeft: 8,
  },
  
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  
  activeCategoryItem: {
    backgroundColor: 'rgba(11, 100, 119, 0.1)',
  },
  
  categoryText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#555',
  },
  
  activeCategoryText: {
    color: colors.primary,
    fontWeight: '500',
  },
  
  categoryCount: {
    fontSize: 14,
    color: '#666666',
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 25,
    textAlign: 'center',
  },
  
  seeAllCategories: {
    marginTop: 5,
  },
  
  seeAllCategoriesText: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  
  sidebarButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  
  logoutButton: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 20,
  },
  
  logoutButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.danger,
  },

  // Add Reminder FAB
  // In homestyles.tsx, around line 642, replace the existing fab style:
addReminderButton: {
  position: 'absolute',
  right: 25,
  bottom: 100,
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 8,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  zIndex: 3,
},
  
  fabText: {
    fontSize: 30,
    color: colors.white,
    fontWeight: 'bold',
  },
  addReminderContainer: {
  position: 'absolute',
  bottom: 80, // Adjust this value to place it above the bottom tab bar
  right: 20, // Align it to the right
  left: 20, // Optional: Align it to the left if needed
  zIndex: 10, // Ensure it appears above other elements
},
});

export default styles;