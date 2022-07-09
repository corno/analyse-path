import * as ap from "../../../lib"

export const _testProject: ap.TDirectory = {
    'type': ["type", {
        'nodes': {
            "f.txt": {
                'type': ["file", {}],
            },
            "td": {
                'type': ["directory", {
                    'type': ["type", {
                        'nodes': {
                            "f.txt": {
                                'type': ["file", {}],
                            }
                        }
                    }]
                }]
            },
            "ddd": {
                'type': ["directory", {
                    "type": ["directory dictionary", {
                        "definition": {
                            "type": ["type", {
                                'nodes': {
                                    "f.txt": {
                                        'type': ["file", {}]
                                    }
                                }
                            }]
                        }
                    }]
                }]
            },
            "fdd": {
                'type': ["directory", {
                    "type": ["files dictionary", {
                        "allow missing extension": false,
                        "extensions": ([`txt`]),
                        'recursive': true,
                    }]
                }]
            },
            "fddnr": {
                'type': ["directory", {
                    "type": ["files dictionary", {
                        "allow missing extension": false,
                        "extensions": ([`txt`]),
                        'recursive': false,
                    }]
                }]
            },
        },
    }],
}