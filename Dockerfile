FROM node:22-alpine
WORKDIR /app
COPY products/spreadsheets/budget-pro-2026/scripts/test/ ./products/spreadsheets/budget-pro-2026/scripts/test/
CMD ["node", "products/spreadsheets/budget-pro-2026/scripts/test/pure-functions.test.js"]
