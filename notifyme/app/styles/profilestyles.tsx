import { StyleSheet, Dimensions } from 'react-native';

// Get device dimensions
const { width } = Dimensions.get('window');

const colors = {
  primary: '#0B6477',
  secondary: '#5CD3C8',
  background: '#A8D8E4',
  cardBackground: '#C5DEE3',
  text: '#333333',
  white: '#FFFFFF',
  lightGray: '#F0F0F0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 40,
  },
  
  // Profile Section Styles
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderColor: colors.white,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  userStatus: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },

  // Filter Section Styles
  filterSection: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: colors.white,
    marginRight: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  dropdownContent: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    width: 120,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    alignItems: 'center',
  },
  dropdownItemText: {
    color: colors.text,
    fontSize: 14,
  },
  filterContent: {
    paddingVertical: 10,
  },
  filterCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: colors.shadow,
    borderRadius: 20,
  },
  categoryChipSelected: {
    backgroundColor: colors.secondary,
  },
  categoryText: {
    color: colors.text,
    fontSize: 13,
  },
  categoryTextSelected: {
    color: colors.white,
    fontWeight: '500',
  },

  // Overview Section Styles
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
    paddingHorizontal: 25,
    color: colors.text,
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  overviewBox: {
    backgroundColor: colors.cardBackground,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  overviewLabel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
  },
  
  // Activity Section
  activitySection: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 15,
  },
  activityCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  activityDate: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  activityStatus: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
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
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 50,
    position: 'relative',
  },
  tabButtonActive: {
    alignItems: 'center',
  },
  tabActiveIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
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
});

export default styles;