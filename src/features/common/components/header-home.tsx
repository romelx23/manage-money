import { Image, Text, TouchableOpacity, View } from "react-native"
import { useAuthStore } from "../../../store/auth"
import { Link } from "expo-router"

interface HeaderHomeProps {
    headerTitle?: string
}

export const HeaderHome: React.FC<HeaderHomeProps> = ({ headerTitle }) => {
    const { user } = useAuthStore()
    return (
        <View className="w-full flex-row justify-between items-center px-5 pt-3 ">
            {/* <View className="w-full flex-row justify-between items-center px-5 pt-3 bg-gray-700 "> */}
            <View className="flex flex-col items-start">
                <Text className="text-2xl font-bold text-white">English Quiz</Text>
                <Text className="text-lg font-bold text-white">
                    {headerTitle || "Home"}
                </Text>
            </View>
            {/* <TouchableOpacity
                className="flex justify-center items-center bg-orange-700 p-2 w-12 rounded-full border border-white"
                onPress={() => { }}>
            </TouchableOpacity> */}
            {/* <Link href="/(tabs)/home/profile"
                className="flex justify-center items-center bg-orange-700 p-2 rounded-full border border-white"
            > */}
            <Image
                source={{ uri: "https://res.cloudinary.com/react-romel/image/upload/v1727972709/apps/english-quiz/world-book-day_klbkbx.png" }}
                style={{ width: 35, height: 35, borderRadius: 12 }}
                className="block"
            />
            {/* </Link> */}
        </View>
    )
}
