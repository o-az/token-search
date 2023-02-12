FROM oven/bun

ARG PORT=3003
ARG DEBIAN_FRONTEND="noninteractive"
ARG DEBCONF_NOWARNINGS="yes"
ARG DEBCONF_TERSE="yes"
ARG LANG="C.UTF-8"

SHELL [ "/bin/bash", "-o", "pipefail", "-c" ]

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN apt update --yes && \
  #
  # Give permission to execute all files in /usr/src/app
  chmod -R 777 /usr/src/app

EXPOSE $PORT
#
# entrypoint has dependencies install command
ENTRYPOINT [ "./scripts/entrypoint.sh" ]
CMD [ "bun", "run", "start" ]