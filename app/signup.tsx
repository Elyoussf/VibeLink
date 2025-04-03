import { router } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const SignUp = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join the Vibe!</Text>
            <Text style={styles.subtitle}>Sign up and be part of the trendsetters.</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
            />

            <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('/camera')}>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>OR</Text>

            <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
                        style={styles.socialIcon}
                    />
                    <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={{ uri: 'https://img.icons8.com/color/48/instagram-new.png' }}
                        style={styles.socialIcon}
                    />
                    <Text style={styles.socialText}>Instagram</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={{ uri: 'https://img.icons8.com/color/48/tiktok.png' }}
                        style={styles.socialIcon}
                    />
                    <Text style={styles.socialText}>TikTok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={{ uri: 'https://img.icons8.com/color/48/apple-logo.png' }}
                        style={styles.socialIcon}
                    />
                    <Text style={styles.socialText}>Apple</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e2d',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#2e2e3d',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        color: '#fff',
    },
    signUpButton: {
        backgroundColor: '#ff6b6b',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orText: {
        color: '#aaa',
        marginBottom: 20,
    },
    socialButtons: {
        width: '100%',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2e2e3d',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    socialText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default SignUp;