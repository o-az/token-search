FROM oven/bun

ARG PORT=3003
ARG DEBIAN_FRONTEND="noninteractive"
ARG DEBCONF_NOWARNINGS="yes"
ARG DEBCONF_TERSE="yes"
ARG LANG="C.UTF-8"

WORKDIR /usr/src/app
COPY . /usr/src/app

SHELL [ "/bin/bash", "-o", "pipefail", "-c" ]

RUN apt update --yes && \
  #
  # Give permission to execute all files in /usr/src/app
  chmod -R 777 /usr/src/app

EXPOSE $PORT
#
# entrypoint has dependencies install command
ENTRYPOINT [ "./scripts/entrypoint.sh" ]
CMD [ "bun", "run", "--hot", "./src/index.ts" ]
