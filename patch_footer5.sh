#!/bin/bash
sed -i 's/              <\/span>\n            )}/              <\/span>\n            )}\n/g' src/components/Footer.jsx
sed -i '/            <\/p>\n            <div className="flex gap-4">/d' src/components/Footer.jsx
