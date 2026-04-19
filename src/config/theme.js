export const theme = {
  siteName: "AXiM Systems",
  colors: {
    primary: '#FFEA00', // axim-gold
    secondary: '#3aaa74', // axim-green
    accent: '#00E5FF', // axim-teal
    purple: '#8A2BE2', // axim-purple
    background: '#050505', // bg-void
  },
  wpRestEndpoint: "https://axim.us.com/wp-json/wp/v2",
  chatbaseBotId: (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_CHATBASE_BOT_ID : process.env.VITE_CHATBASE_BOT_ID) || "",
};
