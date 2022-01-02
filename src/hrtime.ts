export const hrtime = (previousTimestamp?: [number, number]): [number, number] => {
  if(typeof process === 'object') {
    return previousTimestamp ? process.hrtime(previousTimestamp) : process.hrtime()
  } else {
    // polyfil for window.performance.now
    const performance: any = global.performance || {}
    const performanceNow =
      performance.now        ||
      performance.mozNow     ||
      performance.msNow      ||
      performance.oNow       ||
      performance.webkitNow  ||
      function(){ return (new Date()).getTime() }

      const clocktime = performanceNow.call(performance)*1e-3
      let seconds = Math.floor(clocktime)
      let nanoseconds = Math.floor((clocktime%1)*1e9)
      if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0]
        nanoseconds = nanoseconds - previousTimestamp[1]
        if (nanoseconds<0) {
          seconds--
          nanoseconds += 1e9
        }
      }
      return [seconds,nanoseconds]
  }
}