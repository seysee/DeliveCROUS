import React, { useRef } from "react";
import { Pressable, Text, StyleSheet, useWindowDimensions, Animated } from "react-native";

const Button = ({ title, onPress, style }) => {
const { width } = useWindowDimensions();
const isSmallScreen = width < 400;
const hoverAnim = useRef(new Animated.Value(0)).current;

const handleMouseEnter = () => {
    Animated.timing(hoverAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
    }).start();
};

const handleMouseLeave = () => {
    Animated.timing(hoverAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
    }).start();
};

const backgroundColor = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e01020", "#c00d1a"],
});

    return (
        <Pressable
            onPress={onPress}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Animated.View style={[styles.button, { backgroundColor }, style]}>
                <Text style={styles.text}>{title}</Text>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        minWidth: 100,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        backgroundColor: "#e01020",
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 10,
        elevation: 6,
        marginBottom: 10,
    },
    text: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Poppins-Bold",
    },
});


export default Button;
