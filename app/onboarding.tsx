import { View } from 'react-native';
import { OnboardingScreen } from '../src/features/home/components/on-boarding';

const OnBoardingScreen = () => {
    return (
        <View className='w-full flex-1 flex justify-center items-center bg-[#3a3a3a]'>
            {/* <SplashScreenComponent /> */}
            <OnboardingScreen />
        </View>
    );
}

export default OnBoardingScreen;