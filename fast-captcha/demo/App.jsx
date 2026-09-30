import React, { useState } from 'react';
import { FastCaptcha } from '../client/src/FastCaptcha.jsx';

export default function DemoApp() {
  const [captchaToken, setCaptchaToken] = useState(null);

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Secure Form Demo</h2>
      <form onSubmit={(e) => { e.preventDefault(); alert('Verified with token: ' + captchaToken); }}>
        <FastCaptcha
          theme="dark"
          onVerify={(token) => setCaptchaToken(token)}
          onReset={() => setCaptchaToken(null)}
        />
        <button type="submit" disabled={!captchaToken} style={{ marginTop: 16, padding: '10px 16px' }}>
          Submit
        </button>
      </form>
    </div>
  );
}
