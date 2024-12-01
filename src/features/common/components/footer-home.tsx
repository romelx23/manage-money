import React from 'react'
import { Text, View } from 'react-native'

export const FooterHome = () => {
    return (
        <View className="w-full flex-col justify-between items-center bg-transparent p-5 ">
            <Text className="text-sm font-bold text-white">
                Gracias por pertenecer a nuestra comunidad
            </Text>
            <Text className="text-sm font-semibold text-white">
                @2021 Manada Digital
            </Text>
        </View>
    )
}
