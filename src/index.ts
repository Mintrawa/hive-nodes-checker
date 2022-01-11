/** Axios */
import axios, { AxiosRequestConfig } from "axios"

/** RxJS */
import { Subject } from "rxjs";

/** Process hrtime for browser (node + fallback) */
import { hrtime } from './hrtime'

/** Test list to proceed */
import { testList } from "./tests";

/** TYPE */
import { GET_CONFIG }  from "./helpers/CONDENSER_API/GET_CONFIG"

import {
  OPTIONS, JSONRPC, TEST_RPC_NODE, RPC_NODE, FULL_TEST
} from "./helpers"
export {
  TEST_RPC_NODE, RPC_NODE
} from "./helpers"

const RegExpUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,=.]+$/

export class HiveNodesChecker {
  nodes: RPC_NODE[] = []
  message = new Subject<RPC_NODE[]>()
  timer!: ReturnType<typeof setTimeout>

  full     = false
  interval = 900000
  timeout  = 3000
  reset?: number

  tests: FULL_TEST[] = testList(60000000, "hiveio", "hive-first-community-hardfork-complete", "mintrawa")

  instance = axios.create()
  intercept?: string

  constructor(nodes: string[], options?:OPTIONS) {
    if(options) {
      if(options.full && (typeof options.full) === 'boolean') this.full = options.full
      if(options.interval && typeof options.interval === 'number') this.interval = options.interval * 1000
      if(options.timeout && typeof options.timeout === 'number') this.timeout = options.timeout * 1000
      if(options.reset && typeof options.reset === 'number') this.reset = options.reset
    }

    for (const node of nodes) {
      const isUrlValid = new RegExp(RegExpUrl)
      if(isUrlValid.test(node)) {
        this.nodes.push({
          url:         node,
          nb_ok:       0,
          nb_error:    0,
          nb_degraded: 0,
          last_check:  Date.now(),
          status:      "unkown",
          test_result: []
        })
      } else {
        this.message.error(new Error(`${node} is not a valid url`))
      }
    }
  }

  public async start(): Promise<void> {
    try {
      this.instance.interceptors.request.use((config) => {
        if(config && config.headers && config.headers.starttime) delete config.headers.starttime
        return config;
      }, (error) => {
          return Promise.reject(error);
      })

      if(this.nodes.length > 0) {
        setTimeout(() => {
          this.check()
        }, 25);
        this.timer = setInterval(async () => {
          this.check()
        }, this.interval)
      }
    } catch (error) {
      clearInterval(this.timer)
      this.message.error((error as ReturnType<typeof Error>).message)
    }
  }

  public stop(): void {
    clearInterval(this.timer)
  }

  public restart(): void {
    clearInterval(this.timer)
    this.start()
  }

  private async check(): Promise<void> {
    /** Define the execution time (used for sendMessage) */
    const checkTime = Date.now()

    /** Node Loop */
    for (const [i, node] of this.nodes.entries()) {
      /** We reach the reset number of tests => reinit counters value */
      if(this.reset && (node.nb_ok + node.nb_error + node.nb_degraded) === this.reset) {
        this.nodes[i].nb_ok = 0
        this.nodes[i].nb_error = 0
        this.nodes[i].nb_degraded = 0
      }

      /** hrtime */
      const startRequestNode = hrtime()

      /** First request to HIVE node (light test) */
      const options: AxiosRequestConfig = {
        method: "post",
        url: node.url,
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          jsonrpc: "2.0",
          method:  "condenser_api.get_config",
          params:  [],
          id: 1
        },
        timeout: this.timeout
      }
      this.instance(options).then(async get_config =>{
        /** hrtime */
        const stopRequestNode = hrtime(startRequestNode)
        const milli = (stopRequestNode[0] * 1e9 + stopRequestNode[1]) / 1e6

        const config: JSONRPC = get_config.data
        if(config.error) throw new Error(config.error.message)
        if(config.result) {
          this.nodes[i].nb_ok++
          this.nodes[i].status   = "online"
          this.nodes[i].version  = (config.result as GET_CONFIG).HIVE_BLOCKCHAIN_VERSION 
          this.nodes[i].duration = Math.round(milli)

          /** Execute a full test */
          if(this.full) {
            /** Test Loop */
            for (const test of this.tests) {
              /** hrtime */
              const startRequestTest = hrtime()

              /** Check if previous test */
              const tIndex  = node.test_result.findIndex(t => t.method === test.method)

              /** Execute the test */
              const options: AxiosRequestConfig = {
                method: "post",
                url: node.url,
                headers: {
                  "Content-Type": "application/json"
                },
                data: {
                  jsonrpc: "2.0",
                  method:  test.method,
                  params:  test.params,
                  id: 1
                },
                timeout: this.timeout
              }
              this.instance(options).then(get_config => {
                /** hrtime */
                const stopRequestStop = hrtime(startRequestTest)
                const milli = (stopRequestStop[0] * 1e9 + stopRequestStop[1]) / 1e6

                const config: JSONRPC|null = get_config.data ? get_config.data : null
                const success = config && config.result && test.validator ? test.validator(config.result) : false
                
                /** Result of the test */
                const r:TEST_RPC_NODE = {
                  name:        test.name,
                  description: test.description,
                  method:      test.method,
                  success:     success,
                  duration:    Math.round(milli),
                  last_check:  checkTime
                }

                /** If test validation failed */
                if(!success) {
                  r.error = config && config.error ? config.error.message : "validation failed!"
                  /** update status of node */
                  this.nodes[i].status = "degraded"
                  /** update degraded counter */
                  this.nodes[i].nb_degraded++
                  /** correct OK counter */
                  this.nodes[i].nb_ok--
                  /** Update average time */
                  delete this.nodes[i].average_time
                } else {
                  /** update status of node */
                  this.nodes[i].status = "online"
                  /** Update average time */
                  this.nodes[i].average_time = this.nodes[i].average_time ? Math.round(((this.nodes[i].average_time as number) + r.duration)/ 2) : r.duration
                }

                /** If old result update else add */
                if(tIndex >= 0) {
                  this.nodes[i].test_result[tIndex] = r
                } else {
                  this.nodes[i].test_result.push(r)
                }

                /** End of tests for the node? */
                const nbTest = this.nodes[i].test_result.filter(n => n.last_check === checkTime)
                if(nbTest.length === this.tests.length) {
                  /** assign the execution time */
                  this.nodes[i].last_check = checkTime

                  /** Send message? */
                  this.sendMessage(checkTime)
                }
              }).catch(error => {
                /** Result of the test */
                const r:TEST_RPC_NODE = {
                  name:        test.name,
                  description: test.description,
                  method:      test.method,
                  success:     false,
                  duration:    999999,
                  last_check:  checkTime,
                  error:       error.message
                }

                /** update status of node */
                this.nodes[i].status = "degraded"
                /** update degraded counter */
                this.nodes[i].nb_degraded++
                /** correct OK counter */
                this.nodes[i].nb_ok--

                /** If old result update else add */
                if(tIndex >= 0) {
                  this.nodes[i].test_result[tIndex] = r
                } else {
                  this.nodes[i].test_result.push(r)
                }

                /** Update average time */
                delete this.nodes[i].average_time

                /** End of tests for the node? */
                const nbTest = this.nodes[i].test_result.filter(n => n.last_check === checkTime)
                if(nbTest.length === this.tests.length) {
                  /** assign the execution time */
                  this.nodes[i].last_check = checkTime

                  /** Send message? */
                  this.sendMessage(checkTime)
                }
              })
            }
          } else {
            /** assign the execution time */
            this.nodes[i].last_check = checkTime

            /** Send message? */
            this.sendMessage(checkTime)
          }
        } else {
          this.nodes[i].nb_error++
          this.nodes[i].status = "error"
          this.nodes[i].error  = "No result!"

          /** assign the execution time */
          this.nodes[i].last_check = checkTime

          /** Send message? */
          this.sendMessage(checkTime)
        }
      }).catch(error => {
        this.nodes[i].nb_error++
        this.nodes[i].status = "error"
        if(error) this.nodes[i].error  = (error as ReturnType<typeof Error>).message

        /** assign the execution time */
        this.nodes[i].last_check = checkTime

        /** Send message? */
        this.sendMessage(checkTime)
      })
    }
  }

  private async sendMessage(checkTime: number): Promise<void> {
    /** Send message? */
    const nbNodeChecked = this.nodes.filter(n => n.last_check === checkTime)

    if(this.nodes.length === nbNodeChecked.length) this.message.next(this.nodes)
  }
}
