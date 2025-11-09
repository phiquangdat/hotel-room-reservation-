import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import React from "react";

jest.mock("lucide-react", () => {
  return new Proxy(
    {},
    {
      get: (_, iconName: string) => {
        const MockIcon = (props: any) =>
          React.createElement("svg", {
            "data-icon": iconName,
            ...props,
          });
        return MockIcon;
      },
    }
  );
});
