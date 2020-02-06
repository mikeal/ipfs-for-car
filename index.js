const MemoryStore = require('interface-datastore').MemoryDatastore
const Repo = require('ipfs-repo')
const IPFS = require('ipfs')
const CarDatastore = require('datastore-car')

const getRepo = () => {
  const repo = new Repo('inmem',
    {
      lock: 'memory',
      autoMigrate: false,
      storageBackends:
      {
        root: MemoryStore,
        blocks: MemoryStore,
        keys: MemoryStore,
        datastore: MemoryStore
      }
    }
  )
  // repo.init()
  return repo
}

const getIPFS = async () => {
  const repo = getRepo()
  const node = await IPFS.create({ repo, offline: true, silent: true })
  return node
}

const main = async stream => {
  const ipfs = await getIPFS()
  const car = await CarDatastore.readStreamComplete(stream)
  for await (const { key, value } of car.query()) {
    await ipfs.block.put(value, key)
  }
  return ipfs
}

module.exports = main

/*
const fs = require('fs')
const _run = async () => {
  const ipfs = await main(fs.createReadStream('fast-ai-nlp-0.car'))
  console.log('done')
  ipfs.stop()
}
_run()
*/