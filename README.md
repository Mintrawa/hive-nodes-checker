# HIVE nodes checker

Regularly checks availability and performance of [HIVE blockchain](https://hive.io/) RPC nodes asynchronously, stores the result in an in-memory array, and sends the result through a subscription (RxJS).

## Getting Started

### Installation

#### Using npm:

```bash
$  npm install @mintrawa/hive-nodes-checker --save
```

#### Using browser:

```html
<script type="module" src="./dist/hive-nodes-checker.min.js"></script>
```

#### From the source:

clone the repository

```bash
$  git clone https://github.com/Mintrawa/hive-nodes-checker.git
```

Build for NodeJS/Angular... in `"./lib"` directory

```bash
$  npm run build
```

Build for browser (minified) in `"./dist"` directory

```bash
$  npm run build-brower
```

### Example usage

Performing a full checking:

```js
import { HiveNodesChecker } from '@mintrawa/hive-nodes-checker'

/** HIVE nodes url to check */
const nodes = [
  "https://api.hive.blog",
  "https://api.openhive.network",
  "https://api.deathwing.me",
  "https://rpc.ausbit.dev",
  "https://rpc.ecency.com",
  "https://hive-api.arcange.eu",
]

/** Options */
const options = {
  full: true,
  interval: 600 // 10 minutes
}
/** Init the checker */
const nodesChecker = new HiveNodesChecker(nodes, options)
/** Start the checker */
nodesChecker.start()
/** Subscribe results */
nodesChecker.message.subscribe({
  next: async m => {
    console.log('=====> NEW MESSAGE', m)
    console.log()
  },
  error: error => {
    console.log('=====> ERROR MESSAGE')
    console.log(error)
    console.log()
  }
})  
```

### Params
- `url`: array of node url to check
- `options` (optional):
    - `full` (boolean): if false perform only a `get_config` with response time (default: false)
    - `interval` (seconds): delay in seconds between each execution (default: 900 seconds)
    - `timeout` (seconds): timeout in seconds for node request (default: 3 seconds)

### Light checking

In this case, only a call to the rpc method `condenser_api.get_config` is made.

#### Result
```ts
[{
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

  test_result:   []
}]
```

#### Exemple of result for a light checking
```js
[
  {
    url: 'https://api.hive.blog',
    nb_ok: 1,
    nb_error: 0,
    last_check: 1641001821365,
    status: 'online',
    test_result: [],
    version: '1.25.0',
    duration: 1558
  },
  ...
]
```

### Full checking

In this case the methods below are checked:

- `condenser_api.get_config`
- `condenser_api.get_dynamic_global_properties`
- `condenser_api.get_block`
- `condenser_api.get_accounts`
- `condenser_api.get_account_history`
- `bridge.get_post`
- `bridge.get_account_posts`

#### Result
```ts
[{
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

  test_result:   [{
    name:        string
    description: string
    method:      string
    success:     boolean
    duration:    number
    error?:      string
    last_check:  number
  }]
}]
```

#### Exemple of result for a full checking
```js
[
  {
    url: 'https://api.hive.blog',
    nb_ok: 1,
    nb_error: 0,
    last_check: 1641002823566,
    status: 'online',
    test_result: [
      {
        name: 'Get Account',
        description: 'Retrieve an account details',
        method: 'condenser_api.get_accounts',
        success: true,
        duration: 1166,
        last_check: 1641002823566
      },
      ...
    ],
    version: '1.25.0',
    duration: 1273,
    average_time: 1748
  },
  ...
]
```

## Contributing

Pull requests for new features, bug fixes, and suggestions are welcome!

## License

Copyright (C) 2021  @mintrawa (https://hive.blog/@mintrawa)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.