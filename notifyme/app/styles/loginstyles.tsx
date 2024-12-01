// loginStyles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a3d8e7', 
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  loginButton: {
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
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#000',
    textDecorationLine: 'underline',
    marginVertical: 10,
    marginBottom: 50,
    marginTop: 20,
  },
  createAccount: {
    color: '#000',
    marginTop: 120,
  },
  createLink: {
    color: '#4169e1',
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center', // Centers icons and text vertically
  },
  
});

export default styles;