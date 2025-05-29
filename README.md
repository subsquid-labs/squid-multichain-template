# Multichain transfers squid

This [squid](https://docs.sqd.ai/) captures USDC Transfer events on ETH and BSC, stores them in the same database and serves the data over a common GraphQL API.

The main processor executable `src/main.ts` takes a string network ID (`eth` or `bsc`) as its sole argument and configures itself to index USDC on either Ethereum or Binance. Network-specific params are set in `src/networksConfigs.ts`.

The scripts file `commands.json` contains separate commands `process:eth`, `process:prod:eth`, `process:bsc` and `process:prod:bsc` that run the main executable with different args. The [manifest](https://docs.sqd.ai/cloud/reference/manifest/) `squid.yaml` that describes squid services for [SQD Cloud](https://docs.sqd.ai/cloud/) and the `sqd run` command uses these commands under the hood.

More info on developing multichain squids is available on the [dedicated documentation page](https://docs.sqd.ai/sdk/resources/multichain/).

Dependencies: Node.js v20+, Docker, Git.

## Quickstart

```bash
# 0. Install @subsquid/cli a.k.a. the sqd command globally
npm i -g @subsquid/cli

# 1. Clone the repo
git clone https://github.com/subsquid-labs/multichain-transfers-example
cd multichain-transfers-example

# 2. Install dependencies
npm i

# 3. Start a Postgres database container and detach
sqd up

# 4. Apply the migration
sqd migration:apply

# 5. Build the squid
sqd build

# 6. Run all services at once
sqd run .
```
A GraphiQL playground will be available at [localhost:4350/graphql](http://localhost:4350/graphql).

You can also run individual services separately:
```bash
sqd process:eth # Ethereum processor
sqd process:bsc # BSC processor
sqd serve       # GraphQL server
```
