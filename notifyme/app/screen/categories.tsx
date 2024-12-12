import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore'; // Import Firestore
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

    const renderCategory = ({ item }: { item: Category }) => (
        <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <TouchableOpacity onPress={() => { /* Handle more options */ }} style={styles.moreOptionsButton}>
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

            {/* Create New Button */}
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => {
                    /* Handle create new category */
                }}
            >
                <MaterialIcons name="add" size={24} color="black" />
                <Text style={styles.createButtonText}> Create New</Text>
            </TouchableOpacity>
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
});

export default CategoriesScreen;