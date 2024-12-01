// import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { FC } from 'react'
import { Text, View } from 'react-native'
import { Spent } from '../../../store/spent'

interface SpentItemProps {
    item: Spent
}

export const SpentItemV2: FC<SpentItemProps> = ({ item }) => {
    return (
        <View className='w-full flex flex-col justify-between items-center rounded-md shadow-md py-3 px-4 mb-1'
            style={{
                backgroundColor: item.type === "ingreso" ? "#D1FAE5" : "#FEE2E2",
            }}
        >
            <View className='flex flex-row'>
                <View className="flex flex-col justify-between w-3/4">
                    <Text className="text-lg">{item.description}</Text>
                    <View
                        className="flex flex-row justify-between items-center"
                    >
                        <Text
                            className="my-0.5 text-sm text-gray-600 bg-white px-2 py-1 rounded-md"
                        >{item.category}</Text>
                    </View>
                    <Text className="text-sm">
                        {item.type}
                    </Text>
                </View>
                <View className="flex flex-col items-center justify-center w-1/4 bg-[#f9f9f9] rounded-lg">
                    <Text className="text-lg">${item.amount}</Text>
                    <Text className="text-sm ">
                        {new Date(item.date).toLocaleDateString('es-Es', {
                            year: '2-digit',
                            month: '2-digit',
                            day: 'numeric',
                        })}
                    </Text>
                </View>
            </View>
        </View>
    )
}
