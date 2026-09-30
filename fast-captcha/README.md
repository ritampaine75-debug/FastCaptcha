# FastCaptcha - Zero-Key Responsive Captcha Engine

A zero-API-key, ultra-responsive Captcha system built with React, Node.js/Express, Tailwind CSS, and Firebase Dual RTDB/Firestore Failover Engine.

## Quick Start
```jsx
import { FastCaptcha } from './FastCaptcha';

<FastCaptcha 
  theme="dark" 
  onVerify={(token, details) => console.log('Verified:', token)} 
/>
```
