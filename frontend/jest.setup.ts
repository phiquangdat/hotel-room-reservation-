import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder as NodeTextDecoder } from "util";
import fetch, { Request, Response, Headers } from "cross-fetch";
import React from "react";

// Polyfill TextEncoder/TextDecoder
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = NodeTextDecoder as any;
}

// Polyfill fetch and related globals
if (typeof global.fetch === "undefined") {
  global.fetch = fetch as any;
  global.Request = Request as any;
  global.Response = Response as any;
  global.Headers = Headers as any;
}

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => {
  return new Proxy(
    {},
    {
      get: (_, iconName: string) => (props: any) =>
        React.createElement("svg", { "data-icon": iconName, ...props }),
    }
  );
});
