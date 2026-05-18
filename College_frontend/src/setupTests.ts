import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "node:util";

globalThis.TextEncoder = TextEncoder;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
globalThis.TextDecoder = TextDecoder;