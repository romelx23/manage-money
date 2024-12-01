import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from '../../store/auth';

export const HomeDashboard = () => {
    // const [userInfo, setUserInfo] = useState(null);

    const { user } = useAuthStore();

    const [stats, setStats] = useState({
        totalVotes: 0,
        totalPolls: 0,
        votesThisMonth: 0,
        sharedPolls: 0,
    });

    // Load user info from AsyncStorage
    // useEffect(() => {
    //     const loadUserData = async () => {
    //         try {
    //             const userJSON = await AsyncStorage.getItem("user");
    //             if (userJSON) {
    //                 setUserInfo(JSON.parse(userJSON));
    //             }
    //         } catch (error) {
    //             console.error("Error retrieving user data:", error);
    //         }
    //     };
    //     loadUserData();
    // }, []);

    // Fetch stats (this could be from an API)
    useEffect(() => {
        const fetchStats = async () => {
            // Simulate an API call to fetch stats
            const response = {
                totalVotes: 120,
                totalPolls: 35,
                votesThisMonth: 15,
                sharedPolls: 8,
            };
            setStats(response);
        };
        fetchStats();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Welcome, {user?.name || 'User'}</Text>
            </View>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statTitle}>Total Votes</Text>
                    <Text style={styles.statValue}>{stats.totalVotes}</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statTitle}>Total Polls</Text>
                    <Text style={styles.statValue}>{stats.totalPolls}</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statTitle}>Votes This Month</Text>
                    <Text style={styles.statValue}>{stats.votesThisMonth}</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statTitle}>Shared Polls</Text>
                    <Text style={styles.statValue}>{stats.sharedPolls}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 16,
    },
    header: {
        backgroundColor: '#6200ea',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    statTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200ea',
    },
});
