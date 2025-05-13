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
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSpacing: {
    width: 40,
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
  
  // Section Title
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
    paddingHorizontal: 25,
    color: colors.text,
  },
  
  // File Item Styles
  listContainer: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 100,
  },
  fileItem: {
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
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileContent: {
    flex: 1,
  },
  context: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  fileMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  deletedDate: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  restoreButton: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  
  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyIcon: {
    opacity: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
  },
});

export default styles;