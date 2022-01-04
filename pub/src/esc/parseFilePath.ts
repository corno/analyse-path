import * as path from "path"
import { ParsedFilePath } from "../interface/types/parsedFilePath"


export function parseFilePath(
    filePath: string,
): ParsedFilePath {
    const normalizedFilePath = path.normalize(filePath)
    const extWithLeadingDot = path.extname(normalizedFilePath)
    return {
        directoryPath: (() => {
            const dirname = path.dirname(normalizedFilePath)
            if (dirname === ".") {
                return []
            } else {
            return dirname.split(path.sep)
            }
        })(),
        fileName: path.basename(normalizedFilePath, extWithLeadingDot),
        extension: ((): null | string => {
            if (extWithLeadingDot === "") {
                return null
            } else {
                if (extWithLeadingDot[0] !== ".") {
                    throw new Error(`unexpected extension format: ${extWithLeadingDot}`)
                }
                return extWithLeadingDot.slice(1)
            }
        })(),
    }
}
