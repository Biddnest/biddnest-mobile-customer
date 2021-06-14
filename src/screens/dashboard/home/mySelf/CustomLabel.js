import React from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Colors, hp, wp} from '../../../../constant/colors';

const AnimatedView = Animated.createAnimatedComponent(View);

CustomLabel.defaultProps = {
  leftDiff: 0,
};

const width = wp(12);

function LabelBase(props) {
  const {position, value, leftDiff, pressed} = props;
  const scaleValue = React.useRef(new Animated.Value(0.1)); // Behaves oddly if set to 0
  const cachedPressed = React.useRef(pressed);

  React.useEffect(() => {
    Animated.timing(scaleValue.current, {
      toValue: pressed ? 1 : 0.1,
      duration: 200,
      delay: pressed ? 0 : 2000,
      useNativeDriver: false,
    }).start();
    cachedPressed.current = pressed;
  }, [pressed]);

  return (
    Number.isFinite(position) &&
    Number.isFinite(value) && (
      <AnimatedView
        style={[
          styles.sliderLabel,
          {
            left: position - width / 2,
            transform: [
              {translateY: width},
              // {scale: scaleValue.current},
              {translateY: -width},
            ],
            top: props.right ? -hp(1.7) : hp(5),
          },
        ]}>
        <Text style={styles.sliderLabelText}>{value}</Text>
      </AnimatedView>
    )
  );
}

export default function CustomLabel(props) {
  const {
    leftDiff,
    oneMarkerValue,
    twoMarkerValue,
    oneMarkerLeftPosition,
    twoMarkerLeftPosition,
    oneMarkerPressed,
    twoMarkerPressed,
  } = props;
  return (
    <View style={styles.parentView}>
      <LabelBase
        position={oneMarkerLeftPosition}
        value={oneMarkerValue}
        leftDiff={leftDiff}
        pressed={oneMarkerPressed}
        right={false}
      />
      <LabelBase
        position={twoMarkerLeftPosition}
        value={twoMarkerValue}
        leftDiff={leftDiff}
        pressed={twoMarkerPressed}
        right={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parentView: {
    position: 'relative',
  },
  sliderLabel: {
    position: 'absolute',
    justifyContent: 'center',
    top: hp(5),
    width: width,
  },
  sliderLabelText: {
    textAlign: 'center',
    backgroundColor: Colors.darkBlue,
    flex: 1,
    fontSize: wp(3.8),
    color: Colors.white,
    borderRadius: 5,
    paddingVertical: hp(0.3),
    overflow: 'hidden',
  },
});
