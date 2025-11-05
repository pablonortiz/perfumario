import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

interface AccessibilityState {
  reduceMotionEnabled: boolean;
  screenReaderEnabled: boolean;
  boldTextEnabled: boolean;
}

/**
 * Hook to access accessibility settings
 * Helps make the app more accessible by respecting user preferences
 */
export const useAccessibility = (): AccessibilityState => {
  const [state, setState] = useState<AccessibilityState>({
    reduceMotionEnabled: false,
    screenReaderEnabled: false,
    boldTextEnabled: false,
  });

  useEffect(() => {
    // Check initial states
    const checkAccessibilitySettings = async () => {
      const [reduceMotion, screenReader, boldText] = await Promise.all([
        AccessibilityInfo.isReduceMotionEnabled(),
        AccessibilityInfo.isScreenReaderEnabled(),
        AccessibilityInfo.isBoldTextEnabled(),
      ]);

      setState({
        reduceMotionEnabled: reduceMotion,
        screenReaderEnabled: screenReader,
        boldTextEnabled: boldText,
      });
    };

    checkAccessibilitySettings();

    // Listen for changes
    const reduceMotionListener =
      AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        (enabled) => {
          setState((prev) => ({ ...prev, reduceMotionEnabled: enabled }));
        },
      );

    const screenReaderListener = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      (enabled) => {
        setState((prev) => ({ ...prev, screenReaderEnabled: enabled }));
      },
    );

    const boldTextListener = AccessibilityInfo.addEventListener(
      "boldTextChanged",
      (enabled) => {
        setState((prev) => ({ ...prev, boldTextEnabled: enabled }));
      },
    );

    // Cleanup
    return () => {
      reduceMotionListener?.remove();
      screenReaderListener?.remove();
      boldTextListener?.remove();
    };
  }, []);

  return state;
};
