/** TYPE */
import { FULL_TEST } from "./helpers"

import { DYNAMIC_GLOBAL_PROPERTIES } from "./helpers/CONDENSER_API/DYNAMIC_GLOBAL_PROPERTIES"
import { GET_ACCOUNT } from "./helpers/CONDENSER_API/GET_ACCOUNT"
import { GET_ACCOUNT_HISTORY } from "./helpers/CONDENSER_API/GET_ACCOUNT_HISTORY"
import { GET_ACCOUNT_POSTS }   from "./helpers/BRIDGE/GET_ACCOUNT_POSTS"
import { GET_ACCOUNT_REPUTATION } from "./helpers/CONDENSER_API/GET_ACCOUNT_REPUTATION"
import { GET_BLOG_ENTRY } from "./helpers/CONDENSER_API/GET_BLOG_ENTRY"
import { GET_BLOCK }   from "./helpers/CONDENSER_API/GET_BLOCK"
import { GET_CONTENT } from "./helpers/CONDENSER_API/GET_CONTENT"
import { GET_DISCUSSION } from "./helpers/CONDENSER_API/GET_DISCUSSION"
import { GET_POST }    from "./helpers/BRIDGE/GET_POST"

export const testList = (block: number, account: string, permlink: string, observer: string): FULL_TEST[] => {
  return [
    {
      name: "Condenser | Get Account",
      description: "Retrieve an account details",
      method: "condenser_api.get_accounts",
      params: [[account]],
      validator: (result) => {
        return Array.isArray((result as GET_ACCOUNT[])) && (result as GET_ACCOUNT[]).length > 0  ? true : false
      }
    },
    {
      name: "Condenser | Get Account History",
      description: "Load transaction history for an account (both activities and wallet transactions)",
      method: "condenser_api.get_account_history",
      params: [account, -1, 25],
      validator: (result) => Array.isArray(result as GET_ACCOUNT_HISTORY[]) && (result as GET_ACCOUNT_HISTORY[]).length > 10  ? true : false
    },
    {
      name: "Condenser | Get Account Reputation",
      description: "Retrieve the reputation for an account)",
      method: "condenser_api.get_account_reputations",
      params: [account, 1],
      validator: (result) => Array.isArray(result as GET_ACCOUNT_REPUTATION[]) && (result as GET_ACCOUNT_REPUTATION[]).length > 0  ? true : false
    },
    {
      name: "Condenser | Get Block",
      description: "Get Block",
      method: "condenser_api.get_block",
      params: [block],
      validator: (result) => {
        return (result as GET_BLOCK).witness ? true : false
      }
    },
    {
      name: "Condenser | Get Blog Entries",
      description: "Retrieve the list of blog entries for an account)",
      method: "condenser_api.get_blog_entries",
      params: [account, 0, 25],
      validator: (result) => Array.isArray(result as GET_BLOG_ENTRY[]) && (result as GET_BLOG_ENTRY[]).length > 0  ? true : false
    },
    {
      name: "Condenser | Get Content",
      description: "Retrieve the content (post or comment))",
      method: "condenser_api.get_content",
      params: [account, permlink],
      validator: (result) => {
        return (result as GET_CONTENT).created ? true : false
      }
    },
    {
      name: "Condenser | Get Dynamic Global Propertie",
      description: "Check chain global properties",
      method: "condenser_api.get_dynamic_global_properties",
      params: [],
      validator: (result) => {
        return "head_block_number" in (result as DYNAMIC_GLOBAL_PROPERTIES) && "last_irreversible_block_num" in (result as DYNAMIC_GLOBAL_PROPERTIES) ? true : false
      }
    },
    {
      name: "Condenser | Get Disccusion By Blog",
      description: "Retrieve a list of discussions by blog)",
      method: "condenser_api.get_discussions_by_blog",
      params: { tag: account, limit: 5, truncate_body: 1},
      validator: (result) => Array.isArray(result as GET_DISCUSSION[]) && (result as GET_DISCUSSION[]).length > 0  ? true : false
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