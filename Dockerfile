FROM ubuntu:20.04

ARG PORT=3003

WORKDIR /usr/src/app
COPY . /usr/src/app


ARG DEBIAN_FRONTEND="noninteractive"
ARG DEBCONF_NOWARNINGS="yes"
ARG DEBCONF_TERSE="yes"
ARG LANG="C.UTF-8"
ARG CURL_OPTIONS="--silent --show-error --location --fail --retry 3 --tlsv1.2 --proto =https"

ARG PNPM_HOME="/root/.local/share/pnpm"
ARG PATH="${PATH}:${PNPM_HOME}"

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

SHELL [ "/bin/bash", "-o", "pipefail", "-c" ]

WORKDIR /usr/src/app

RUN apt update --yes && \
  apt install --yes --no-install-recommends \
  sudo \
  curl \
  unzip \
  ca-certificates && \
  rm -rf /var/lib/apt/lists/* && \
  #
  # Install pnpm and Node.js LTS
  curl ${CURL_OPTIONS} https://get.pnpm.io/install.sh | bash - && \
  #
  # Setup pnpm
  SHELL=bash /root/.local/share/pnpm/pnpm setup && \
  #
  # Install Node.js LTS
  pnpm env use --global lts && \
  #
  # Install Bun
  pnpm add --global bun@latest && \
  echo "export bun='~/.bun/bin/bun'" >> ~/.bashrc && \
  #
  # Give permission to execute all files in /usr/src/app
  chmod -R 777 /usr/src/app

EXPOSE $PORT
#
# entrypoint has dependencies install command
ENTRYPOINT [ "./scripts/entrypoint.sh" ]
CMD [ "bun", "run", "start" ]