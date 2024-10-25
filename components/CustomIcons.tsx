import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const FountainIcon = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M12 2.5c-3.9 0-7 3.1-7 7 0 2.4 1.2 4.5 3 5.7V22h8v-6.8c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7zm0 10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="currentColor" />
  </Svg>
);

export const SprayIcon = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13v2h4V7h-4zm0 4v2h4v-2h-4zm0 4v2h4v-2h-4z" fill="currentColor" />
  </Svg>
);

export const StreamIcon = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" fill="currentColor" />
  </Svg>
);