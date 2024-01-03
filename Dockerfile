# FROM node:16-alpine
# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . ./
# ARG PORT 
# ENV PORT $PORT
# ENV JWT_SECRET pramit
# ENV MONGODB_CONNECTION_STRING mongodb+srv://pramitchoudhury0205:Zg1GlMh1QMUl5NUa@portfolio.3i5xkrh.mongodb.net/portfolio
# EXPOSE $PORT
# CMD ["node","index.js"]