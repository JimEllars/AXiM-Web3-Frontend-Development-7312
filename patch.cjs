const fs = require('fs');

let content = fs.readFileSync('src/lib/telemetry.js', 'utf8');

// The instruction: "Ensure event dispatching batches events asynchronously via navigator.sendBeacon or non-blocking fetch requests with exponential backoff."

let find = `
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
`;

let replace = `
        let retries = 3;
        let backoff = 1000;
        let response = null;

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
`;

content = content.replace(find, replace);
fs.writeFileSync('src/lib/telemetry.js', content);
