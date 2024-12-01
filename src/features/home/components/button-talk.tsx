import React from 'react'
import * as Speech from 'expo-speech';
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

interface ButtonTalkProps {
    title: string;
    text: string;
    lang?: string;
    className?: string;
}

export const ButtonTalk = ({ title, text, lang, className }: ButtonTalkProps) => {

    const handleTalk = (input: string, lang: string = 'en') => {
        Speech.speak(input, {
            language: lang,
            volume: 1.0,
        });
    }

    return (
        <TouchableOpacity
            onPress={() => handleTalk(text, lang)}
            className={"flex flex-row items-center justify-center bg-gray-200 px-3 py-2 space-x-2 rounded-lg mt-4" + className}
        >
            <Text className="font-bold p-0">
                {title}
            </Text>
            <Ionicons name="volume-high" size={18} color="black" />
        </TouchableOpacity>
    )
}
