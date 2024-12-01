import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Currency, useSpentStore } from '../../src/store/spent';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

const ConfigScreen = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<Currency>('USD');
    const { addAmount } = useSpentStore();
    const router = useRouter();

    const handleAddCard = async () => {
        if (!title || !amount) {
            Alert.alert('Error', 'Please enter both title and amount');
            return;
        }

        await addAmount(title.toLocaleUpperCase(), parseFloat(amount), undefined, undefined, currency);
        router.push('/home');
    };

    return (
        <View className='flex-1 flex flex-col px-4 py-5'>
            <View className="flex flex-row justify-between items-center mb-0 shadow-md">
                <Text style={{ fontSize: 24, marginBottom: 20 }}>
                    Agregar Nueva Tarjeta
                </Text>
                <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-md"
                    onPress={() => router.navigate("/home")}
                >
                    <Ionicons name="close-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Text className='text-lg font-semibold'>
                Nombre de la tarjeta
            </Text>
            <TextInput
                placeholder="Ej. Personal, Negocios, etc."
                value={title}
                onChangeText={setTitle}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <Text className='text-lg font-semibold'>Monto</Text>

            <TextInput
                placeholder="Ej. 1000"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <Text className='text-lg font-semibold'>Moneda</Text>
            <Picker
                selectedValue={currency}
                onValueChange={(itemValue) => setCurrency(itemValue)}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            >
                <Picker.Item label="USD" value="USD" />
                <Picker.Item label="PEN" value="PEN" />
            </Picker>
            <TouchableOpacity onPress={handleAddCard}>
                <View
                    className='bg-blue-500 px-4 py-3 rounded-md flex flex-row justify-center items-center space-x-1'
                >
                    <Ionicons name="card" size={24} color="white" />
                    <Text style={{ color: 'white' }}>Agregar Tarjeta</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ConfigScreen;