/** TYPE */
import { DYNAMIC_GLOBAL_PROPERTIES } from "./CONDENSER_API/DYNAMIC_GLOBAL_PROPERTIES"
import { GET_ACCOUNT } from "./CONDENSER_API/GET_ACCOUNT"
import { GET_ACCOUNT_HISTORY } from "./CONDENSER_API/GET_ACCOUNT_HISTORY"
import { GET_ACCOUNT_POSTS }   from "./BRIDGE/GET_ACCOUNT_POSTS"
import { GET_BLOCK }   from "./CONDENSER_API/GET_BLOCK"
import { GET_CONFIG }  from "./CONDENSER_API/GET_CONFIG"
import { GET_POST }    from "./BRIDGE/GET_POST"

export declare type OPTIONS = {
  full?:     boolean
  timeout?:  number
  interval?: number
}

export declare type JSONRPC = {
  jsonrpc: string
  id:      number|string
  result?: GET_CONFIG|DYNAMIC_GLOBAL_PROPERTIES|GET_BLOCK|GET_ACCOUNT[]|GET_POST|GET_ACCOUNT_HISTORY[]|GET_ACCOUNT_POSTS[]
  error?: {
    code:    number
    message: string
    data?:   unknown
  } 
}

export declare type TEST_RPC_NODE = {
  name:        string
  description: string
  method:      string
  success:     boolean
  duration:    number
  error?:      string
  last_check:  number
}

export declare type RPC_NODE = {
  url:            string
  nb_ok:          number
  nb_error:       number
  error?:         string
  last_check:     number
  status:         "unkown"|"online"|"degraded"|"error"
  duration?:      number
  average_time?:  number
  version?:       string
  deactivated?:   boolean

  test_result:   TEST_RPC_NODE[]
}

export declare type FULL_TEST = {
  name: string
  description: string
  method: string
  params: any
  validator: (result: GET_CONFIG|DYNAMIC_GLOBAL_PROPERTIES|GET_BLOCK|GET_ACCOUNT[]|GET_POST|GET_ACCOUNT_HISTORY[]|GET_ACCOUNT_POSTS[]) => boolean
}

