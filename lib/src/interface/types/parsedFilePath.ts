import * as pr from "pareto-runtime"

export type TParsedFilePath = {
    readonly "directoryPath": string[]
    readonly "fileName": string
    readonly "extension": pr.optional<string>
}