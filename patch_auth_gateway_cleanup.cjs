const fs = require('fs');
let content = fs.readFileSync('src/pages/AuthGateway.jsx', 'utf8');

const targetStr = `  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [networkFault, setNetworkFault] = useState(false);`;

const replaceStr = `  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [networkFault, setNetworkFault] = useState(false);

  const isMounted = React.useRef(true);
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/pages/AuthGateway.jsx', content);
  console.log('Successfully patched AuthGateway.jsx mounted ref');
} else {
  console.log('Target string for AuthGateway not found');
}

const targetAuthBlock = `      if (account) {
        logTelemetry('AUTH_WEB3_WALLET_CONNECTED', {
          address: account.address,
        });

        loginWeb3Wallet(account.address);
        setNotification('Authentication successful.');
        setIsWeb3Connecting(false);
        navigate("/admin", { state: { web3Auth: account.address } });
      } else {
        throw new Error("No account found");
      }
    } catch (err) {
      if (err.message && (err.message.includes('User rejected') || err.message.includes('rejected'))) {
         logTelemetry('AUTH_WEB3_REJECTED', { error: err.message });
         showToast("Signature Rejected", "error");
      } else {
         logTelemetry('auth_timeout_fault', { method: 'web3_connect', error: err.message });
         showToast("Wallet Connection Failed", "error");
      }
      setIsWeb3Connecting(false);
    }`;

const replaceAuthBlock = `      if (account) {
        logTelemetry('AUTH_WEB3_WALLET_CONNECTED', {
          address: account.address,
        });

        loginWeb3Wallet(account.address);
        if (isMounted.current) {
          setNotification('Authentication successful.');
          setIsWeb3Connecting(false);
          navigate("/admin", { state: { web3Auth: account.address } });
        }
      } else {
        throw new Error("No account found");
      }
    } catch (err) {
      if (err.message && (err.message.includes('User rejected') || err.message.includes('rejected'))) {
         logTelemetry('AUTH_WEB3_REJECTED', { error: err.message });
         showToast("Signature Rejected", "error");
      } else {
         logTelemetry('auth_timeout_fault', { method: 'web3_connect', error: err.message });
         showToast("Wallet Connection Failed", "error");
      }
      if (isMounted.current) {
        setIsWeb3Connecting(false);
      }
    }`;

if (content.includes(targetAuthBlock)) {
  content = content.replace(targetAuthBlock, replaceAuthBlock);
  fs.writeFileSync('src/pages/AuthGateway.jsx', content);
  console.log('Successfully patched handleWeb3Login');
} else {
  console.log('Target block for handleWeb3Login not found');
}

const targetEmailBlock = `    try {
      const { data, error } = await Promise.race([authPromise, timeoutPromise]);
      if (error) throw error;

      // Route directly to the Operator Vault on success
      setNotification('Authentication successful.');
      logTelemetry('operator_clearance_success', {
        method: 'email_key',
        identity: cleanEmail
      });
      navigate('/admin');
    } catch (err) {
      if (err.message === "auth_timeout_fault") {
        logTelemetry('auth_timeout_fault', { method: isLogin ? 'login' : 'signup', email: cleanEmail });
        setNetworkFault(true);
      } else {
        console.error("[AXiM_AUTH] Clearance rejected:", err);
        logTelemetry('operator_clearance_denied', {
          method: 'email_key',
          identity: cleanEmail,
          reason: err.message || 'Clearance rejected'
        });
        setErrorMsg(err.message || "Authentication failed. Verify credentials and try again.");
      }
    } finally {
      setIsProcessing(false);
    }`;

const replaceEmailBlock = `    try {
      const { data, error } = await Promise.race([authPromise, timeoutPromise]);
      if (error) throw error;

      // Route directly to the Operator Vault on success
      logTelemetry('operator_clearance_success', {
        method: 'email_key',
        identity: cleanEmail
      });
      if (isMounted.current) {
        setNotification('Authentication successful.');
        navigate('/admin');
      }
    } catch (err) {
      if (err.message === "auth_timeout_fault") {
        logTelemetry('auth_timeout_fault', { method: isLogin ? 'login' : 'signup', email: cleanEmail });
        if (isMounted.current) setNetworkFault(true);
      } else {
        console.error("[AXiM_AUTH] Clearance rejected:", err);
        logTelemetry('operator_clearance_denied', {
          method: 'email_key',
          identity: cleanEmail,
          reason: err.message || 'Clearance rejected'
        });
        if (isMounted.current) setErrorMsg(err.message || "Authentication failed. Verify credentials and try again.");
      }
    } finally {
      if (isMounted.current) setIsProcessing(false);
    }`;

if (content.includes(targetEmailBlock)) {
  content = content.replace(targetEmailBlock, replaceEmailBlock);
  fs.writeFileSync('src/pages/AuthGateway.jsx', content);
  console.log('Successfully patched handleAuth');
} else {
  console.log('Target block for handleAuth not found');
}
