import { StyleSheet } from 'react-native';



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8D8E4', // Background color
    alignItems: 'center',
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200, 
    height: 100, 
    marginRight: 200,
    marginTop: 20,
    marginBottom: 20,
  },
  menuTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    marginTop: -30,
  },
  
  menuButton: {
    padding: 8,
    marginLeft: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  menuIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  
  tabScrollView: {
    flex: 1,
  },
  
  tabScrollContent: {
    paddingHorizontal: 10,
  },
  
  tabButton: {
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  
  activeTab: {
    backgroundColor: '#0B6477',
  },
  
  tabText: {
    fontSize: 14,
    color: '#666666',
  },
  
  activeTabText: {
    color: '#000000',
    fontWeight: '500',
  },
  
  moreOptionsButton: {
    padding: 8,
    marginRight: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  moreOptionsIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  arrowIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  
  emptyStateContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150, // Adjust this value as needed
  },
  
  emptyStateText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    lineHeight: 24,
  },
  
  remindersText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 40,
  },

  remindersContainer: {
    flex: 1,
    marginBottom: 20,
    width: '90%', // Take up most of the width but not all
    maxHeight: 250, // Set a maximum height for the container
    borderRadius: 15,
    alignSelf: 'center',
    elevation: 5,
  },

  remindersList: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#A8D8E4',
    backgroundColor: '#FFFFFF',
    marginVertical: 5,
    borderRadius: 8,
  },

  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#A8D8E4',
    paddingVertical: 25,
    width: '100%',
    position: 'absolute',
    bottom: 3,
    alignItems: 'center',
    marginBottom: 30,
  },

  bottomTabButtonLeft: {
    position: 'absolute',
    left: 25, 
    alignItems: 'center',
  },
  bottomTabButtonCenter: {
    position: 'absolute',
    left: '45%',
    alignItems: 'center',
  },

  bottomTabButtonRight: {
    position: 'absolute',
    right: 20, 
    alignItems: 'center',
  },

  bottomTabText: {
    marginRight: -15,
    color: '#000',
    width: 64,
    fontSize: 15,
  },

  bottomTabIcon: {
    width: 25,
    height: 24,
  },

  iconContainer: {
    alignItems: 'center',

  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90, // Adjust this value if needed to position above bottom tab bar
    width: 60,
    height: 60,
    borderRadius: 28,
    backgroundColor: '#0B6477', // Or your preferred color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },

  fabText: {
    fontSize: 30,
    color: '#000000',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    zIndex: 5, // Ensure overlay is above the main screen content
  },

  sidebarScrollView: {
    flex: 1,
  },
  
  sidebarSection: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,  // reduced from default padding
  },
   

  sidebarIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  
  
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  
  categoriesList: {
    paddingLeft: 20,
  },
  
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  
  categoryIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 10,
  },
  
  categoryText: {
    flex: 1,
    fontSize: 16,
  },
  
  categoryCount: {
    fontSize: 14,
    color: '#666666',
  },
  
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  
  sidebarButtonText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },

  
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '75%', // Covers 3/4 of the screen width
    backgroundColor: '#A8D8E4',
    zIndex: 10, // Ensures it appears above other components
  },
  sidebarTop: {
    height: '20%', // Takes up 20% of the sidebar's height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C5DEE3', // Background color for top section
  },
  sidebarContent: {
    height: '80%', // Takes up the remaining 80%
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoWrapper: {
    width: '100%',
    alignItems: 'center',
  },

  sidebarLogo: {
    width: 200, // Adjust logo size as needed
    height: 200,
    resizeMode: 'contain',
  },
  sidebarmenuIcon: {
    width: 24,
    height: 24,
  },

  menuButtonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: -70,
    alignItems: 'flex-end',  // Align to the right
  },
  
  sidebarMenuButton: {
    padding: 8,
  },

  dividerLine: {
    height: 2,
    backgroundColor: '#1A1A1D',
    marginTop: 0,  // reduced margin
    marginBottom: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  
  sectionTitle: {
    fontSize: 20,
    marginLeft: 12,
    flex: 1,
    fontWeight: 'bold'
  },

  sidebarText: {
    width: 30,
    height: 30
  },

  checkboxContainer: {
    marginRight: 15,
  },
  
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0B6477',
    backgroundColor: '#FFFFFF',
  },
  
  reminderTextContainer: {
    flex: 1,
    paddingVertical: 5,
  },
  
  reminderTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  
  reminderDateTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  
  reminderActions: {
    flexDirection: 'row',
    gap: 12,
    paddingLeft: 10,
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


  moreOptionsList: {
    backgroundColor: '#C5DEE3', // Background color for the more options list
    borderRadius: 8,
    padding: 10,
    elevation: 2, // Shadow effect for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

  },
  moreOptionItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  moreOptionText: {
    fontSize: 16,
    color: '#007BFF', // Color for the text
    textAlign: 'center',
  },

});

export default styles;