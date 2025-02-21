FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack prepare pnpm@10.0.0 --activate
RUN corepack enable

RUN pnpm install -g deno


FROM base AS api
COPY . /api
WORKDIR /api

RUN ls -a

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

EXPOSE 8080

CMD [ "pnpm", "--filter=@repo/api", "run", "start" ]


FROM base AS site
COPY --from=api . /site
WORKDIR /site
RUN pnpm --filter=@repo/site build

EXPOSE 3000

CMD [ "pnpm", "--filter=@repo/site", "run", "start" ]
