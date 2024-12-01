import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { FC } from 'react'
import { Text, View } from 'react-native'
import { Spent, useSpentStore } from '../../../store/spent'

interface SpentItemProps {
    item: Spent
}

export const SpentItem: FC<SpentItemProps> = ({ item }) => {

    const { getAmount } = useSpentStore()

    return (
        <View
            className="w-full flex flex-row py-2 px-4 bg-white rounded-md shadow-md mb-2"
            style={{
                backgroundColor: item.type === "ingreso" ? "#D1FAE5" : "#FEE2E2",
            }}
        >
            <View className="flex flex-col justify-center items-start w-3/4 ">
                <Text
                    className="text-lg font-semibold"
                >{
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
                    getAmount(item.amountId)?.title
                }</Text>
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
                >
                    {
                        getAmount(item.amountId)?.currency === 'USD' ? '$' : ' S/.'
                    }
                    {item.amount}
                </Text>
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
    )
}
