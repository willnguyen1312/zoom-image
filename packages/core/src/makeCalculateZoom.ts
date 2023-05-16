import { scaleLinear } from "./utils"

export const makeCalculateZoom = (maxZoom: number) =>
  scaleLinear({
    domainStart: 0,
    domainStop: 100,
    rangeStart: 1,
    rangeStop: maxZoom,
  })
