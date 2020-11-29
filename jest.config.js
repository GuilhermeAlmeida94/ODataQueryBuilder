module.exports = {
    "roots": [
      "<rootDir>"
    ],
    "testMatch": [
        "**/tests/**/*.ts?(x)", 
        "**/?(*.)+(spec|test).ts?(x)" 
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
  }