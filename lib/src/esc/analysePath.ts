import * as pl from "pareto-lib-core"

import { TAnalysisResult } from "../interface/types/analysisResult"
import { TDirectory } from "../interface/types/fileSystemStructure"
import { TParsedFilePath } from "../interface/types/parsedFilePath"

export function analysePath(
    def: TDirectory,
    filePath: TParsedFilePath
): TAnalysisResult {
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
    ): TAnalysisResult {

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
    ): TAnalysisResult {
        switch ($d.type[0]) {
            case "directory dictionary":
                return pl.cc($d.type[1], ($d) => {
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
                return pl.cc($d.type[1], ($d) => {
                    function handleFile(
                        pi: PathIterator<string>,
                    ): TAnalysisResult {
                        const newPathPattern = `${pathPattern}${$d.recursive ? "/**" : ""}/*.${filePath.extension}`

                        if (filePath.extension === null) {
                            if (!$d["allow missing extension"]) {
                                return createAnalysisResult(
                                    pi,
                                    newPathPattern,
                                    `unexpected missing extension`,
                                )
                            } else {
                                return createAnalysisResult(
                                    pi,
                                    newPathPattern,
                                    null,
                                )
                            }
                        } else {
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
                    }

                    function recurse(
                        pi: PathIterator<string>
                    ): TAnalysisResult {
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
                return pl.cc($d.type[1], ($d) => {
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
                                    return pl.cc(node.type[1], ($) => {
                                        return analyseDictionary(
                                            pi.next(),
                                            $,
                                            `${pathPattern}/${name}`
                                        )
                                    })
                                case "file":
                                    return pl.cc(node.type[1], ($) => {
                                        return createAnalysisResult(
                                            pi,
                                            `${pathPattern}/${name}`,
                                            `expected file instead of directory`,
                                        )
                                    })
                                default:
                                    return pl.au(node.type[0])
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
                                    return pl.cc(node.type[1], ($) => {
                                        return createAnalysisResult(
                                            pi,
                                            `${pathPattern}/${fileNameWithExtension}`,
                                            `expected directory instead of file`,
                                        )
                                    })
                                case "file":
                                    return pl.cc(node.type[1], (node) => {
                                        return createAnalysisResult(
                                            pi,
                                            `${pathPattern}/${fileNameWithExtension}`,
                                            null,
                                        )
                                    })
                                default:
                                    return pl.au(node.type[0])
                            }
                        }
                    }
                })
            default:
                return pl.au($d.type[0])
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
