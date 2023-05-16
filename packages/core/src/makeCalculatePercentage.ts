import { scaleLinear } from "./utils"

export const makeCalculatePercentage = (maxZoom: number) =>
  scaleLinear({
    domainStart: 1,
    domainStop: maxZoom,
    rangeStart: 0,
    rangeStop: 100,
  })
