import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Spent, useSpentStore } from '../src/store/spent';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import ListSpents from '../src/features/home/components/list-spents';

export const colorsCard = [
    {
        id: 1,
        color: '#9eec50',
        url: 'https://res.cloudinary.com/react-romel/image/upload/v1732297952/apps/expenses/rb_19357_o4u4u9.webp'
    },
    {
        id: 2,
        color: '#50ec9e',
        url: 'https://res.cloudinary.com/react-romel/image/upload/v1732743302/apps/expenses/14.woman_ffrd_htbao9.webp'
    },
    {
        id: 3,
        color: '#ec9e50',
        url: 'https://res.cloudinary.com/react-romel/image/upload/v1732743265/apps/expenses/9.mindfulness_8gqa_txhb26.webp'
    },
    {
        id: 4,
        color: '#ec509e',
        url: 'https://res.cloudinary.com/react-romel/image/upload/v1732743268/apps/expenses/12.traveling_yhxq_vhehji.webp'
    },
    {
        id: 5,
        color: '#9e50ec',
        url: 'https://res.cloudinary.com/react-romel/image/upload/v1732743259/apps/expenses/3.doctors_p6aq_ai9i6k.webp'
    },
    {
        id: 6,
        color: '#509eec',
        url: 'https://res.cloudinary.com/react-romel/image/upload/v1732743261/apps/expenses/5.grand_slam_84ep_yguc1m.webp'
    },
    {
        id: 7,
        color: '#f965b9',
        url: 'https://res.cloudinary.com/react-romel/image/upload/v1732743260/apps/expenses/4.electricity_k2ft_ubzodi.webp'
    },
    {
        id: 8,
        color: '#f9ed65',
        url: 'https://res.cloudinary.com/react-romel/image/upload/v1732743266/apps/expenses/10.passing_by_0un9_mfeubd.webp'
    },
    {
        id: 9,
        color: '#f9ac65',
        url: 'https://res.cloudinary.com/react-romel/image/upload/v1732743256/apps/expenses/1.automobile_repair_ywci_nylao0.webp'
    }
];

const HomeScreen = () => {

    const [theme, setTheme] = useState('light');
    const [selectedSpents, setSelectedSpents] = useState<Spent[]>([]);

    const { spents, loadStore, amounts, getAmount, setSelectCard, selectCard, getSelectedCard } = useSpentStore();

    useEffect(() => {
        const loadInitialData = async () => {
            await loadStore(); // Carga spents y amounts
            await getSelectedCard(); // Carga la tarjeta seleccionada
        };

        loadInitialData();
    }, []);

    const router = useRouter();

    console.log({ selectCard });
    console.log({ spents });
    console.log({ selectedSpents });

    return (
        <Animated.View
            entering={FadeInLeft}
            exiting={FadeOutRight}
            className="flex-1 p-4 bg-white"
            style={{
                // backgroundColor: theme === 'light' ? '#f9f9f9' : '#333',
                // color: theme === 'light' ? '#333' : '#f9f9f9'
            }}
        >
            <View className="flex flex-row justify-between items-center mb-1 mt-2">
                <Text className="text-xl font-bold ">Gastitos</Text>
                {/* <TouchableOpacity
                    onPress={() => {
                        console.log("theme", theme);
                        setTheme(theme === 'light' ? 'dark' : 'light');
                    }}
                    className="bg-yellow-400 p-2 rounded-full"
                >
                    <Ionicons name="sunny" size={24} color="white" />
                </TouchableOpacity> */}
                <View className="flex flex-row justify-end items-center mb-1">
                    <TouchableOpacity
                        onPress={() => {
                            AsyncStorage.setItem("spent", JSON.stringify([]))
                            AsyncStorage.setItem("spents", JSON.stringify([]))
                            AsyncStorage.setItem("amount", "")
                            AsyncStorage.setItem("amounts", JSON.stringify([]))
                            AsyncStorage.setItem("selectCard", JSON.stringify({}))
                            router.navigate("config")
                        }}
                        className="bg-blue-500 p-2 w-10 h-10 items-center justify-center rounded-full mr-1"
                    >
                        <MaterialCommunityIcons name="restore" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            router.navigate("config")
                        }}
                        className="bg-blue-500 p-2 w-10 h-10 items-center justify-center rounded-full"
                    >
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>


            {/* {
                enter ? ( */}

            {/* list amounts */}
            <View className='h-48'>

                {
                    amounts.length !== 0 ?
                        <FlatList
                            id="list amounts"
                            data={amounts}
                            keyExtractor={(amount) => amount.id}
                            horizontal={true}
                            contentContainerStyle={{ paddingVertical: 1 }}
                            renderItem={({ item, index }) => (
                                <Animated.View
                                    entering={FadeInLeft.duration(1200)}
                                    exiting={FadeOutRight.duration(1200)}
                                    className="h-44 w-auto mb-2 mr-2 py-4 px-6 flex flex-row justify-between rounded-md"
                                    style={{
                                        // backgroundColor: colorsCard[index].color
                                        backgroundColor: item.colour
                                    }}
                                >
                                    <View className="w-auto flex justify-center mb-4 ">
                                        <Text className="text-2xl text-white font-bold pb-1">Monto Mensual</Text>
                                        {/* <Text className="text-3xl text-white font-bold">${monthlyBudget ? monthlyBudget : '0'}</Text> */}
                                        <Text className="text-3xl text-white font-bold">
                                            {
                                                item.currency === 'USD' ? '$' : 'S/.'
                                            }
                                            {item.amount}
                                        </Text>
                                        <Text className="text-base text-white font-bold pb-1">{item.title}</Text>
                                        <Text className="text-sm text-white font-bold pb-1">original: {item.originalAmount}</Text>
                                    </View>
                                    <Image
                                        // source={{ uri: 'https://res.cloudinary.com/react-romel/image/upload/v1732297952/apps/expenses/rb_19357_o4u4u9.webp' }}
                                        // source={{ uri: colorsCard[index].url }}
                                        source={{ uri: item.image }}
                                        className="w-36 h-36"
                                        style={{
                                            objectFit: 'contain'
                                        }}
                                    />
                                    <View
                                        className='absolute bottom-4 right-4 space-y-1'
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectCard(item)
                                            }}
                                            className="bg-white p-2 w-10 h-10 items-center justify-center rounded-full"
                                        >
                                            <Ionicons
                                                name={selectCard?.id === item.id ? "star" : "star-outline"}
                                                size={20}
                                                color={selectCard?.id === item.id ? "#ffdd34" : "#ffffffed"}
                                                style={{
                                                    textShadowColor: 'rgba(0, 0, 0, 0.464)',
                                                    textShadowOffset: { width: -1, height: 1 },
                                                    textShadowRadius: 10
                                                }}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                router.navigate(`config/${ item.id }`)
                                            }}
                                            className="bg-blue-500 p-2 w-10 h-10 items-center justify-center rounded-full"
                                        >
                                            <Ionicons name="pencil" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            )
                            }
                        />
                        :
                        <View className="h-44 w-auto mb-2 mr-2 py-4 px-6 flex justify-end rounded-md bg-[#9eec50]">
                            <Image
                                source={require('../assets/save.png')}
                                className="w-20 h-20 object-contain mx-auto"
                            />
                            <Link
                                href="config"
                                className="p-2 mt-2 text-center bg-white rounded-lg"
                            >
                                <Text className="text-lg">Configurar Monto</Text>
                            </Link>
                        </View>
                }
            </View>


            {/* ) */}
            {/* :
                     <View className="mb-4">
                         <Text className="text-lg">Total Amount per Month:</Text>
                         <TextInput
                             className="border p-2 mt-2"
                             keyboardType="numeric"
                             placeholder="Enter Amount"
                            value={'0'}
                             onChangeText={handleAmountChange}
                             // onSubmitEditing={handleAmount}
                             right={<FontAwesome5 name="dollar-sign" size={24} color="black" />}
                         />
                     </View>
             } */}

            {/* floating button touchable opacity to spent route */}
            {/* {
                !enter &&
                <View className="absolute bottom-4 left-4 z-10">
                    <TouchableOpacity onPress={() => {
                        console.log("configurar monto");
                        // handleAmount();
                    }}>
                        <View className="w-full bg-blue-500 p-4 rounded-full">
                            <Text className="text-white">Configurar Monto</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            } */}
            {
                amounts.length !== 0 &&
                <View className="absolute bottom-4 right-4 z-20">
                    <TouchableOpacity
                        onPress={() => {
                            console.log("spent");
                            router.push('/spent')
                        }}
                        className="bg-blue-500 p-5 rounded-full"
                    >
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                    {/* <Button
                        mode='text'
                        className='flex items-center justify-center h-20 w-20 rounded-full bg-blue-500 z-20 '
                        onPress={() => {
                            console.log("spent");
                            router.push('/spent')
                        }}
                        children={<Ionicons name="add" size={24} color="white" />}
                    >
                    </Button> */}
                </View>
            }

            <View className='flex flex-row justify-between items-center pb-1'>
                <Text className="text-lg font-bold mb-2">Lista de Gastos / Ingresos:</Text>
                <TouchableOpacity
                    onPress={async () => {
                        router.navigate("report")
                    }}
                    className='w-10 h-10 flex justify-center items-center bg-black p-2 rounded-full'
                >
                    <FontAwesome name="arrow-right" size={16} color="white" />
                </TouchableOpacity>
            </View>
            <ListSpents
                selectedSpents={selectedSpents}
                setSelectedSpents={setSelectedSpents}
            />

            <View className='flex flex-row justify-between items-start bg-[#f9f9f9]'>
                <View
                    className='flex flex-col justify-between items-center p-2 rounded-md  w-1/2'
                >
                    <Text className="text-base font-bold">Total Gastos:</Text>
                    {/* sumar solo gastos */}
                    <Text className="text-base font-bold">
                        {
                            selectCard &&
                                getAmount(selectCard.id)?.currency === 'USD' ? '$' : ' S/.'
                        }
                        {
                            selectedSpents.reduce((sum, item) => {
                                return item.type === 'gasto' ? sum + item.amount : sum;
                            }, 0)
                        }
                    </Text>
                </View>
                <View
                    className='flex flex-col justify-between items-center p-2 rounded-md  w-1/2'
                >
                    <Text className="text-base font-bold">Total Ingresos:</Text>
                    {/* sumar solo gastos */}
                    <Text className="text-base font-bold">
                        {
                            selectCard &&
                                getAmount(selectCard.id)?.currency === 'USD' ? '$' : ' S/.'
                        }
                        {
                            selectedSpents.reduce((sum, item) => {
                                return item.type === 'ingreso' ? sum + item.amount : sum;
                            }, 0)
                        }
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};

export default HomeScreen;