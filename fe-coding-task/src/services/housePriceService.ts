import { DWELLING_TYPES } from "../constants/dwellingTypeConstants"
import { DwellingStatsRequestBody, Query } from "../types/DwellingStatsRequestBody"
import { DwellingStatsResponse } from "../types/DwellingStatsResponse"
import { axiosSsbClient } from "./axiosSsbClient"

const HOUSING_PRICE_TABLE_SUFFIX = `/07241`

const dwellingTypeQuery = (typeOfDwelling: string[]): Query[] => ([{
    code: "Boligtype",
    selection: {
      filter: "item",
      values: (typeOfDwelling.length > 0 ? typeOfDwelling : DWELLING_TYPES.map(d => d.index))
    }
  }])
const contentsCodeQuery = (): Query => ({
        code: "ContentsCode",
        selection: {
          filter: "item",
          values: [
            "KvPris"
          ]
        }
      })
const timeQuery = (quarters: string[]): Query => ({
    code: "Tid",
    selection: {
      filter: "item",
      values: quarters
    }
  })

export const generateRequestBody  = (typeOfDwelling: string[], quarters: string[]): DwellingStatsRequestBody => ({
    query: [
        ...dwellingTypeQuery(typeOfDwelling),
        contentsCodeQuery(),
        timeQuery(quarters),
    ],
    response: {
      format: "json-stat2"
    }
})

export const fetchHousingPrices = async (typeOfDwelling: string[], timeRange: string[]): Promise<DwellingStatsResponse> => {
const requestBody = generateRequestBody(typeOfDwelling, timeRange) 

return axiosSsbClient.post(HOUSING_PRICE_TABLE_SUFFIX, requestBody).then(response => {
    if (response.status == 200) {
      const { data } = response
      return data
    } else {
      return "no data"
    }
  }).catch(err => {
    return err
  })
}