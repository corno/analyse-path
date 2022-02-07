import * as pr from "pareto-runtime"

export type TAnalysisResult = {
    readonly "pathPattern": string,
    readonly "path": string[],
    readonly "error": pr.optional<string>,
}