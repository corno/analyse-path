import * as pa from "pareto-api-core"

export type TAnalysisResult = {
    readonly "pathPattern": string,
    readonly "path": string[],
    readonly "error": pa.optional<string>,
}