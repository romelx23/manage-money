import React, { useEffect, useState } from 'react';
import { Text, View, Image, Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

// Prevenir que se oculte la Splash Screen automáticamente
SplashScreen.preventAutoHideAsync();

export const SplashScreenComponent = () => {
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        // Simular la carga de datos
        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start();

            // Luego de 3 segundos, oculta la Splash Screen y navega a la pantalla principal
            setTimeout(async () => {
                await SplashScreen.hideAsync();
                // navigation.replace('Login'); // Navegar a la pantalla de Login
                // router.replace('auth/login');
                router.replace('/(tabs)/home');
            }, 3000);
        }, 1000);
    }, []);

    return (
        <View className="w-full flex-1 flex flex-col justify-center items-center bg-orange-400">
            <Animated.View style={{ opacity: fadeAnim }}
                className={'flex flex-col items-center'}
            >
                <Image
                    // source={require('./assets/anime-tinder.jpg')} // Asegúrate de tener tu logo aquí
                    source={{ uri: 'https://res.cloudinary.com/react-romel/image/upload/v1726765808/apps/manada%20digital/icon-dog-app_g5pt8s.webp' }}
                    style={{
                        width: 150,
                        height: 150,
                        borderRadius: 100,
                    }}
                />
                <Text className="text-4xl font-bold text-white mt-5">
                    Manada Digital
                </Text>
            </Animated.View>
        </View>
    );
};