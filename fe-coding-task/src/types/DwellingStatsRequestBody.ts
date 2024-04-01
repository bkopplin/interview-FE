export interface DwellingStatsRequestBody {
    query:    Query[];
    response: Response;
}

export interface Query {
    code:      string;
    selection: Selection;
}

export interface Selection {
    filter: string;
    values: string[];
}

export interface Response {
    format: string;
}