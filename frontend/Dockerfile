FROM node:20-alpine
WORKDIR /app
ARG VITE_API_BASE=http://localhost:8000
ENV VITE_API_BASE=$VITE_API_BASE
COPY package.json ./package.json
RUN npm install --silent
COPY index.html ./index.html
COPY tsconfig.json ./tsconfig.json
COPY vite.config.ts ./vite.config.ts
COPY src ./src
EXPOSE 5173
CMD ["npm", "run", "dev"]
