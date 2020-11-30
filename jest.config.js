module.exports = {
    "roots": [
      "<rootDir>"
    ],
    "testMatch": [
        "**/tests/**/*.test.ts?(x)", 
        "**/?(*.)+(spec|test).ts?(x)" 
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
  }