sed -i "s|import { useAximAuth } from '../hooks/useAximAuth';|import { useAximAuth } from '../hooks/useAximAuth';\nimport { useAximStore } from '../store/useAximStore';|" src/components/ProtectedRoute.jsx
sed -i "s|const { session, isLoading } = useAximAuth();|const { session, isLoading } = useAximAuth();\n  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);|" src/components/ProtectedRoute.jsx
sed -i "s|if (!session) {|if (!session && !isWeb3Authenticated) {|" src/components/ProtectedRoute.jsx
