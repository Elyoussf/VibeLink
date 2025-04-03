import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function _() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.vibeLinkText}>VibeLink!</Text>
            <Text style={styles.subtitleText}>
                Skip the feed, go straight to their home screen – share videos they're sure to see
            </Text>
            <View style={styles.dotsContainer}>
                <View style={[styles.dot, { backgroundColor: '#ff7675' }]} />
                <View style={[styles.dot, { backgroundColor: '#74b9ff' }]} />
                <View style={[styles.dot, { backgroundColor: '#fdcb6e' }]} />
            </View>
            <TouchableOpacity
                style={styles.getStartedButton}
                onPress={() => router.push('/signup')} // Replace '/signup' with your desired route
            >
                <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
            <View style={styles.dotsContainerBottom}>
                <View style={[styles.dot, { backgroundColor: '#55efc4' }]} />
                <View style={[styles.dot, { backgroundColor: '#a29bfe' }]} />
                <View style={[styles.dot, { backgroundColor: '#fab1a0' }]} />
                <View style={[styles.dot, { backgroundColor: '#ffeaa7' }]} />
                <View style={[styles.dot, { backgroundColor: '#81ecec' }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6c5ce7', // Vibrant background color
    },
    welcomeText: {
        fontSize: 28,
        color: '#ffeaa7',
        fontWeight: '600',
        marginBottom: 5,
        textShadowColor: '#2d3436',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    vibeLinkText: {
        fontSize: 40,
        color: '#fd79a8',
        fontWeight: 'bold',
        marginBottom: 10,
        textShadowColor: '#2d3436',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    subtitleText: {
        fontSize: 18,
        color: '#dfe6e9',
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
        fontStyle: 'italic',
    },
    getStartedButton: {
        backgroundColor: '#00cec9',
        paddingVertical: 14,
        paddingHorizontal: 35,
        borderRadius: 30,
        marginTop: 30,
        shadowColor: '#2d3436',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    getStartedText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    dotsContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    dotsContainerBottom: {
        flexDirection: 'row',
        marginTop: 40,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
});