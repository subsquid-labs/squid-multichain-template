export type NetworkConfig = {
  portal: string
  startAtBlock: number
  usdcAddress: string
}

export const networksConfigs: Record<string, NetworkConfig> = {
  eth: {
    // SQD Network Portal dataset for Ethereum mainnet — public, no API key needed,
    // streams pre-filtered data including real-time unfinalized blocks.
    // Browse available datasets at https://docs.sqd.dev/subsquid-network/reference/networks/
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    startAtBlock: 16_000_000,
    usdcAddress: '0x7EA2be2df7BA6E54B1A9C70676f668455E329d29'.toLowerCase(),
  },
  bsc: {
    // SQD Network Portal dataset for BNB Smart Chain mainnet.
    portal: 'https://portal.sqd.dev/datasets/binance-mainnet',
    startAtBlock: 27_000_000,
    usdcAddress: '0x8965349fb649A33a30cbFDa057D8eC2C48AbE2A2'.toLowerCase(),
  },
}
