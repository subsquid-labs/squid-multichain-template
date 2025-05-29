import {assertNotNull} from '@subsquid/util-internal'

export type NetworkConfig = {
  gateway: string
  rpcEndpoint: string
  finalityConfirmation: number
  startAtBlock: number
  usdcAddress: string
}

export const networksConfigs: Record<string, NetworkConfig> = {
  eth: {
    gateway: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
    rpcEndpoint: assertNotNull(process.env.RPC_ETH_HTTP, 'No ETH RPC endpoint supplied via env.RPC_ETH_HTTP'),
    finalityConfirmation: 75,
    startAtBlock: 16_000_000,
    usdcAddress: '0x7EA2be2df7BA6E54B1A9C70676f668455E329d29'.toLowerCase(),
  },
  bsc: {
    gateway: 'https://v2.archive.subsquid.io/network/binance-mainnet',
    rpcEndpoint: assertNotNull(process.env.RPC_BSC_HTTP, 'No BSC RPC endpoint supplied via env.RPC_BSC_HTTP'),
    finalityConfirmation: 15,
    startAtBlock: 27_000_000,
    usdcAddress: '0x8965349fb649A33a30cbFDa057D8eC2C48AbE2A2'.toLowerCase(),
  },
}
