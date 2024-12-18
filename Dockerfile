FROM node:18.0.0
LABEL authors="wxsub"

WORKDIR /vite-element-template

RUN npm config set registry https://registry.npmmirror.com

RUN npm install -g pnpm

EXPOSE 8848

CMD ["tail", "-f", "/dev/null"]
