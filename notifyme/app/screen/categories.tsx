import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActionSheetIOS, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons
import { getFirestore, collection, query, getDocs, where, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore'; // Import Firestore
import { getAuth } from 'firebase/auth'; // Add this import

type Category = {
    id: string;
    name: string;
};

const categoriesData: Category[] = [
    { id: '1', name: 'Work' },
    { id: '2', name: 'Birthday' },
    { id: '3', name: 'Occasion' },
    { id: '4', name: 'Special' },
];

const CategoriesScreen = () => {
    const navigation = useNavigation();
    const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]); // State for fetched categories
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const auth = getAuth();
    const db = getFirestore();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedCategoryReminders, setSelectedCategoryReminders] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;
                if (!currentUser) return;

                const db = getFirestore();
                const categoriesRef = collection(db, 'categories');
                const q = query(categoriesRef, where("userID", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);

                // Map the fetched categories to match the Category type
                const fetchedCategoriesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                }));
                
                setFetchedCategories(fetchedCategoriesData);
                console.log('Fetched Categories:', fetchedCategoriesData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const combinedCategories = [...categoriesData, ...fetchedCategories]; // Combine built-in and fetched categories

    const toggleCreateCategoryModal = () => {
        setIsCreateModalVisible(!isCreateModalVisible);
    };

    const handleCreateCategory = async (): Promise<void> => {
        try {
            if (!newCategoryName.trim()) {
                Alert.alert('Error', 'Please enter a category name');
                return;
            }

            const currentUser = auth.currentUser;
            if (!currentUser) {
                Alert.alert('Error', 'You must be logged in to create a category');
                return;
            }

            const categoriesRef = collection(db, 'categories');
            const newCategory = {
                name: newCategoryName.trim(),
                userID: currentUser.uid,
                createdAt: new Date()
            };

            const docRef = await addDoc(categoriesRef, newCategory);
            
            // Add the new category to the local state
            setFetchedCategories(prev => [...prev, {
                id: docRef.id,
                name: newCategoryName.trim()
            }]);

            setNewCategoryName('');
            setIsCreateModalVisible(false);
        } catch (error) {
            console.error('Error creating category:', error);
            Alert.alert('Error', 'Failed to create category');
        }
    };

    const showOptions = (category: Category, event: any) => {
        const { pageY, pageX } = event.nativeEvent;
        setDropdownPosition({ x: pageX - 100, y: pageY });
        setSelectedCategory(category);
        setShowDropdown(true);
    };

    const fetchRemindersForCategory = async (categoryId: string) => {
        try {
            const remindersRef = collection(db, 'reminders');
            const q = query(remindersRef, where("categoryId", "==", categoryId));
            const querySnapshot = await getDocs(q);
            
            const reminders = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setSelectedCategoryReminders(reminders);
        } catch (error) {
            console.error('Error fetching reminders:', error);
            Alert.alert('Error', 'Failed to fetch reminders');
        }
    };

    const DropdownMenu = () => (
        <Modal
            visible={showDropdown}
            transparent={true}
            onRequestClose={() => setShowDropdown(false)}
        >
            <TouchableOpacity 
                style={styles.dropdownOverlay} 
                onPress={() => setShowDropdown(false)}
            >
                <View style={[styles.dropdownMenu, { top: dropdownPosition.y, left: dropdownPosition.x }]}>
                    <TouchableOpacity 
                        style={styles.dropdownItem}
                        onPress={() => {
                            if (selectedCategory) {
                                fetchRemindersForCategory(selectedCategory.id);
                                setIsViewModalVisible(true);
                            }
                            setShowDropdown(false);
                        }}
                    >
                        <Text>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.dropdownItem}
                        onPress={() => {
                            setShowDropdown(false);
                        }}
                    >
                        <Text>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.dropdownItem, styles.deleteItem]}
                        onPress={() => {
                            setShowDropdown(false);
                        }}
                    >
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const ViewCategoryModal = () => (
        <Modal
            visible={isViewModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsViewModalVisible(false)}
        >
            <View style={styles.viewModalContainer}>
                <View style={styles.viewModalContent}>
                    <View style={styles.viewModalHeader}>
                        <Text style={styles.viewModalTitle}>
                            {selectedCategory?.name} Reminders
                        </Text>
                        <TouchableOpacity 
                            onPress={() => setIsViewModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <MaterialIcons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    
                    {selectedCategoryReminders.length === 0 ? (
                        <Text style={styles.noRemindersText}>No reminders in this category</Text>
                    ) : (
                        <FlatList
                            data={selectedCategoryReminders}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.reminderItem}>
                                    <Text style={styles.reminderTitle}>{item.title}</Text>
                                    <Text style={styles.reminderDate}>
                                        {new Date(item.date.toDate()).toLocaleDateString()}
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );

    const renderCategory = ({ item }: { item: Category }) => (
        <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <TouchableOpacity 
                onPress={(event) => showOptions(item, event)} 
                style={styles.moreOptionsButton}
            >
                <MaterialIcons name="more-vert" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Back button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={25} color="black" />
                <Text style={styles.backButtonText}>See All Categories</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Categories</Text>
            <FlatList<Category>
                data={combinedCategories} // Use combined categories here
                keyExtractor={(item) => item.id}
                renderItem={renderCategory}
            />

            {/* Modal for creating new category */}
            <Modal
                visible={isCreateModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Category</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Category Name"
                            value={newCategoryName}
                            onChangeText={setNewCategoryName}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={toggleCreateCategoryModal}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.createModalButton}
                                onPress={handleCreateCategory}
                            >
                                <Text>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Update the create button to open modal */}
            <TouchableOpacity
                style={styles.createButton}
                onPress={toggleCreateCategoryModal}
            >
                <MaterialIcons name="add" size={24} color="black" />
                <Text style={styles.createButtonText}> Create New</Text>
            </TouchableOpacity>
            <DropdownMenu />
            <ViewCategoryModal />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a3d8e7',
        padding: 20,
    },
    header: {
        fontSize: 20,
        marginBottom: 40,
        color: '#007BFF',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 60,
    },
    backButtonText: {
        fontSize: 25,
        marginLeft: 8,
        color: 'black',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 23,
        marginBottom: 10,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    categoryName: {
        fontSize: 18,
    },
    moreOptionsButton: {
        padding: 5, // Add some padding for better touch area
    },
    createButton: {
        position: 'absolute',
        bottom: 20, // Adjust distance from the bottom
        left: 20, // Adjust distance from the left
        right: 20, // Adjust distance from the right
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#47d0e6',
        padding: 10,
        borderRadius: 20,
    },
    createButtonText: {
        color: 'black',
        fontSize: 17,
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ddd',
        width: '45%',
        alignItems: 'center',
    },
    createModalButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#47d0e6',
        width: '45%',
        alignItems: 'center',
    },
    dropdownOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    dropdownMenu: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
        width: 120,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    deleteItem: {
        borderBottomWidth: 0,
    },
    deleteText: {
        color: 'red',
    },
    viewModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewModalContent: {
        backgroundColor: 'white',
        width: '90%',
        maxHeight: '80%',
        borderRadius: 10,
        padding: 20,
    },
    viewModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    viewModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    reminderItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    reminderTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    reminderDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    noRemindersText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
});

export default CategoriesScreen;