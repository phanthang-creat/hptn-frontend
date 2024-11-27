### STAGE 1: Build  ###
FROM node:lts-bookworm-slim AS build
WORKDIR /usr/src/app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN ["corepack", "enable"]
COPY ["package.json", "./"]
COPY ["pnpm-lock.yaml", "."]
RUN ["pnpm", "fetch"]
RUN ["pnpm", "install", "--offline"]
COPY [".", "."]
RUN ["pnpm", "run", "build"]

# STAGE 2: RUN
FROM rtsp/lighttpd AS run
COPY ./server/lighttpd.conf /etc/lighttpd/conf.d/user.conf
COPY --from=build /usr/src/app/dist /var/www/html/