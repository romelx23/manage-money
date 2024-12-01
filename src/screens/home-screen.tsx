import { StyleSheet, View } from 'react-native';
import { SplashScreenComponent } from '../features/home/components/splash-screen';
import { OnboardingScreen } from '../features/home/components/on-boarding';

export function HomeScreen() {
    return (
        <View className='w-full flex-1 flex justify-center items-center bg-[#3a3a3a]'>
            {/* <SplashScreenComponent /> */}
            <OnboardingScreen />
        </View>
    );
}