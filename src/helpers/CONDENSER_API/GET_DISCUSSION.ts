export declare type GET_DISCUSSION = {
  "author":                string
  "permlink":              string
  "category":              string
  "title":                 string
  "body":                  string
  "json_metadata":         string
  "created":               string
  "last_update":           string
  "depth":                 number
  "children":              number
  "last_payout":           string
  "cashout_time":          string
  "total_payout_value":    string
  "curator_payout_value":  string
  "pending_payout_value":  string
  "promoted":              string
  "replies":               Array<string>
  "body_length":           number
  "author_reputation":     number
  "parent_author":         string
  "parent_permlink":       string
  "url":                   string
  "root_title":            string
  "beneficiaries":         Array<{
    account: string // account_name_type
    weight: number // uint16_t
  }>
  "max_accepted_payout":   string
  "percent_hbd":           number
  "post_id":               number
  "net_rshares":           number
  "active_votes":          Array<{
    "percent":    string
    "reputation": number
    "rshares":    number
    "voter":      string
  }>
}