import '@testing-library/jest-dom';

// Polyfill fetch for Jest (Node)
const fetch = require('node-fetch');
const { Response, Request, Headers } = fetch;

if (!globalThis.fetch) {
  globalThis.fetch = fetch as any;
  globalThis.Response = Response as any;
  globalThis.Request = Request as any;
  globalThis.Headers = Headers as any;
}

// Polyfill TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder as any;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as any;
}
