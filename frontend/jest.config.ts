import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }] as [
      string,
      unknown
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(lucide-react|@lucide|react-hook-form|nanoid)/)",
  ],
};

export default createJestConfig(customJestConfig as any);
