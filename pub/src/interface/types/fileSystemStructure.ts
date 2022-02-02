
export type TNode = {
    readonly "type":
    | ["file", {}]
    | ["directory", TDirectory]
}

export type TTypeDirectory = {
    readonly "nodes": { [key: string]: TNode }
}

export type TFilesDictionary = {
    readonly "allow missing extension": boolean
    readonly "extensions": string[]
    readonly "recursive": boolean
}

export type TDirectory = {
    readonly "type":
    | ["directory dictionary", {
        readonly "definition": TDirectory
    }]
    | ["files dictionary", TFilesDictionary]
    | ["type", TTypeDirectory]
}
