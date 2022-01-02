export declare type GET_ACCOUNT_HISTORY = [
  number,
  {
    trx_id:       string
    block:        number
    trx_in_block: number
    op_in_trx:    number
    virtual_op:   number
    timestamp:    string
    op: any[]
  }  
]