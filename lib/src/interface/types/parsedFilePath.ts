import * as pa from "pareto-api-core"

export type TParsedFilePath = {
    readonly "directoryPath": string[]
    readonly "fileName": string
    readonly "extension": pa.optional<string>
}