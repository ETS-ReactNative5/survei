import React from 'react'
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

//Sentry.init({
//  dsn: "http://9711425a87c24f9c8a6a3335ff11d1b8@103.138.69.182:9000/5",
//  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
//  tracesSampleRate: 1.0,
//});
//Sentry.setUser({ email: "john.doe@example.com" });

render((
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
