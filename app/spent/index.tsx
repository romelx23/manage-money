import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { generateId, useSpentStore } from "../../src/store/spent";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const listCategories = [
    // Categorías de gastos
    { label: "Alimentos", value: "alimentos" },
    { label: "Transporte", value: "transporte" },
    { label: "Entretenimiento", value: "entretenimiento" },
    { label: "Deportes", value: "deportes" },
    { label: "Salud", value: "salud" },
    { label: "Hogar", value: "hogar" },
    { label: "Educación", value: "educacion" },
    { label: "Ropa", value: "ropa" },
    { label: "Viajes", value: "viajes" },
    { label: "Mascotas", value: "mascotas" },
    { label: "Facturas", value: "facturas" },
    { label: "Otros", value: "otros" },

    // Categorías de ingresos
    { label: "Salario", value: "salario" },
    { label: "Inversiones", value: "inversiones" },
    { label: "Ventas", value: "ventas" },
    { label: "Regalos", value: "regalos" },
    { label: "Freelance", value: "freelance" },
    { label: "Intereses", value: "intereses" },
    { label: "Reembolsos", value: "reembolsos" },
    { label: "Otros ingresos", value: "otros_ingresos" }
];

const AddSpentScreen = () => {
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("food");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"ingreso" | "gasto">("ingreso");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedAmountId, setSelectedAmountId] = useState("");

    // Zustand actions
    const { addSpent, getAmounts } = useSpentStore();
    const amounts = getAmounts();

    // Establecer la primera tarjeta por defecto
    useEffect(() => {
        if (amounts.length > 0) {
            setSelectedAmountId(amounts[0].id);
        }
    }, [amounts]);

    const onDateChange = (
        event: DateTimePickerEvent,
        selectedDate: Date | undefined
    ) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const handleSubmit = async () => {
        try {
            const parsedAmount = parseFloat(amount);
            if (!description || !parsedAmount || isNaN(parsedAmount)) {
                alert("Por favor, llena todos los campos correctamente.");
                return;
            }

            addSpent({
                // id: generateId(),
                description,
                category,
                amount: parsedAmount,
                type, date,
                amountId: selectedAmountId
            });

            // añadir gasto a asyncstorage
            const spent = await AsyncStorage.getItem("spent");
            const parsedSpent = spent ? JSON.parse(spent) : [];
            const newSpent = [
                ...parsedSpent,
                { description, category, amount: parsedAmount, type, date },
            ];
            await AsyncStorage.setItem("spent", JSON.stringify(newSpent));

            router.navigate("/home");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <View className="flex flex-row justify-between items-center py-2">
                <Text className="text-xl font-bold">Agregar Gasto / Ingreso</Text>
                <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-md"
                    onPress={() => router.navigate("/home")}
                >
                    <Ionicons name="close-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
            />

            <Text style={styles.label}>Amount</Text>
            <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Tipo</Text>
            <Picker
                selectedValue={type}
                style={styles.picker}
                onValueChange={(itemValue) => setType(itemValue as "ingreso" | "gasto")}
            >
                <Picker.Item label="Ingreso" value="ingreso" />
                <Picker.Item label="Gasto" value="gasto" />
            </Picker>

            <Text style={styles.label}>Tarjeta</Text>
            <Picker
                selectedValue={selectedAmountId}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedAmountId(itemValue)}
            >
                {amounts.map((amount) => (
                    <Picker.Item key={amount.id} label={amount.title} value={amount.id} />
                ))}
            </Picker>


            <Text style={styles.label}>Categoría</Text>
            <Picker
                selectedValue={category}
                style={styles.picker}
                onValueChange={(itemValue) => setCategory(itemValue)}
            >
                {/* <Picker.Item label="Food" value="comida" />
                <Picker.Item label="Sports" value="deportes" /> */}
                {
                    listCategories.map((item, index) => (
                        <Picker.Item key={index} label={item.label} value={item.value} />
                    ))
                }
                {/* Add more categories as needed */}
            </Picker>

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
                className="border p-2 bg-gray-100 mb-4"
                onPress={() => setShowDatePicker(true)}
            >
                <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <TouchableOpacity
                className="bg-blue-500 px-4 py-3 rounded-md flex flex-row justify-center items-center"
                onPress={handleSubmit}
            >
                <Ionicons name="add" size={24} color="white" className="font-bold" />
                <Text className="text-white font-bold">
                    Agregar Ingreso / Gasto
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    picker: {
        height: 40,
        borderColor: "#b59fdb",
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
});

export default AddSpentScreen;
