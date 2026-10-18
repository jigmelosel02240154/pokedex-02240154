import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import { STUDENT_NAME, THEME } from '../config';

// Animated splash drawn on top of the app.
//  - shows for at least `minDuration` ms
//  - stays until `ready` is true (e.g. the saved team has been loaded)
//  - then fades out and calls `onFinish`
export default function SplashScreen({ ready, onFinish, minDuration = 2200 }) {
  const wobble = useRef(new Animated.Value(0)).current; // drives rotate + scale
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const [minElapsed, setMinElapsed] = useState(false);

  // Start animations and the minimum-time timer
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wobble, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 700,
      delay: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => setMinElapsed(true), minDuration);
    return () => {
      loop.stop();
      clearTimeout(timer);
    };
  }, [wobble, titleOpacity, minDuration]);

  // Fade out once the minimum time has passed AND the app is ready
  useEffect(() => {
    if (minElapsed && ready) {
      Animated.timing(fade, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onFinish && onFinish());
    }
  }, [minElapsed, ready, fade, onFinish]);

  const rotate = wobble.interpolate({
    inputRange: [0, 1],
    outputRange: ['-18deg', '18deg'],
  });
  const scale = wobble.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      {/* Poké Ball drawn with plain Views (no image needed) */}
      <Animated.View style={[styles.ball, { transform: [{ rotate }, { scale }] }]}>
        <View style={styles.ballTop} />
        <View style={styles.ballBottom} />
        <View style={styles.band} />
        <View style={styles.button}>
          <View style={styles.buttonInner} />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: titleOpacity, alignItems: 'center' }}>
        <Text style={styles.title}>{STUDENT_NAME}’s Pokédex</Text>
        <Text style={styles.subtitle}>Loading your Pokédex…</Text>
      </Animated.View>
    </Animated.View>
  );
}

const BALL = 130;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  ball: {
    width: BALL,
    height: BALL,
    borderRadius: BALL / 2,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#1F1B2E',
    marginBottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%', backgroundColor: '#F25C54' },
  ballBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', backgroundColor: '#FFFFFF' },
  band: { position: 'absolute', height: 10, left: 0, right: 0, backgroundColor: '#1F1B2E' },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 6,
    borderColor: '#1F1B2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInner: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#E4DFF5' },
  title: { color: '#fff', fontSize: 30, fontWeight: '800' },
  subtitle: { color: '#E4DFF5', fontSize: 15, marginTop: 8 },
});