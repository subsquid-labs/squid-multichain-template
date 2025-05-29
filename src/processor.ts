import {
  FieldSelection,
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor'
import {Store} from '@subsquid/typeorm-store'

import {NetworkConfig} from './networksConfigs'
import * as erc20abi from './abi/erc20'

const fields = {
  log: {
    transactionHash: true
  }
} satisfies FieldSelection

export type Fields = typeof fields
export type Context = DataHandlerContext<Store, Fields>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>

export function makeProcessor(config: NetworkConfig): EvmBatchProcessor<Fields> {
  return new EvmBatchProcessor()
    // Bulk of data will be fetched from an SQD Gateway
    // See https://docs.sqd.ai/subsquid-network/reference/networks/ for a full list
    .setGateway(config.gateway)
    // RPC is used for the last few thousands of blocks and real-time updates
    // See https://docs.sqd.ai/sdk/resources/unfinalized-blocks/
    .setRpcEndpoint({
      url: config.rpcEndpoint,
      // More RPC connection options at https://docs.sqd.ai/sdk/reference/processors/evm-batch/general/#set-rpc-endpoint
      rateLimit: 10
    })
    // Max tolerable reorg depth. Specific to the network since finality conditions vary
    // See https://docs.sqd.ai/sdk/reference/processors/evm-batch/general/#set-finality-confirmation
    .setFinalityConfirmation(config.finalityConfirmation)
    // See https://docs.sqd.ai/sdk/reference/processors/evm-batch/field-selection/
    .setFields(fields)
    .setBlockRange({
      from: config.startAtBlock,
    })
    // See https://docs.sqd.ai/sdk/reference/processors/evm-batch/ for more info on requesting data
    .addLog({
      address: [config.usdcAddress],
      topic0: [erc20abi.events.Transfer.topic]
    })
}