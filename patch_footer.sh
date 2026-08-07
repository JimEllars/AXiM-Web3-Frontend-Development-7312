#!/bin/bash
sed -i "s/logTelemetry('footer_social_click', { platform: 'twitter' })/logTelemetry('outbound_social_click', { network: 'x_twitter' })/g" src/components/Footer.jsx
sed -i "s/logTelemetry('footer_social_click', { platform: 'linkedin' })/logTelemetry('outbound_social_click', { network: 'linkedin' })/g" src/components/Footer.jsx
