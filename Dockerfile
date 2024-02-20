FROM public.ecr.aws/docker/library/node:16-alpine

WORKDIR /home/newsite

COPY package.json ./

RUN npm install

COPY . .