#!/usr/bin/env node

import * as pr from "pareto-bin-core"
import * as pl from "pareto-lib-core"
import * as pt from "pareto-test-lib"
import * as pta from "pareto-test-api"

import * as ap from "../../../../lib"
import { _testProject } from "../../data/testProject"

pl.logDebugMessage("REENABLE TESTS")

// pt.runTests(
//     {
//         callback: ($i) => {

//             $i.subset(
//                 "path tests",
//                 ($i) => {

//                     function test(
//                         pathString: string,
//                         expectedError: string | null,
//                         expectedPathPattern: string,
//                         expectedPath: string,
//                     ) {
//                         $i.subset(
//                             pathString,
//                             ($i) => {
//                                 const res = ap.analysePath(
//                                     _testProject,
//                                     ap.parseFilePath(pathString)
//                                 )
//                                 if (expectedError === null) {
//                                     $i.assert({
//                                         testName: "expect no error",
//                                         condition: res.error === null,
//                                     })
//                                 } else {
//                                     if (res.error === null) {
//                                         $i.assert({
//                                             testName: "expect an error",
//                                             condition: false,
//                                         })
//                                     } else {
//                                         $i.testString({
//                                             testName: "error",
//                                             expected: expectedError,
//                                             actual: res.error,
//                                         })
//                                     }
//                                 }
//                                 $i.testString({
//                                     testName: "path",
//                                     expected: expectedPath,
//                                     actual: `/${res.path.join("/")}`,
//                                 })
//                                 $i.testString({
//                                     testName: "path pattern",
//                                     expected: expectedPathPattern,
//                                     actual: res.pathPattern,
//                                 })
//                             },
//                         )
//                     }

//                     test("f.txt", null, "/f.txt", "/f.txt")
//                     test("f.txt/x.txt", "expected file instead of directory", "/f.txt", "/")
//                     test("foo", "unexpected file: 'foo'", "", "/foo")
//                     test("foo/bar", "unexpected directory: 'foo'", "", "/")
//                     test("ddd", "expected directory instead of file", "/ddd", "/ddd")
//                     test("ddd/f.txt", "expected directory (any name)", "/ddd/*", "/ddd/f.txt")
//                     test("ddd/x/f.txt", null, "/ddd/*/f.txt", "/ddd/x/f.txt")
//                     test("ddd/x/y.txt", "unexpected file: 'y.txt'", "/ddd/*", "/ddd/x/y.txt")
//                     test("td/f.txt", null, "/td/f.txt", "/td/f.txt")
//                     test("td/y.txt", "unexpected file: 'y.txt'", "/td", "/td/y.txt")
//                     test("fdd/y.txt", null, "/fdd/**/*.txt", "/fdd/y.txt")
//                     test("fdd/a/y.txt", null, "/fdd/**/*.txt", "/fdd/a/y.txt")
//                     test("fdd/y.foo", "unexpected extension: 'foo'", "/fdd/**/*.foo", "/fdd/y.foo")
//                     test("fddnr/a/y.txt", "did not expect a directory", "/fddnr/*[txt]", "/fddnr")
//                 },
//             )
//         },
//         log: ($) => {
//             const out = pr.createStdOut()
//             out.write($)
//             out.write("\n")
//         },
//     }
// )
