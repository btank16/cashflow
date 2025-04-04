import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import colors from '../Colors/colors.Js';

const AnimationLoader = ({
  animationRef,
  authCheckComplete,
  fadeOutAnimation,
  isAnimationReady,
  animationDurationElapsed,
  setIsAnimationReady,
  setFadeOutAnimation,
  setShowAnimation,
  setIsLoading
}) => {
  return (
    <View style={[
      styles.loadingContainer,
      // Apply fade-out animation if needed
      fadeOutAnimation && { opacity: 0, transition: 'opacity 300ms' }
    ]}>
      <View style={styles.animationBackground}>
        <LottieView
          ref={animationRef}
          source={require('../../assets/animations/LogoAnimation.json')}
          autoPlay={false}
          loop={!authCheckComplete}
          style={styles.animation}
          resizeMode="contain"
          speed={1.5}
          renderMode="AUTOMATIC"
          onLayout={() => {
            setIsAnimationReady(true);
          }}
          onAnimationFinish={() => {
            if (authCheckComplete && animationDurationElapsed) {
              // Start fade-out instead of immediately hiding
              setFadeOutAnimation(true);
              
              // After a short fade, hide the animation screen
              setTimeout(() => {
                setShowAnimation(false);
                setIsLoading(false);
              }, 300);
            } else if (!authCheckComplete && animationRef.current) {
              animationRef.current.play();
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkGreenPrimary,
    // Add this to ensure it covers the entire screen
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10, // Ensure it's on top
  },
  animationBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.darkGreenPrimary,
  },
  animation: {
    width: 300,
    height: 300,
  },
});

export default AnimationLoader; 