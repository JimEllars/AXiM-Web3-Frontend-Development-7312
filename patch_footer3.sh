#!/bin/bash
sed -i '/\[OPERATOR_ID: VERIFIED \/\/ ARBITRUM\]/{n;N;d}' src/components/Footer.jsx
