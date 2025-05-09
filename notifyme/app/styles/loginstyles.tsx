import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8faff',
    minHeight: height,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: 10,
    height: height * 0.2,
  },
  logo: {
    width: width * 0.7,
    height: height * 0.18,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: '100%',
    height: 55,
    shadowColor: '#dfe4ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f2f6',
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 12,
    tintColor: '#47d0e6',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#34495e',
    height: '100%',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginTop: 3,
    marginBottom: 5,
  },
  forgotPassword: {
    color: '#47d0e6',
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 5,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#47d0e6',
    borderRadius: 12,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#47d0e6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#a3d8e7',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  createAccount: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  createLink: {
    color: '#47d0e6',
    fontWeight: 'bold',
  },
})

export default styles;