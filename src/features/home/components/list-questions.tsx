import { Ionicons } from '@expo/vector-icons'
import React, { FC, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { IGenQuestion } from '../../../(tabs)/game';
import { IQuestion } from '../../../store/question';
import { serverApi } from '../../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../../store/auth';
import { Link } from 'expo-router';

export interface IQuizQuestionProps {
    questions: IGenQuestion[];
}

interface IStart {
    type: string;
    status: boolean;
}
interface IChecked {
    count: number;
}

interface IAnswer {
    question: string;
    userAnswer: string;
    correctAnswer: string;
}

export const QuizQuestion: FC<IQuizQuestionProps> = ({ questions }) => {

    const [start, setStart] = useState<IStart>({
        type: '',
        status: false,
    })

    const [checked, setChecked] = useState<IChecked>({
        count: 0,
    })

    const [answers, setAnswers] = useState<IAnswer[]>([]);

    const handleFinishRound = () => {
        setStart({ type: '2', status: false });
        setChecked({ count: 0 });
        setAnswers([]);
    }

    return (
        <View className="w-full flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg m-auto">
            <Text className="text-lg font-bold">Prueba {questions.length}</Text>
            {
                start.status &&
                <Text className='text-sm mt-2'>
                    Total de preguntas: {questions.length} / {checked.count}
                </Text>
            }

            {
                !start.status && (
                    <>
                        <Text className="text-sm mt-2">Se Seleccionaron {questions.length} frases al azar</Text>
                        <TouchableOpacity
                            onPress={() => setStart({ type: '2', status: true })}
                            className="w-full flex flex-row items-center justify-center bg-gray-200 p-4 rounded-lg mt-4
                            shadow-md hover:shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110
                            "
                        >
                            <Text className="text-lg font-bold">Comenzar</Text>
                            <Ionicons name="play" size={24} color="black" />
                        </TouchableOpacity>
                    </>
                )
            }
            {
                start.status && start.type === '2' && (
                    <QuizQuestionList
                        questions={questions}
                        setChecked={setChecked}
                        checked={checked}
                        answers={answers}
                        setAnswers={setAnswers}
                    />
                )
            }

            {
                // checked.count >= questions.length && (
                <QuizResult
                    questions={questions}
                    checked={checked}
                    answers={answers}
                    handleFinishRound={handleFinishRound}
                />
                // )
            }


        </View>
    )
}

export interface IQuizQuestionListProps {
    questions: IGenQuestion[];
    setChecked: (value: React.SetStateAction<IChecked>) => void;
    checked: IChecked;
    answers: IAnswer[];
    setAnswers: (value: React.SetStateAction<IAnswer[]>) => void;
}

export const QuizQuestionList: FC<IQuizQuestionListProps> = ({ questions, setChecked, checked, answers, setAnswers }) => {

    const handleNext = (option: IQuestion) => {

        // console.log(option.name === questions[start.count].question);

        // setStart((prev) => ({
        //     ...prev,
        //     count: prev.count + 1,
        //     status: option.name === questions[start.count].question ? true : false
        // }))
        const currentQuestion = questions[checked.count];

        // const isCorrect = option.name === currentQuestion.question;

        const findCorrectAnswer = currentQuestion.options.find(
            (option) => option.name === currentQuestion.question
        );
        // Guarda la respuesta del usuario junto con la correcta
        setAnswers((prev) => [
            ...prev,
            {
                question: currentQuestion.question,
                userAnswer: option.spanish,
                correctAnswer: findCorrectAnswer?.spanish || '',
            },
        ]);

        // Avanza a la siguiente pregunta
        setChecked((prev) => ({
            ...prev,
            count: prev.count + 1,
        }));
    }

    return (
        questions[checked.count] && (
            <View
                className="w-full flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg mt-4"
            >
                <Text className="text-lg font-bold">{questions[checked.count].question}</Text>
                <View className="w-full flex flex-col items-center justify-center space-x-2">
                    {
                        questions[checked.count].options.map((option, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => handleNext(option)}
                                className="w-full flex flex-row items-center justify-center bg-gray-100 p-2 rounded-lg mt-2"
                            >
                                <Text className="text-lg font-bold">{
                                    option.spanish
                                }</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
        )
    )
}

interface IQuizResultProps {
    questions: IGenQuestion[];
    checked: IChecked;
    answers: IAnswer[];
    handleFinishRound: () => void;
}

export const QuizResult: FC<IQuizResultProps> = ({ questions, checked, answers, handleFinishRound }) => {
    const { user } = useAuthStore();

    // upload the result to the server
    const uploadResult = async () => {
        try {
            if (user) {
                const token = await AsyncStorage.getItem('x-token');
                // correct answers
                const correctAnswers = answers.filter(
                    (answer) => answer.userAnswer === answer.correctAnswer
                ).length;
                const { data } = await serverApi.post('/points', {
                    points: correctAnswers,
                },
                    {
                        headers: {
                            'x-token': token,
                        },
                    }
                );
                console.log(data);

                Alert.alert('Puntos guardados', 'Tus puntos han sido guardados correctamente', [
                    {
                        text: 'OK',
                        onPress: () => handleFinishRound(),
                    },
                ]);
            }

            handleFinishRound();

        } catch (error) {
            console.log({ error });
            // Alert.alert('Error', 'Error al guardar los puntos');
            Alert.alert('Alcanzaste tu límite', 'Has alcanzado tu límite de intentos diarios');
        }
    }

    return (
        <>
            <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center'
                }}
                nestedScrollEnabled={true} // Asegura el desplazamiento interno
            >
                {checked.count >= questions.length && (
                    <View className="w-full flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg mt-4">
                        <Text className="text-lg font-bold">Resultados</Text>
                        {answers.map((answer, i) => (
                            <View key={i} className="w-full flex flex-col items-start bg-gray-100 p-2 rounded-lg mt-2">
                                <View
                                    className='bg-gray-300 w-10 h-10 text-centerm  rounded-full flex justify-center items-center'>
                                    <Text className="">{i + 1}</Text>
                                </View>
                                <View className='flex flex-row flex-wrap'>
                                    <Text className="text-sm font-bold mr-1">
                                        Pregunta:
                                    </Text>
                                    <Text className="text-sm">
                                        {answer.question}
                                    </Text>
                                </View>
                                <View className='flex flex-row flex-wrap'>
                                    <Text className="text-sm font-bold mr-1">
                                        Tu respuesta:
                                    </Text>
                                    <Text className="text-sm">
                                        {answer.userAnswer}
                                    </Text>
                                </View>
                                <View className='flex flex-row flex-wrap'>
                                    <Text className="text-sm font-bold mr-1">
                                        Respuesta correcta:
                                    </Text>
                                    <Text className="text-sm">
                                        {answer.correctAnswer}
                                    </Text>
                                </View>
                                {/* drawing check or cross if answer correct */}
                                <View className="flex flex-row items-center justify-center">
                                    <Ionicons
                                        name={answer.userAnswer === answer.correctAnswer ? 'checkmark' : 'close'}
                                        size={24}
                                        color={answer.userAnswer === answer.correctAnswer ? 'green' : 'red'}
                                    />
                                    <Text className="text-sm font-bold">
                                        {answer.userAnswer === answer.correctAnswer ? 'Correcta' : 'Incorrecta'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {
                checked.count >= questions.length && (
                    <>
                        <TouchableOpacity
                            onPress={uploadResult}
                            className="w-full flex flex-row items-center justify-center bg-gray-200 p-4 rounded-lg mt-4"
                        >
                            <Text className="text-lg font-bold">Finalizar</Text>
                            <Ionicons name="chevron-forward" size={24} color=" black" />
                        </TouchableOpacity>
                        {
                            user ?
                                <Text className="text-sm mt-2">
                                    Se usará uno de tus intentos diarios
                                </Text>
                                :
                                <Text className="text-sm mt-2">
                                    Debes iniciar sesión para guardar tus puntos
                                    <Link
                                        href="/auth/login"
                                        className="text-blue-500 ml-1"
                                    >
                                        Iniciar sesión
                                    </Link>
                                </Text>
                        }
                    </>
                )
            }
        </>
    )
}