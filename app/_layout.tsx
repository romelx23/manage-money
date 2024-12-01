import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function Layout() {

    return (
        <>
            <Toast />
            <StatusBar
                // hidden={true}
                translucent={true}
                backgroundColor="transparent"
                animated={true}
                networkActivityIndicatorVisible={true}
                hideTransitionAnimation="fade"
            />
            <Stack
                initialRouteName="index"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                {/* <Suspense fallback={<Text>Loading...</Text>}>
                <SQLiteProvider
                    databaseName="db.db"
                    onInit={migrateDbIfNeeded}
                    assetSource={require('../assets/database/db.db')}
                    useSuspense
                >
                    <Slot />
                </SQLiteProvider >
            </Suspense> */}

                <Stack.Screen name="index" />
                {/* <Stack.Screen name="(tabs)"
                    options={{
                        headerShown: false
                    }}
                /> */}
                <Stack.Screen name="home" />
                <Stack.Screen name="spent" />
                <Stack.Screen name="onboarding" />
            </Stack>
        </>
    );
}