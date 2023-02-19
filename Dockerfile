FROM oven/bun

ARG PORT=3003
ENV ENV="production"

WORKDIR /app
#
# Copy "everything" -- most files will be ignored by .dockerignore
COPY . .

SHELL [ "/bin/bash", "-o", "pipefail", "-c" ]

# Give permission to execute all files in /app
RUN chmod -R 777 /app && \
  #
  # Install dependencies
  bun install --production && \
  #
  # don't need it anymore
  rm -rf bun.lockb package.json

EXPOSE $PORT

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
CMD [ "bun", "run", "./src/index.ts" ]