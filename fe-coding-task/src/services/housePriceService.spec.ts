// Note that jest must be explicitly imported
import { describe, jest } from '@jest/globals';
import { generateRequestBody } from './housePriceService';

const REQUEST_BODY_FIXTURE = {
    query: [
      {
        code: "Boligtype",
        selection: {
          filter: "item",
          values: [
            "02"
          ]
        }
      },
      {
        code: "ContentsCode",
        selection: {
          filter: "item",
          values: [
            "KvPris"
          ]
        }
      },
      {
        code: "Tid",
        selection: {
          filter: "item",
          values: [
            "2020K1",
            "2020K2",
          ]
        }
      }
    ],
    response: {
      format: "json-stat2"
    }
  }

describe("housePriceService", () => {
    test("should correctly generate a request body", () => {
        const res = generateRequestBody(["02"], ["2020K1", "2020K2"])
        expect(res).toMatchObject(REQUEST_BODY_FIXTURE)
    });
});