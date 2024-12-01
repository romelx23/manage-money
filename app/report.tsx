import React, { useState } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Spent, useSpentStore } from "../src/store/spent";
import { Picker } from "@react-native-picker/picker";
import { listCategories } from "./spent";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ButtonExport } from "../src/features/home/components/button-export";
import { router, usePathname, useRouter } from "expo-router";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Animated, { FadeIn, FadeInLeft, FadeInUp, FadeOut, FadeOutRight } from "react-native-reanimated";

const ReportScreen = () => {
    const { spents, getAmounts } = useSpentStore(); //filterSpentsByCategory
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selected, setSelected] = useState<Spent | null>();
    const [selectedAmountId, setSelectedAmountId] = useState("");

    const route = useRouter();
    const pathname = usePathname();

    // get id from url
    const id = pathname.split("/")[2];

    console.log("id", id);

    const {
        removeSpent,
        editSpent
    } = useSpentStore();

    const onDateChange = (
        event: DateTimePickerEvent,
        selectedDate: Date | undefined
    ) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const filteredSpents = spents
        .filter((spent) =>
            category ? spent.category === category : true
        )
        .filter((spent) =>
            type ? spent.type === type : true
        )
        .filter((spent) =>
            spent.description.toLowerCase().includes(search.toLowerCase())
        )
        .filter((spent) =>
            date ? new Date(spent.date).toDateString() === date.toDateString() : true
        )
        .filter((spent) =>
            selectedAmountId ? spent.amountId === selectedAmountId : true
        );

    const amounts = getAmounts();

    return (
        <View className="flex-1 bg-white">
            <View className="flex flex-row justify-between items-center mb-0 py-2 pt-6 px-4 shadow-md sticky ">
                <Text className="text-xl font-bold">
                    Reporte de gastos e ingresos
                </Text>
                <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-md"
                    onPress={() => router.navigate("/home")}
                >
                    <Ionicons name="close-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="pt-0 px-2"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
            >
                <Animated.View
                    entering={FadeInUp}
                    exiting={FadeOut}
                    style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar por descripción"
                        value={search}
                        onChangeText={setSearch}
                    />
                    <Picker
                        selectedValue={category}
                        style={styles.input}
                        onValueChange={(itemValue) => setCategory(itemValue)}
                    >
                        <Picker.Item label="Todas las Categorías" value="" />
                        {listCategories.map((cat) => (
                            <Picker.Item key={cat.label} label={cat.label} value={cat.value}
                                style={{ width: '100%' }}
                            />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={type}
                        style={styles.input}
                        onValueChange={(itemValue) => setType(itemValue)}
                    >
                        <Picker.Item label="Todos los Tipos" value="" />
                        <Picker.Item label="Ingreso" value="ingreso" />
                        <Picker.Item label="Gasto" value="gasto" />
                    </Picker>
                    <Picker
                        selectedValue={selectedAmountId}
                        style={styles.input}
                        onValueChange={(itemValue) => setSelectedAmountId(itemValue)}
                    >
                        <Picker.Item label="Todas las Tarjetas" value="" />
                        {amounts.map((amount) => (
                            <Picker.Item key={amount.id} label={amount.title} value={amount.id} />
                        ))}
                    </Picker>
                    {/* filter by date */}
                    <TouchableOpacity
                        className="border p-2 bg-gray-100 mb-4"
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text>{date ? date.toDateString() : "Selecciona una fecha"}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date || new Date()} // Usa la fecha actual como valor predeterminado
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                    {/* clean search and filter button */}

                    <View className="flex flex-row justify-betweenp pb-3">
                        <TouchableOpacity
                            className="w-full bg-blue-500 px-4 py-3 rounded-md flex flex-row justify-center items-center space-x-1"
                            onPress={() => {
                                setSearch("");
                                setCategory("");
                                setType("");
                                setDate(null); // Restablecer la fecha a null
                            }}
                        >
                            <MaterialIcons name="cleaning-services" size={24} color="white" />
                            <Text className="text-white font-semibold">Limpiar busqueda</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <FlatList
                    data={filteredSpents}
                    keyExtractor={(item) => item.id}
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                        <View className="w-full flex flex-row py-3 px-4 bg-white rounded-md shadow-md mb-2"
                            style={{
                                backgroundColor: item.type === "ingreso" ? "#D1FAE5" : "#FEE2E2",
                            }}
                        >
                            <View className="flex flex-col justify-center items-start w-3/4 ">
                                <Text
                                    className="text-lg font-semibold"
                                >{item.description}</Text>
                                <View
                                    className="flex flex-row justify-between items-center"
                                >
                                    <Text
                                        className="my-0.5 text-sm text-gray-600 bg-white px-2 py-1 rounded-md"
                                    >{item.category}</Text>
                                </View>
                                <Text>{new Date(item.date).toLocaleDateString()}</Text>
                            </View>
                            <View
                                className="flex flex-col justify-center items-center w-1/4"
                            >
                                <View>
                                    {
                                        item.type === "ingreso" ? (
                                            <MaterialCommunityIcons name="arrow-up" size={44} color="green" />
                                        ) : (
                                            <MaterialCommunityIcons name="arrow-down" size={44} color="red" className="" />
                                        )
                                    }
                                </View>
                                <Text
                                    className="text-lg font-semibold"
                                    style={{
                                        color: item.type === "ingreso" ? "green" : "red",
                                    }}
                                >${item.amount}</Text>
                                <Text
                                    className="text-lg font-semibold "
                                    style={{
                                        color: item.type === "ingreso" ? "green" : "red",
                                    }}
                                >
                                    {item.type === "ingreso" ? "Ingreso" : "Gasto"}
                                </Text>
                            </View>
                        </View>
                    )}
                /> */}
                    {
                        filteredSpents.map((item) => (
                            <View
                                key={item.id}
                                className="w-full flex flex-row py-2 px-4 bg-white rounded-md shadow-md mb-2"
                                style={{
                                    backgroundColor: item.type === "ingreso" ? "#D1FAE5" : "#FEE2E2",
                                }}
                            >
                                <View className="flex flex-col justify-center items-start w-3/4 ">
                                    <Text
                                        className="text-lg font-semibold"
                                    >
                                        {
                                            item.description.length > 20 ? item.description.substring(0, 20) + "..." : item.description
                                        }
                                    </Text>
                                    <View
                                        className="flex flex-row justify-between items-center"
                                    >
                                        <Text
                                            className="my-0.5 text-sm text-gray-600 bg-white px-2 py-1 rounded-md"
                                        >{item.category}</Text>
                                    </View>
                                    <Text>{
                                        new Date(item.date).toLocaleDateString('es-Es', {
                                            year: '2-digit',
                                            month: '2-digit',
                                            day: 'numeric',
                                        })
                                    }</Text>
                                </View>
                                <View
                                    className="flex flex-col justify-center items-center w-1/4"
                                >
                                    <View>
                                        {
                                            item.type === "ingreso" ? (
                                                <MaterialCommunityIcons name="arrow-up" size={44} color="green" />
                                            ) : (
                                                <MaterialCommunityIcons name="arrow-down" size={44} color="red" className="" />
                                            )
                                        }
                                    </View>
                                    <Text
                                        className="text-lg font-semibold"
                                        style={{
                                            color: item.type === "ingreso" ? "green" : "red",
                                        }}
                                    >${item.amount}</Text>
                                    <Text
                                        className="text-lg font-semibold "
                                        style={{
                                            color: item.type === "ingreso" ? "green" : "red",
                                        }}
                                    >
                                        {item.type === "ingreso" ? "Ingreso" : "Gasto"}
                                    </Text>
                                </View>
                                {/* more button */}
                                <TouchableOpacity
                                    className=" px-2 py-1 rounded-md
                                    absolute top-0 right-0
                                    "
                                    onPress={() => {
                                        setSelected(item);
                                    }}
                                >
                                    <MaterialIcons name="more-vert" size={24} color="black" />
                                </TouchableOpacity>
                                {/* more options delete and edit*/}
                                {
                                    selected && selected.id === item.id && (
                                        <Animated.View
                                            className="flex flex-col justify-center items-center bg-white px-3 py-2 absolute right-0 top-0 space-y-1"
                                            entering={FadeInLeft}
                                            exiting={FadeOutRight}
                                        >
                                            <TouchableOpacity
                                                className="w-full bg-gray-200 py-1 flex items-center justify-center px-0 rounded-md"
                                                onPress={() => {
                                                    setSelected(null);
                                                }}
                                            >
                                                <MaterialIcons name="close" size={20} color="black" />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                className="bg-red-500 px-2 py-1 rounded-md"
                                                onPress={
                                                    () => {
                                                        removeSpent(item.id);
                                                        setSelected(null);
                                                    }
                                                }
                                            >
                                                <MaterialIcons name="delete" size={24} color="white" />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                className="bg-blue-500 px-2 py-1 rounded-md "
                                                onPress={
                                                    () => {
                                                        router.navigate("/spent/" + item.id);
                                                        setSelected(null);
                                                    }
                                                }
                                            >
                                                <MaterialIcons name="edit" size={24} color="white" />
                                            </TouchableOpacity>
                                        </Animated.View>
                                    )
                                }
                            </View>
                        ))
                    }
                    <View className="w-full flex flex-row justify-between items-center py-2 px-4 rounded-md shadow-md border mb-2">
                        <Text className="text-base font-semibold">
                            total de items:
                        </Text>
                        <View className="flex flex-col justify-center items-center w-1/4">
                            <Text className="text-lg font-semibold">
                                {filteredSpents.length}
                            </Text>
                        </View>
                    </View>
                    <View className="w-full flex flex-row justify-between items-center py-3 px-4  rounded-md shadow-md border mb-2">
                        <View className="flex flex-col justify-center items-start w-3/4">
                            <Text className="text-lg font-semibold">Total</Text>
                        </View>
                        <View className="flex flex-col justify-center items-center w-1/4">
                            <Text className="text-lg font-semibold">${filteredSpents.reduce((acc, item) => acc + item.amount, 0)}</Text>
                        </View>
                    </View>
                </Animated.View>

                <View className="w-full flex flex-row justify-between items-center py-3 px-4  rounded-md shadow-md mt-3">
                    <ButtonExport title="Descargar" />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    input: {
        height: 40,
        // borderColor: "gray",
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
        // backgroundColor: "#fff",
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
});

export default ReportScreen;
