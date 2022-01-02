export declare type GET_BLOCK = {
  previous:                string
  timestamp:               string
  witness:                 string
  transaction_merkle_root: string
  extensions:              any[]
  witness_signature:       string
  transactions:            any[]
  block_id:                string
  signing_key:             string
  transaction_ids:         string[]
}