const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

config.watchFolders = [root];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(root, 'node_modules'),
];

// Force all shared deps to resolve from example/node_modules only
config.resolver.extraNodeModules = {
  'react': path.resolve(__dirname, 'node_modules', 'react'),
  'react-native': path.resolve(__dirname, 'node_modules', 'react-native'),
  'react-native-reanimated': path.resolve(
    __dirname,
    'node_modules',
    'react-native-reanimated'
  ),
  'react-native-gesture-handler': path.resolve(
    __dirname,
    'node_modules',
    'react-native-gesture-handler'
  ),
  'react-native-worklets': path.resolve(
    __dirname,
    'node_modules',
    'react-native-worklets'
  ),
  'react-native-sortable-swipe-list': path.resolve(root, 'src'), // ← add this
};

module.exports = config;
