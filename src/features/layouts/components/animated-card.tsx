import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    index: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className, index }) => {

    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            delay: index * 500,
            useNativeDriver: true
        })
    }), [opacity, index]

    return (
        <Animated.View style={{ opacity }}>
            <View>
                {children}
            </View>
        </Animated.View>
    )
}
