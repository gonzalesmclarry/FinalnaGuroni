// lib/tensorflow-helper.ts
import * as tf from '@tensorflow/tfjs';

let tfjsReady = false;

/**
 * Loads and prepares TensorFlow.js for use in React Native
 */
export const prepareTfjs = async (): Promise<void> => {
  if (tfjsReady) return;

  try {
    await tf.ready();
    await import('@tensorflow/tfjs-react-native');
    tfjsReady = true;
    console.log('TensorFlow.js is ready');
  } catch (err) {
    console.error('Failed to load TensorFlow.js:', err);
    throw err;
  }
};

export { tf };
