export declare type GET_CONTENT = {
  id:                     number
  author:                 string
  permlink:               string
  category:               string
  parent_author:          string|''
  parent_permlink:        string|''
  title:                  string|''
  body:                   string
  json_metadata:          string
  last_update:            string
  created:                string
  active:                 string
  last_payout:            string
  depth:                  number
  children:               number
  net_rshares:            string
  abs_rshares:            string
  vote_rshares:           string
  children_abs_rshares:   string
  cashout_time:           string
  max_cashout_time:       string
  total_vote_weight:      number
  reward_weight:          number
  total_payout_value:     string
  curator_payout_value:   string
  author_rewards:         number
  net_votes:              number
  root_author:            string
  root_permlink:          string
  max_accepted_payout:    string
  percent_hive:          number
  allow_replies:          boolean
  allow_votes:            boolean
  allow_curation_rewards: boolean
  beneficiaries:          Array<[string, number]>
  url:                    string
  root_title:             string
  pending_payout_value:   string
  total_pending_payout_value: string
  active_votes: [
    {
      voter:   string
      weight:  number
      rshares: number
      percent: number
      time:    string
    }
  ],
  replies: Array<any>,
  promoted: "0.000 HIVE",
  body_length: 0,
  reblogged_by: Array<any>
}