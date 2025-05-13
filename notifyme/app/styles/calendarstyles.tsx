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
  pending: '#FF9500',
  completed: '#34C759',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 40,
  },
  
  // Calendar Header Styles
  headerSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 5,
  },
  
  // Calendar Styles
  calendarContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  dateDisplay: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
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

  // Section Title
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
    paddingHorizontal: 25,
    color: colors.text,
  },
  
  // Reminder Section Styles
  reminderSection: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  reminderCard: {
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
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  reminderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  reminderTime: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  reminderStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusCompleted: {
    color: colors.completed,
  },
  statusPending: {
    color: colors.pending,
  },
  emptyState: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: colors.text,
    fontSize: 16,
    opacity: 0.7,
  },
  
  // Add Button
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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