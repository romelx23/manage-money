import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface OnboardingData {
    id: number;
    title: string;
    description: string;
    image: string;
}

const onboardingData: OnboardingData[]
    = [
        {
            id: 1,
            title: 'Bienvenido a Gastitos',
            description: 'Aprende a manejar tu dinero de forma sencilla y eficaz.',
            image: 'https://res.cloudinary.com/react-romel/image/upload/v1732750243/apps/expenses/onboarding_dkjlt6.webp',
        },
    ];

export const OnboardingScreen: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Cambiamos el tipo de null a FlatList<T> o null
    const ref = React.useRef<FlatList<OnboardingData> | null>(null);

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            console.log({ currentIndex });
            // Verificación de que ref.current no sea null antes de usar scrollToIndex
            setCurrentIndex((prevIndex) => prevIndex + 1); // Usamos el valor anterior para evitar el problema de asincronía
            if (ref.current) {
                ref.current.scrollToIndex({ index: currentIndex, animated: true });
            }
        } else {
            router.replace('/config');
            AsyncStorage.setItem('onboarding', 'true');
        }
    };

    // const handleSkip = () => {
    //     router.replace('/home');
    //     AsyncStorage.setItem('onboarding', 'true');
    // };

    console.log({ currentIndex });

    const renderItem: ListRenderItem<OnboardingData> = ({ item }) => (
        <View style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View className='w-full absolute pb-16 pt-4 bottom-0 bg-white rounded-t'>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    // Cálculo del índice al final del desplazamiento
    const handleScrollEnd = (event: any) => {
        const index = Math.floor(event.nativeEvent.contentOffset.x / width);
        if (index !== currentIndex) {
            setCurrentIndex(index); // Solo actualiza si el índice realmente cambia
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={onboardingData}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                ref={ref}
                onMomentumScrollEnd={handleScrollEnd}
                keyExtractor={(item) => item.id.toString()}
            />

            <View style={styles.navigationContainer}>
                <View style={styles.pagination}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === (index) ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.buttons}>
                    {/* <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                        <Text style={styles.skipButtonText}>Saltar</Text>
                    </TouchableOpacity> */}
                    <View />
                    <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>
                            {currentIndex === onboardingData.length - 1 ? 'Empezar' : 'Siguiente'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    slide: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    navigationContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 20,
        position: 'absolute',
        top: -10,
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#50d56a',
    },
    inactiveDot: {
        backgroundColor: '#ccc',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: -15,
        width: '80%',
    },
    skipButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
    },
    skipButtonText: {
        color: '#333',
    },
    nextButton: {
        backgroundColor: '#50d56a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
    },
    nextButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
