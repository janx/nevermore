# Nevermore

Social credit information system based on blockchain.

creditRecord = {
  commit: String // UID
  identity: String
  category: Number // 0: 信用贷款 1: 担保贷款  2: 抵押贷款
  state: Number // 0: 申请中 1: 进行中 2: 已完结
  fee: Number
  timestamp: Number // unix timestamp
  provider: String
  owner: Boolean
  orderstate: Number // 0: 没买, 1: 已支付, 2: 已收货
}

request = {
  id: String //UID
  commit: String //referenct to
  provider: String
  from:
  fee: Number
}
