import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8D8E4', // Background color
    alignItems: 'center',
    paddingTop: 100,
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
    alignItems: 'center', // Centers icons and text vertically
  },
  calendarText: {
    color: 'black'
  },
  calendar: {
    width: 350,
    backgroundColor: '#A8D8E4',

  },
  noReminderText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0B647',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 35,
    color: '#000',
  },
  reminderCard: {
    position: 'absolute',
    bottom: 100,
    width: '90%',
    backgroundColor: '#7FC7D9', // Lighter blue color
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reminderInput: {
    backgroundColor: '#A8D8E4',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#000',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryButton: {
    backgroundColor: '#A8D8E4',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  categoryButtonText: {
    color: '#000',
  },
  calendarButton: {
    backgroundColor: '#A8D8E4',
    borderRadius: 15,
    padding: 8,
  },
  categoryIcon: {
    width: 20,
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#A8D8E4',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#7FC7D9',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#000',
  },
  createNewButton: {
    paddingVertical: 15,
    marginTop: 10,
  },
  createNewButtonText: {
    fontSize: 16,
    color: '#0B6477',
    fontWeight: 'bold',
  },
});

export default styles;