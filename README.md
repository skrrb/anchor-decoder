# How to use

See list of options with `$ bun decoder -h`.

# Examples

Decode events with a local IDL

```
$ bun decoder events CjLwde1D5ukQOSjTiTJO8Axv1ugwOZVD9RV9s2Yy4o8UJyV43BUUmADKmjsAAAAAAAAAAAAAAAAAAAAAAAAAAAA= --idl ./openbook_v2.json
{
  'CjLwde1D5ukQOSjTiTJO8Axv1ugwOZVD9RV9s2Yy4o8UJyV43BUUmADKmjsAAAAAAAAAAAAAAAAAAAAAAAAAAAA=': {
    data: {
      openOrdersAccount: '26L5NJAwaphJeqgrveeoG4LB3kzZyvQNtUtrvjou8BmZ',
      baseNative: '1000000000',
      quoteNative: '0',
      referrerRebate: '0',
      referrer: null
    },
    name: 'SettleFundsLog'
  }
}
```

Decode accounts with the onchain IDLs

```
$ bun decoder accounts GqYBUB9Yh6sx5cRF6Wbx4dbvwPGKCMohdk5gma3ZwGWb AwMimsGw2ShWXTeC6JkMguGoT73vky44Z1DaP1fpBxQY
{
  GqYBUB9Yh6sx5cRF6Wbx4dbvwPGKCMohdk5gma3ZwGWb: {
    bump: '255',
    baseDecimals: '9',
    quoteDecimals: '6',
    padding1: [ 0, 0, 0, 0, 0 ],
    marketAuthority: 'DFfu65ffUqFUDAAkut4ZjqtJJCFayQqp6J9UohudoAPa',
    timeExpiry: '0',
    collectFeeAdmin: 'HfFi634cyurmVVDr9frwu4MjGLJzz9XbAJz981HdVaNz',
    openOrdersAdmin: { key: 'AwMimsGw2ShWXTeC6JkMguGoT73vky44Z1DaP1fpBxQY' },
    consumeEventsAdmin: { key: '11111111111111111111111111111111' },
    closeMarketAdmin: { key: 'AwMimsGw2ShWXTeC6JkMguGoT73vky44Z1DaP1fpBxQY' },
    name: [
      102, 77, 69, 84, 65, 47,
      102, 85, 83, 68, 67,  0,
        0,  0,  0,  0
    ],
    bids: 'Foh5WazeUpwkJ5XrmiCyJUG7MwVWUAvQxfFnvyGAKu1f',
    asks: '2j7kCiLMRY6FCoVogdAvuhiu2doM3hhHjFoTS1vdYTwy',
    eventHeap: '4zy2GyPdYBvHxUGN66gWXQEgNVzUfUoxm9yKmJsu87zU',
    oracleA: { key: '11111111111111111111111111111111' },
    oracleB: { key: '11111111111111111111111111111111' },
    oracleConfig: {
      confFilter: '0.10000000149011612',
      maxStalenessSlots: '100',
      reserved: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ]
    },
    quoteLotSize: '100',
    baseLotSize: '1000000000',
    seqNum: '395',
    registrationTime: '1700318321',
    makerFee: '0',
    takerFee: '0',
    feesAccrued: '0',
    feesToReferrers: '0',
    referrerRebatesAccrued: '0',
    feesAvailable: '0',
    makerVolume: '0',
    takerVolumeWoOo: '297000000',
    baseMint: 'BttQbTnTUaJwMqGngzbtsUJcT8uiZw65cPs3WyTTBqTR',
    quoteMint: 'HpSR8eZY4CXqJY2WmHJpGJLXJf3ckRvDs4NgTKKxWHBm',
    marketBaseVault: 'FRQRdSGYsSo1aV4vtDgzDyjdzy89786XScqdikvtEfPU',
    baseDepositTotal: '338000000000',
    marketQuoteVault: 'Fq1umZNgHFRuJUbxwX4LvGMddBcEqdV1aK6BG1Rmi6FT',
    quoteDepositTotal: '3096650200',
    reserved: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ]
  },
  AwMimsGw2ShWXTeC6JkMguGoT73vky44Z1DaP1fpBxQY: {
    market: 'GqYBUB9Yh6sx5cRF6Wbx4dbvwPGKCMohdk5gma3ZwGWb',
    pdaBump: '254',
    twapOracle: {
      expectedValue: '1000',
      initialSlot: '230772868',
      lastUpdatedSlot: '231605880',
      lastObservedSlot: '231605880',
      lastObservation: '10505',
      observationAggregator: '3875301547'
    }
  }
}
```
