import {
  DataSourceBuilder,
  FieldSelection,
  BlockHeader,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-stream'

import {NetworkConfig} from './networksConfigs'
import * as erc20abi from './abi/erc20'

const fields = {
  block: {
    timestamp: true
  },
  log: {
    address: true,
    topics: true,
    data: true,
    transactionHash: true
  }
} satisfies FieldSelection

export type Fields = typeof fields
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>

// makeDataSource builds a per-network data source. The SQD Network Portal is the
// primary source of blockchain data: it is public, needs no API key, and streams
// pre-filtered data — including real-time unfinalized blocks — far faster than a
// plain RPC endpoint. The per-network Portal dataset URL comes from networksConfigs.
export function makeDataSource(config: NetworkConfig) {
  return new DataSourceBuilder()
    .setPortal(config.portal)
    // To use a private or rate-limit-lifted Portal, supply an API key
    // through the HTTP client headers (create a key at https://portal.sqd.dev/app):
    // .setPortal({
    //     url: config.portal,
    //     http: {
    //         headers: {'x-api-key': process.env.SQD_API_KEY},
    //     },
    // })
    // Field selection is explicit: there are no default optional fields, so list every
    // field the handler reads. See
    // https://docs.sqd.dev/en/sdk/squid-sdk/evm/reference/evm-stream/field-selection
    .setFields(fields)
    .setBlockRange({
      from: config.startAtBlock,
    })
    // See https://docs.sqd.dev/en/sdk/squid-sdk/evm/reference/evm-stream/logs for more
    // info on requesting data. Request options are nested under `where`.
    .addLog({
      where: {
        address: [config.usdcAddress],
        topic0: [erc20abi.events.Transfer.topic],
      },
    })
    .build()
}
