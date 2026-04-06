import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_THIRDWEB_CLIENT_ID) || "default_client_id",
});
