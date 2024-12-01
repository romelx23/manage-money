import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Spent, useSpentStore } from '../../../store/spent';
import { SpentItem } from './spent-item';

import { isSameDay as isSameDayFns, parseISO } from "date-fns";

interface IListSpentProps {
    selectedSpents: Spent[];
    setSelectedSpents: (spents: Spent[]) => void;
}

export default function ListSpents<T>({ selectedSpents, setSelectedSpents }: IListSpentProps) {

    const { spents, selectCard } = useSpentStore();


    const isSameDay = (date1: string, date2: Date) => {
        const parsedDate1 = typeof date1 === "string" ? parseISO(date1) : date1; // Convierte la fecha de string a Date
        return isSameDayFns(parsedDate1, date2); // Compara si son del mismo día
    };

    // const handleCardSpents = (id: string) => {
    //     const filterSpents = spents.filter(spent => spent.amountId === id)
    //     // .filter((spent) => isSameDay(spent.date.toString(), new Date()));
    //     console.log({ filterSpents });
    //     setSelectedSpents(filterSpents);
    // }

    // const handleCardSpents = useCallback(
    //     (id: string) => {
    //         const filterSpents = spents.filter(spent => spent.amountId === id);
    //         setSelectedSpents(filterSpents);
    //     },
    //     [spents, setSelectedSpents] // Dependencias necesarias
    // );

    // const filteredSpents = useMemo(() => {
    //     if (!selectCard) return [];
    //     return spents.filter(spent => spent.amountId === selectCard.id);
    // }, [spents, selectCard]);

    // useEffect(() => {
    //     setSelectedSpents(filteredSpents);
    // }, [filteredSpents]);

    // useEffect(() => {
    //     if (selectCard) {
    //         handleCardSpents(selectCard.id);
    //     }
    // }, [selectCard]);

    const filteredSpents = useMemo(() => {
        if (!selectCard) return [];
        return spents.filter(spent => spent.amountId === selectCard.id);
    }, [spents, selectCard]);

    useEffect(() => {
        setSelectedSpents(filteredSpents);
    }, [filteredSpents, setSelectedSpents]);

    const sortedSpents = useMemo(() => {
        return selectedSpents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedSpents]);

    return (
        <>
            {
                selectedSpents.length !== 0 ?
                    <FlatList
                        className=' pb-10 mb-3 '
                        data={sortedSpents}
                        renderItem={({ item }) => (
                            <SpentItem
                                key={item.id}
                                item={item}
                            />
                        )}
                    />
                    :
                    <View className="mb-4 h-60 justify-center items-center">
                        <Text className="text-lg">No hay gastos</Text>
                    </View>
            }
        </>
    )
}