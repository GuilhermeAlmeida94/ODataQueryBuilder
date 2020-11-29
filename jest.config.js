module.exports = {
    "roots": [
      "<rootDir>"
    ],
    "testMatch": [
        "**/__tests__/**/*.ts?(x)", 
        "**/?(*.)+(spec|test).ts?(x)" 
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
  }