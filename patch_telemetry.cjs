const fs = require('fs');
let content = fs.readFileSync('src/components/TelemetryBar.jsx', 'utf8');

content = content.replace(
`  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => {
        const diff = Math.floor(Math.random() * 5) - 2;
        const next = prev + diff;
        return Math.min(100, Math.max(0, next));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);`,
`  const telemetryCollection = useAximStore((state) => state.telemetryCollection);

  // Calculate value based on active telemetry collection
  // Math.min(100, collectionLength * 5)
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const collectionLength = Array.isArray(telemetryCollection) ? telemetryCollection.length : 0;
    // Base it on actual network traffic, but keep it smoothly transitioning
    const calculatedValue = Math.min(100, collectionLength * 5);
    setValue(calculatedValue > 0 ? calculatedValue : initialValue);
  }, [telemetryCollection, initialValue]);`
);

fs.writeFileSync('src/components/TelemetryBar.jsx', content);
