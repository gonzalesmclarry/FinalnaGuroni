// registerStyles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a3d8e7', // Background color matching your design
  },
  logo: {
    width: 350,
    height: 190,
    resizeMode: 'contain',
    position: 'absolute',
    top: -10,
    right: -70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#000',
  },
  input: {
    backgroundColor: '#e0f7ff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    fontSize: 16,
    color: '#000',
  },
  createButton: {
    backgroundColor: '#47d0e6',
    borderRadius: 10,
    paddingVertical: 15,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#000',
    marginTop: 20,
  },
  loginLink: {
    color: '#4169e1',
    fontWeight: 'bold',
  },
});

export default styles;