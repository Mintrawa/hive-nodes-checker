export declare type GET_ACCOUNT_POSTS = {
  post_id:              number
  author:               string
  permlink:             string
  category:             string
  title:                string
  body:                 string
  json_metadata: {
      tags: string[]
      app:  string
  },
  created:              string
  updated:              string
  depth:                number
  children:             number
  net_rshares:          number
  is_paidout:           boolean
  payout_at:            string
  payout:               number
  pending_payout_value: string
  author_payout_value:  string
  curator_payout_value: string
  promoted:             string
  replies:              any[]
  author_reputation:    number
  stats: {
      hide:        boolean
      gray:        boolean
      total_votes: number
      flag_weight: number
  },
  url:                  string
  beneficiaries:        string[]
  max_accepted_payout:  string
  percent_hbd:          number
  parent_author:        string
  parent_permlink:      string
  active_votes:         string[]
  blacklists:           string[]
}