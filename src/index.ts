import auth from "./auth";
import invoice from "./invoice";
import merchant from "./merchant";

// Shared, mutable client config. `auth.TOKEN(...)` fills `token` (and may set `host`);
// every other call reads `token` (Bearer) and `host` (base URL) from here.
let token = "";
// Pre-production base URL. Override with auth.TOKEN({ host }) or by setting MBANK.host.
let host = "https://preapi.m-bank.mn";

const MBANK = { token, host, auth, invoice, merchant };

export default MBANK;

export { default as auth } from "./auth";
export { default as invoice } from "./invoice";
export { default as merchant } from "./merchant";
