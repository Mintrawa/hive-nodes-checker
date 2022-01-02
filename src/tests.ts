/** TYPE */
import { FULL_TEST } from "./helpers"

import { DYNAMIC_GLOBAL_PROPERTIES } from "./helpers/CONDENSER_API/DYNAMIC_GLOBAL_PROPERTIES"
import { GET_ACCOUNT } from "./helpers/CONDENSER_API/GET_ACCOUNT"
import { GET_ACCOUNT_HISTORY } from "./helpers/CONDENSER_API/GET_ACCOUNT_HISTORY"
import { GET_ACCOUNT_POSTS }   from "./helpers/BRIDGE/GET_ACCOUNT_POSTS"
import { GET_BLOCK }   from "./helpers/CONDENSER_API/GET_BLOCK"
import { GET_POST }    from "./helpers/BRIDGE/GET_POST"

export const testList = (block: number, account: string, permlink: string, observer: string): FULL_TEST[] => {
  return [
    {
      name: "Dynamic Global Propertie",
      description: "Check chain global properties",
      method: "condenser_api.get_dynamic_global_properties",
      params: {},
      validator: (result) => {
        return "head_block_number" in (result as DYNAMIC_GLOBAL_PROPERTIES) && "last_irreversible_block_num" in (result as DYNAMIC_GLOBAL_PROPERTIES) ? true : false
      }
    },
    {
      name: "Get Block",
      description: "Get Block",
      method: "condenser_api.get_block",
      params: [block],
      validator: (result) => {
        return (result as GET_BLOCK).witness ? true : false
      }
    },
    {
      name: "Get Account",
      description: "Retrieve an account details",
      method: "condenser_api.get_accounts",
      params: [[account]],
      validator: (result) => {
        return Array.isArray((result as GET_ACCOUNT[])) && (result as GET_ACCOUNT[]).length > 0  ? true : false
      }
    },
    {
      name: "Get Account History",
      description: "Load transaction history for an account (both activities and wallet transactions)",
      method: "condenser_api.get_account_history",
      params: [account, -1, 250],
      validator: (result) => Array.isArray(result as GET_ACCOUNT_HISTORY[]) && (result as GET_ACCOUNT_HISTORY[]).length > 10  ? true : false
    },
    {
      name: "Get Post",
      description: "Retrieve a single post and associated details",
      method: "bridge.get_post",
      params: { author: account, permlink: permlink, observer: observer },
      validator: (result) => {
        return (result as GET_POST) && (result as GET_POST).post_id && (result as GET_POST).children > 0 ? true : false
      }
    },
    {
      name: "Get Account Post by Replies",
      description: "Get replies to an user posts/comments",
      method: "bridge.get_account_posts",
      params: { account: account, sort: "replies", limit: 20, observer: observer },
      validator: (result) => Array.isArray(result as GET_ACCOUNT_POSTS[]) && (result as GET_ACCOUNT_POSTS[]).length > 10  ? true : false
    },
  ]
}