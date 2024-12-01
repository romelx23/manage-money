import { ImageBackground, ScrollView, Text, View } from "react-native";
import { HeaderHome } from "../../common/components/header-home";
// import { FooterHome } from "../../common/components/footer-home";
import Constants from 'expo-constants';
import { AnimatedContainer } from "./animated-container";

interface HomeLayoutProps {
    children: React.ReactNode;
    headerTitle?: string;
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({ children, headerTitle }) => {

    return (
        <View className="flex-1 border">
            {/* Cabecera fija */}
            <View style={{
                position: 'absolute',
                // top: Constants.statusBarHeight, // Para compensar el status bar
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1, // Asegura que esté por encima del resto del contenido
            }}>
                <HeaderHome headerTitle={headerTitle} />
            </View>

            <ImageBackground
                source={{ uri: 'https://res.cloudinary.com/react-romel/image/upload/v1732075133/apps/english-quiz/file_6_qkvnmh.png' }}
                style={{
                    width: '100%',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Contenido que se puede desplazar */}
                {/* <ScrollView
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ paddingTop: Constants.statusBarHeight + 60 }}
                    className="flex-grow w-full h-full flex flex-1 flex-col bg-gray-700 border border-gray-700 pt-0"
                > */}
                <View
                    className="flex-1 w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                >
                    <ScrollView
                        nestedScrollEnabled={true}
                        contentContainerStyle={{ paddingTop: Constants.statusBarHeight + 60 }}
                        className="flex-grow w-full h-full flex flex-1 flex-col pt-0"
                    >
                        <View className="w-full flex-1 flex flex-col px-2">
                            <AnimatedContainer>
                                {children}
                            </AnimatedContainer>
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>

            {/* Pie de página */}
            {/* <FooterHome /> */}
        </View>
    )
}
