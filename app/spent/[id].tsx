import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router, usePathname } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { generateId, useSpentStore } from "../../src/store/spent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { listCategories } from ".";

const EditSpentScreen = () => {
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("food");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"ingreso" | "gasto">("ingreso");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedAmountId, setSelectedAmountId] = useState("");

    const pathname = usePathname();

    const id = pathname.split("/")[2];

    // Zustand actions
    const { editSpent, getSpent, getAmounts } = useSpentStore();
    const amounts = getAmounts();

    useEffect(() => {
        if (id) {
            const spent = getSpent(id);
            if (spent) {
                setDescription(spent.description);
                setCategory(spent.category);
                setAmount(spent.amount.toString());
                setType(spent.type);
                setDate(new Date(spent.date) || new Date());
                setSelectedAmountId(spent.amountId);
            }
        }
    }
        , [id]);

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

            editSpent({
                id,
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
            <View className="flex flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">Editar Gasto / Ingreso</Text>
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

            <Text style={styles.label}>Category</Text>
            <Picker
                selectedValue={category}
                style={styles.input}
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

            <Text style={styles.label}>Amount</Text>
            <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Type</Text>
            <Picker
                selectedValue={type}
                style={styles.input}
                onValueChange={(itemValue) => setType(itemValue as "ingreso" | "gasto")}
            >
                <Picker.Item label="Ingreso" value="ingreso" />
                <Picker.Item label="Gasto" value="gasto" />
            </Picker>

            <Text style={styles.label}>Card</Text>
            <Picker
                selectedValue={selectedAmountId}
                style={styles.input}
                onValueChange={(itemValue) => setSelectedAmountId(itemValue)}
            >
                {amounts.map((amount) => (
                    <Picker.Item key={amount.id} label={amount.title} value={amount.id} />
                ))}
            </Picker>

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
                className="border p-2 bg-gray-100 mb-4"
                onPress={() => setShowDatePicker(true)}
            >
                <Text>{date?.toDateString()}</Text>
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
                    Editar Ingreso / Gasto
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
});

export default EditSpentScreen;
