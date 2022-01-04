import * as pr from "pareto-runtime"

import * as path from "path"
import { AnalysisResult } from "../interface/types/analysisResult"
import { TDirectory } from "../interface/types/fileSystemStructure"
import { ParsedFilePath } from "../interface/types/parsedFilePath"

export function analysePath(
    def: TDirectory,
    filePath: ParsedFilePath
): AnalysisResult {
    const fileNameWithExtension = `${filePath.fileName}${filePath.extension === null ? "" : `.${filePath.extension}`}`

    type PathIterator<T> = {
        // splittedPath: string[],
        // posx: number,
        next(): PathIterator<T>,
        hasMoreSteps(): boolean,
        getCurrentStepName(): T,
        getCurrentSteps(): T[],
    }
    
    function createPathIterator<T>(
        splittedPath: T[]
    ): PathIterator<T> {
        function create(
            pos: number
        ): PathIterator<T> {
            return {
                next() {
                    return create(pos + 1)
                },
                hasMoreSteps() {
                    return splittedPath.length > pos
                },
                getCurrentStepName() {
                    return splittedPath[pos]
                },
                getCurrentSteps() {
                    return splittedPath.slice(0, pos)
                }
            }
        }
        return create(0)
    }
    function createAnalysisResult(
        pi: PathIterator<string>,
        pathPattern: string,
        error: null | string,
    ): AnalysisResult {

        return {
            pathPattern: pathPattern,
            path: ((): string[] => {
                if (pi.hasMoreSteps()) {
                    return pi.getCurrentSteps()

                } else {
                    return pi.getCurrentSteps().concat([fileNameWithExtension])

                }
            })(),
            error: error,
        }
    }

    function analyseDictionary(
        pi: PathIterator<string>,
        $d: TDirectory,
        pathPattern: string,
    ): AnalysisResult {
        switch ($d.type[0]) {
            case "directory dictionary":
                return pr.cc($d.type[1], ($d) => {
                    if (pi.hasMoreSteps()) {

                        return analyseDictionary(
                            pi.next(),
                            $d.definition,
                            `${pathPattern}/*`,
                        )
                    } else {
                        return createAnalysisResult(
                            pi,
                            `${pathPattern}/*`,
                            "expected directory (any name)",
                        )
                    }
                })
            case "files dictionary":
                return pr.cc($d.type[1], ($d) => {
                    function handleFile(
                        pi: PathIterator<string>,
                    ): AnalysisResult {
                        const newPathPattern = `${pathPattern}${$d.recursive ? "/**" : ""}/*.${filePath.extension}`

                        if (filePath.extension === null) {
                            throw new Error(`implement me ${filePath.fileName}`)
                        }
                        if ($d.extensions.includes(filePath.extension)) {
                            return createAnalysisResult(
                                pi,
                                newPathPattern,
                                null,
                            )
                        } else {
                            return createAnalysisResult(
                                pi,
                                newPathPattern,
                                `unexpected extension: '${filePath.extension}'`,
                            )
                        }
                    }

                    function recurse(
                        pi: PathIterator<string>
                    ): AnalysisResult {
                        if (pi.hasMoreSteps()) {
                            return recurse(pi.next())
                        } else {
                            return handleFile(
                                pi,
                            )
                        }
                    }
                    if ($d.recursive) {
                        return recurse(pi)
                    } else {
                        if (pi.hasMoreSteps()) {
                            return createAnalysisResult(
                                pi,
                                `${pathPattern}${$d.recursive ? "/**" : ""}/*[${$d.extensions.join(",")}]`,
                                "did not expect a directory",
                            )
                        } else {
                            return handleFile(
                                pi,
                            )
                        }
                    }
                })
            case "type":
                return pr.cc($d.type[1], ($d) => {
                    if (pi.hasMoreSteps()) {
                        const name = pi.getCurrentStepName()
                        const node = $d.nodes[name]
                        if (node === undefined) {
                            return createAnalysisResult(
                                pi,
                                `${pathPattern}`,
                                `unexpected directory: '${name}'`,
                            )
                        } else {
                            switch (node.type[0]) {
                                case "directory":
                                    return pr.cc(node.type[1], ($) => {
                                        return analyseDictionary(
                                            pi.next(),
                                            $,
                                            `${pathPattern}/${name}`
                                        )
                                    })
                                case "file":
                                    return pr.cc(node.type[1], ($) => {
                                        return createAnalysisResult(
                                            pi,
                                            `${pathPattern}/${name}`,
                                            `expected file instead of directory`,
                                        )
                                    })
                                default:
                                    return pr.au(node.type[0])
                            }
                        }
                    } else {
                        const node = $d.nodes[fileNameWithExtension]
                        if (node === undefined) {
                            return createAnalysisResult(
                                pi,
                                `${pathPattern}`,
                                `unexpected file: '${fileNameWithExtension}'`,
                            )
                        } else {
                            switch (node.type[0]) {
                                case "directory":
                                    return pr.cc(node.type[1], ($) => {
                                        return createAnalysisResult(
                                            pi,
                                            `${pathPattern}/${fileNameWithExtension}`,
                                            `expected directory instead of file`,
                                        )
                                    })
                                case "file":
                                    return pr.cc(node.type[1], (node) => {
                                        return createAnalysisResult(
                                            pi,
                                            `${pathPattern}/${fileNameWithExtension}`,
                                            null,
                                        )
                                    })
                                default:
                                    return pr.au(node.type[0])
                            }
                        }
                    }
                })
            default:
                return pr.au($d.type[0])
        }
    }
    return analyseDictionary(
        createPathIterator(
            filePath.directoryPath,
        ),
        def,
        "",
    )
}
