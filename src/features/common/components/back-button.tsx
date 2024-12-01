import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
    onPress: () => void;
}

export const BackButton = ({ onPress }: BackButtonProps) => (
    <TouchableOpacity onPress={onPress} className="absolute top-5 left-5">
        <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
);