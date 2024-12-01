import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StartScreen = () => {

    const handleVerify = async () => {
        const onboarding = await AsyncStorage.getItem('onboarding');
        console.log({ onboarding });
        if (onboarding) {
            return <Redirect href="/home" />
        }
    }

    useEffect(() => {
        handleVerify();
    }, []);

    return (
        <View className="w-full h-full flex flex-1 flex-col">
            <Redirect href="/onboarding" />
            {/* <Redirect href="/(tabs)/home" /> */}
        </View>
    );
};

export default StartScreen;