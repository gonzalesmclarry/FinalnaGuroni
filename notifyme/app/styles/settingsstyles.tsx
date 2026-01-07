import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8D8E4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 50,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  contentText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  boldText: {
    fontSize: 16,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
},

modalContent: {
  backgroundColor: 'white',
  borderRadius: 15,
  padding: 20,
  width: '80%',
},

modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 15,
  textAlign: 'center',
},

input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 10,
  marginVertical: 10,
},

modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
},

modalButton: {
  flex: 1,
  padding: 10,
  borderRadius: 5,
  marginHorizontal: 5,
},

cancelButton: {
  backgroundColor: '#f2f2f2',
},

updateButton: {
  backgroundColor: '#47d0e6',
},

cancelButtonText: {
  color: 'black',
  textAlign: 'center',
  fontWeight: 'bold',
},

updateButtonText: {
  color: 'white',
  textAlign: 'center',
  fontWeight: 'bold',
},




});

export default styles;