const fs = require('fs');
let code = fs.readFileSync('src/lib/telemetry.js', 'utf8');

const targetStr = `
        try {
          const fetchPromise = fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-AXiM-Internal-Key': import.meta.env.VITE_AXIM_INTERNAL_KEY || 'UNSET_DEV_KEY'
            },
            body: payload,
            keepalive: true,
          });

          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000));
          const response = await Promise.race([fetchPromise, timeoutPromise]);

          if (response.status === 200 || response.status === 202 || response.status === 204) {
            success = true;
            try {
              if (response.status !== 204 && response.status !== 202) {
                const responseData = await response.json();
                console.log('[TELEMETRY_SYNC_SUCCESS]', responseData);
              }
            } catch (jsonErr) {
              if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.warn("Could not parse telemetry response JSON", jsonErr); }
            }
          } else {
            success = false;
          }
        } catch (fetchErr) {
`;

const replaceStr = `
        let retries = 3;
        let backoff = 1000;
        let response = null;
        try {
          while (retries > 0) {
            try {
              const fetchPromise = fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-AXiM-Internal-Key': import.meta.env.VITE_AXIM_INTERNAL_KEY || 'UNSET_DEV_KEY'
                },
                body: payload,
                keepalive: true,
              });

              const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000));
              response = await Promise.race([fetchPromise, timeoutPromise]);

              if (response.status === 200 || response.status === 202 || response.status === 204) {
                 break;
              } else if (response.status === 429) {
                 throw new Error('Rate limited');
              }
            } catch(e) {
               retries--;
               if (retries === 0) throw e;
               await new Promise(r => setTimeout(r, backoff));
               backoff *= 2;
            }
          }

          if (response && (response.status === 200 || response.status === 202 || response.status === 204)) {
            success = true;
            try {
              if (response.status !== 204 && response.status !== 202) {
                const responseData = await response.json();
                console.log('[TELEMETRY_SYNC_SUCCESS]', responseData);
              }
            } catch (jsonErr) {
              if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.warn("Could not parse telemetry response JSON", jsonErr); }
            }
          } else {
            success = false;
          }
        } catch (fetchErr) {
`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/lib/telemetry.js', code);
