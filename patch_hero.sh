#!/bin/bash
sed -i "s/logTelemetry('hero_cta_click', { target: 'tools', label: 'Explore Tools' })/logTelemetry('hero_cta_clicked', { target: 'tools_directory' })/g" src/components/Hero.jsx
sed -i "s/logTelemetry('hero_cta_click', { target: 'consultation', label: 'Book Consultation' })/logTelemetry('hero_cta_clicked', { target: 'consultation' })/g" src/components/Hero.jsx
sed -i "s/logTelemetry('hero_cta_click', { target: 'games_hub', label: 'Web3 Games' })/logTelemetry('hero_cta_clicked', { target: 'web3_games' })/g" src/components/Hero.jsx
