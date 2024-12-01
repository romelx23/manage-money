import React, { FC } from 'react'
import { Alert, Text, TouchableOpacity } from 'react-native';
import * as XLSX from "xlsx";
import * as FileSystem from 'expo-file-system'; // Importar expo-file-system
import { shareAsync } from 'expo-sharing'; // Para compartir archivos
import { useSpentStore } from '../../../store/spent';
import { FontAwesome5 } from '@expo/vector-icons';

interface ButtonExportProps {
    title?: string;
}

export const ButtonExport: FC<ButtonExportProps> = ({ title }) => {
    const { spents } = useSpentStore();

    const handleExport = async () => {
        try {
            // Crear hoja de cálculo
            const worksheet = XLSX.utils.json_to_sheet(spents);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");

            // Escribir el archivo Excel en formato base64
            const excelBase64 = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });

            // Guardar el archivo en el sistema de archivos
            const fileUri = `${ FileSystem.documentDirectory }gastos.xlsx`; // Ruta de guardado
            await FileSystem.writeAsStringAsync(fileUri, excelBase64, { encoding: FileSystem.EncodingType.Base64 });

            // Compartir el archivo con el usuario
            await shareAsync(fileUri);

            Alert.alert("Éxito", "El archivo Excel ha sido exportado y guardado correctamente.");
        } catch (error) {
            console.error("Error al exportar el archivo Excel:", error);
            Alert.alert("Error", "No se pudo exportar el archivo.");
        }
    }
    return (
        <TouchableOpacity
            onPress={() => {
                handleExport();
            }}
            className="bg-[#94df4a] p-5 rounded-xl flex flex-row items-center justify-center w-full"
        >
            <FontAwesome5 name="download" size={24} color="white" />
            {
                title &&
                <Text className="text-white font-bold text-lg ml-2">{title}</Text>
            }
        </TouchableOpacity>
    )
}
