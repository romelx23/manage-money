import { FC } from "react";

import { useEffect, useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
interface AnimatedContainerProps {
    children: React.ReactNode;
}

export const AnimatedContainer: FC<AnimatedContainerProps> = ({ children }) => {


    const opacity = useSharedValue(0);
    const translateX = useSharedValue(50);

    // Animamos la opacidad y posición cuando se monta la vista
    useEffect(() => {
        opacity.value = withTiming(1, { duration: 500 });
        translateX.value = withTiming(0, { duration: 500 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <Animated.View
            className="w-full flex-1"
            style={[animatedStyle]}
        >
            {children}
        </Animated.View>
    )
}
