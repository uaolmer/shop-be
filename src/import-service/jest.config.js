module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "testMatch": [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "moduleNameMapper": {
      "^@common/(.*)$": "<rootDir>/src/common/$1",
      "^@functions/(.*)$": "<rootDir>/src/functions/$1",
      "^@libs/(.*)$": "<rootDir>/src/libs/$1"
    }
    
}