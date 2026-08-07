#!/bin/bash
sed -i 's/\[OPERATOR_ID: VERIFIED \/\/ ARBITRUM\]/\[OPERATOR_ID: VERIFIED \/\/ ARBITRUM\]\n              <\/span>\n            )}/g' src/components/Footer.jsx
