import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { router, usePathname } from 'expo-router';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Amount, useSpentStore } from '../../src/store/spent';
import { colorsCard } from '../home';
import WheelColorPicker from "react-native-wheel-color-picker";
import { Picker } from '@react-native-picker/picker';

const ConfigScreen = () => {
    const [data, setData] = useState<Amount | null>(null);

    const { addAmount, editAmount, getAmount } = useSpentStore();
    const [showPicker, setShowPicker] = useState<boolean>(false);

    // const router = useRouter();
    // const [isEditing, setIsEditing] = useState(false);

    const pathname = usePathname();
    const amountId = pathname.split('/')[2];

    const handleAddCard = async () => {
        if (!data?.title || !data?.amount) {
            Alert.alert('Error', 'Please enter both title and amount');
            return;
        }

        await addAmount(data?.title.toLocaleUpperCase(), parseFloat(data?.amount.toString()));
        router.push('/home');
    };

    const handleEditCard = async () => {
        if (!data?.title || !data?.amount) {
            Alert.alert('Error', 'Please enter both title and amount');
            return;
        }

        await editAmount({
            id: amountId,
            title: data?.title.toLocaleUpperCase() || '',
            amount: parseFloat(data?.amount.toString()),
            originalAmount: parseFloat(data?.originalAmount.toString()),
            colour: data?.colour || '',
            image: data?.image || '',
            currency: data?.currency || 'USD',
        });
        router.push('/home');
    };

    useEffect(() => {
        if (amountId) {
            const amount = getAmount(amountId);
            if (amount) {
                setData(amount);
            }
        }
    }, [amountId]);


    // console.log(colorsCard);

    const handleSelectImage = (image: string) => {
        if (data) {
            setData({ ...data, image });
        }
    };

    return (
        <View className='flex-1 flex flex-col px-4 py-5'>
            <View className="flex flex-row justify-between items-center mb-0 shadow-md">
                <Text style={{ fontSize: 24, marginBottom: 20 }}>
                    Editar Tarjeta
                </Text>
                <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-md"
                    onPress={() => router.navigate("/home")}
                >
                    <Ionicons name="close-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Text className='text-lg font-semibold'>
                    Nombre de la tarjeta
                </Text>
                <TextInput
                    placeholder="Ej. Personal, Negocios, etc."
                    value={data?.title}
                    onChangeText={(title) => {
                        if (data) {
                            setData({ ...data, title });
                        }
                    }}
                    style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                />
                <Text className='text-lg font-semibold'>Monto</Text>

                <TextInput
                    placeholder="Ej. 1000"
                    value={data?.amount?.toString()}
                    onChangeText={(amount) => {
                        if (data) {
                            setData({ ...data, amount: parseFloat(amount) });
                        }
                    }}
                    keyboardType="numeric"
                    style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                />

                <Text className='text-lg font-semibold'>
                    Color
                </Text>

                {/* <TextInput
                placeholder="Ej. #FF0000"
                value={data?.colour}
                onChangeText={(colour) => {
                    if (data) {
                        setData({ ...data, colour });
                    }
                }}
                
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            /> */}

                {/* Botón para abrir el Color Picker */}
                <WheelColorPicker
                    color={data?.colour}
                    onColorChangeComplete={(color) => {
                        if (data) {
                            setData({ ...data, colour: color });
                        }
                    }}
                    thumbSize={30}
                // style={{
                //     width: 200,
                //     height: 200,
                //     marginBottom: 10,
                // }}
                />
                <View style={[
                    {
                        width: '100%',
                        height: 50,
                        borderRadius: 10,
                        marginTop: 10,
                        marginBottom: 2,
                    },
                ]}>
                    <Text
                        className='text-black w-full h-auto text-center text-lg font-semibold'
                        style={{
                            backgroundColor: data?.colour?.toString()
                        }}
                    >Color Actual</Text>
                </View>

                <Text className='text-lg font-semibold'>Moneda</Text>
                <Picker
                    selectedValue={data?.currency}
                    onValueChange={(itemValue) => {
                        if (data) {
                            setData({ ...data, currency: itemValue });
                        }
                    }}
                    style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                >
                    <Picker.Item label="USD" value="USD" />
                    <Picker.Item label="PEN" value="PEN" />
                </Picker>

                <Text className='text-lg font-semibold'>
                    Imagen
                </Text>

                <FlatList
                    data={colorsCard}
                    horizontal
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                { width: 80, height: 80, borderRadius: 10, margin: 5 },
                                data?.image === item.url && { borderWidth: 2, borderColor: 'black' }
                            ]}
                            onPress={() => handleSelectImage(item.url)}
                        >
                            <Image
                                source={{ uri: item.url }}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 10,
                                    backgroundColor: item.color
                                }} />
                        </TouchableOpacity>
                    )}
                />

                {/* <TouchableOpacity onPress={isEditing ? handleEditCard : handleAddCard}> */}
                <TouchableOpacity onPress={handleEditCard}>
                    <View
                        className='bg-blue-500 px-4 py-3 rounded-md flex flex-row justify-center items-center space-x-1'
                    >
                        <Ionicons name="card" size={24} color="white" />
                        <Text style={{ color: 'white' }}>{'Editar Tarjeta'}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ConfigScreen;