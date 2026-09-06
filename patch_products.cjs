const fs = require('fs');

let productLayout = fs.readFileSync('src/pages/products/DigitalProductLayout.jsx', 'utf8');

const targetOnPrimaryAction = `               <button
                 onClick={onPrimaryAction}
                 className="w-full py-4 bg-axim-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors flex items-center justify-center gap-3 rounded-sm shadow-[0_0_20px_rgba(240,255,0,0.2)]"
               >`;

const replaceOnPrimaryAction = `               <button
                 onClick={() => {
                    logTelemetry('checkout_intent', { product: title, price });
                    useAximStore.getState().submitPartnerLead({
                       type: 'PRODUCT_CHECKOUT_INTENT',
                       payload: { product: title, price }
                    });
                    if (onPrimaryAction) onPrimaryAction();
                 }}
                 className="w-full py-4 bg-axim-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors flex items-center justify-center gap-3 rounded-sm shadow-[0_0_20px_rgba(240,255,0,0.2)]"
               >`;

productLayout = productLayout.replace(targetOnPrimaryAction, replaceOnPrimaryAction);

const targetWeb3 = `                   onClick={() => console.log("Init Web3 Tx")}`;
const replaceWeb3 = `                   onClick={() => {
                     logTelemetry('web3_checkout_intent', { product: title, price });
                     useAximStore.getState().submitPartnerLead({
                        type: 'WEB3_CHECKOUT_INTENT',
                        payload: { product: title, price }
                     });
                   }}`;

productLayout = productLayout.replace(targetWeb3, replaceWeb3);

fs.writeFileSync('src/pages/products/DigitalProductLayout.jsx', productLayout);
