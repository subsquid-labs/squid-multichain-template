import {run} from '@subsquid/batch-processor'
import {augmentBlock} from '@subsquid/evm-objects'
import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Transfer} from './model'
import * as erc20abi from './abi/erc20'
import {makeDataSource} from './processor'
import {networksConfigs} from './networksConfigs'
import assert from 'assert'

assert(
  networksConfigs.hasOwnProperty(process.argv[2]),
  `Processor executable takes one argument - a network string ID - ` +
  `that must be in ${JSON.stringify(Object.keys(networksConfigs))}. Got "${process.argv[2]}".`
)

const network = process.argv[2]
const config = networksConfigs[network]

const dataSource = makeDataSource(config)
const database = new TypeormDatabase({
  supportHotBlocks: true,
  stateSchema: `${network}_processor` // state schema must vary by processor if there's more than one
})

// run() drives the processing loop, passing each batch of data to the handler.
// The Portal-native handler context exposes {store, blocks, isHead}.
run(dataSource, database, async (ctx) => {
  // augmentBlock() enriches raw block items with ids and navigation helpers.
  const blocks = ctx.blocks.map(augmentBlock)
  const transfers: Transfer[] = []
  for (let block of blocks) {
    for (let log of block.logs) {
      if (log.address === config.usdcAddress &&
        log.topics[0] === erc20abi.events.Transfer.topic) {

        let {from, to, value} = erc20abi.events.Transfer.decode(log)
        transfers.push(
          new Transfer({
            id: log.id,
            network,
            block: block.header.number,
            timestamp: new Date(block.header.timestamp),
            from,
            to,
            value,
            txHash: log.transactionHash
          })
        )
      }
    }
  }
  await ctx.store.upsert(transfers)
})
