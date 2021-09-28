/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 96008:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9669);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// export default (req, res) => {
//     console.log(`http://localhost:3000/api/geojson/tx.geojson`)
//     res.status(200).json({ test: 'test' });
// };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async (req, res) => {
  const url = `https://webgeoda.vercel.app/geojson/tx.geojson`;
  await axios__WEBPACK_IMPORTED_MODULE_0___default().get(url).then(({
    data
  }) => {
    res.status(200).json({
      data: data.features[0]
    });
  }).catch(({
    err
  }) => {
    res.status(400).json({
      err
    });
  });
});

/***/ }),

/***/ 62487:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ next_serverless_loaderpage_2Fapi_2Fdatasets_absolutePagePath_private_next_pages_2Fapi_2Fdatasets_js_absoluteAppPath_private_next_pages_2F_app_js_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_absoluteErrorPath_next_2Fdist_2Fpages_2F_error_absolute404Path_distDir_private_dot_next_buildId_build_assetPrefix_generateEtags_true_poweredByHeader_true_canonicalBase_basePath_runtimeConfig_previewProps_7B_22previewModeId_22_3A_22094e0d4aa8de87ee5e3b72ea2f2e6aad_22_2C_22previewModeSigningKey_22_3A_22b3c18dcc173f7694504d496d7e2003724b4e39807dac27e5d311c0549ed88fe1_22_2C_22previewModeEncryptionKey_22_3A_223bd514925de4a3fd9000d41cd7a7294880c21d8d9167b267810a7416befa1972_22_7D_loadedEnvFiles_W10_3D_i18n_)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-fetch.js
var node_polyfill_fetch = __webpack_require__(70607);
;// CONCATENATED MODULE: ./.next/routes-manifest.json
const routes_manifest_namespaceObject = {"Dg":[]};
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-serverless-loader/api-handler.js
var api_handler = __webpack_require__(88277);
;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-serverless-loader/index.js?page=%2Fapi%2Fdatasets&absolutePagePath=private-next-pages%2Fapi%2Fdatasets.js&absoluteAppPath=private-next-pages%2F_app.js&absoluteDocumentPath=next%2Fdist%2Fpages%2F_document&absoluteErrorPath=next%2Fdist%2Fpages%2F_error&absolute404Path=&distDir=private-dot-next&buildId=build&assetPrefix=&generateEtags=true&poweredByHeader=true&canonicalBase=&basePath=&runtimeConfig=&previewProps=%7B%22previewModeId%22%3A%22094e0d4aa8de87ee5e3b72ea2f2e6aad%22%2C%22previewModeSigningKey%22%3A%22b3c18dcc173f7694504d496d7e2003724b4e39807dac27e5d311c0549ed88fe1%22%2C%22previewModeEncryptionKey%22%3A%223bd514925de4a3fd9000d41cd7a7294880c21d8d9167b267810a7416befa1972%22%7D&loadedEnvFiles=W10%3D&i18n=!

        
      const { processEnv } = __webpack_require__(72333)
      processEnv([])
    
        
        const runtimeConfig = {}
        ;
        

        

        const combinedRewrites = Array.isArray(routes_manifest_namespaceObject.Dg)
          ? routes_manifest_namespaceObject.Dg
          : []

        if (!Array.isArray(routes_manifest_namespaceObject.Dg)) {
          combinedRewrites.push(...routes_manifest_namespaceObject.Dg.beforeFiles)
          combinedRewrites.push(...routes_manifest_namespaceObject.Dg.afterFiles)
          combinedRewrites.push(...routes_manifest_namespaceObject.Dg.fallback)
        }

        const apiHandler = (0,api_handler/* getApiHandler */.Y)({
          pageModule: __webpack_require__(96008),
          rewrites: combinedRewrites,
          i18n: undefined,
          page: "/api/datasets",
          basePath: "",
          pageIsDynamic: false,
          encodedPreviewProps: {previewModeId:"094e0d4aa8de87ee5e3b72ea2f2e6aad",previewModeSigningKey:"b3c18dcc173f7694504d496d7e2003724b4e39807dac27e5d311c0549ed88fe1",previewModeEncryptionKey:"3bd514925de4a3fd9000d41cd7a7294880c21d8d9167b267810a7416befa1972"}
        })
        /* harmony default export */ const next_serverless_loaderpage_2Fapi_2Fdatasets_absolutePagePath_private_next_pages_2Fapi_2Fdatasets_js_absoluteAppPath_private_next_pages_2F_app_js_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_absoluteErrorPath_next_2Fdist_2Fpages_2F_error_absolute404Path_distDir_private_dot_next_buildId_build_assetPrefix_generateEtags_true_poweredByHeader_true_canonicalBase_basePath_runtimeConfig_previewProps_7B_22previewModeId_22_3A_22094e0d4aa8de87ee5e3b72ea2f2e6aad_22_2C_22previewModeSigningKey_22_3A_22b3c18dcc173f7694504d496d7e2003724b4e39807dac27e5d311c0549ed88fe1_22_2C_22previewModeEncryptionKey_22_3A_223bd514925de4a3fd9000d41cd7a7294880c21d8d9167b267810a7416befa1972_22_7D_loadedEnvFiles_W10_3D_i18n_ = (apiHandler);
      

/***/ }),

/***/ 59521:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 59521;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 42357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 64293:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 76417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 28614:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 35747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 98605:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 57211:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 12087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 85622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 71191:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ 92413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 24304:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 33867:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 78835:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 31669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 78761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, [112,130,639,277,669], () => (__webpack_require__(62487)))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	                // Font manifest declaration
/******/ 	                __webpack_require__.__NEXT_FONT_MANIFEST__ = [{"url":"https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,900;1,400;1,700&family=Lora:ital@0;1&display=swap","content":"@font-face{font-family:'Lato';font-style:italic;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6u8w4BMUTPHjxswWA.woff) format('woff')}@font-face{font-family:'Lato';font-style:italic;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6u_w4BMUTPHjxsI5wqPHw.woff) format('woff')}@font-face{font-family:'Lato';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6uyw4BMUTPHvxo.woff) format('woff')}@font-face{font-family:'Lato';font-style:normal;font-weight:900;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6u9w4BMUTPHh50Xeww.woff) format('woff')}@font-face{font-family:'Lora';font-style:italic;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI8MX1D_JOuMw_hLdO6T2wV9KnW-MoFkqs.woff) format('woff')}@font-face{font-family:'Lora';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI6MX1D_JOuGQbT0gvTJPa787weuyJF.woff) format('woff')}@font-face{font-family:'Lato';font-style:italic;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6u8w4BMUTPHjxsAUi-qNiXg7eU0.woff2) format('woff2');unicode-range:U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'Lato';font-style:italic;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6u8w4BMUTPHjxsAXC-qNiXg7Q.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'Lato';font-style:italic;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6u_w4BMUTPHjxsI5wq_FQftx9897sxZ.woff2) format('woff2');unicode-range:U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'Lato';font-style:italic;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6u_w4BMUTPHjxsI5wq_Gwftx9897g.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'Lato';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6uyw4BMUTPHjxAwXiWtFCfQ7A.woff2) format('woff2');unicode-range:U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'Lato';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6uyw4BMUTPHjx4wXiWtFCc.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'Lato';font-style:normal;font-weight:900;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6u9w4BMUTPHh50XSwaPGQ3q5d0N7w.woff2) format('woff2');unicode-range:U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'Lato';font-style:normal;font-weight:900;font-display:swap;src:url(https://fonts.gstatic.com/s/lato/v20/S6u9w4BMUTPHh50XSwiPGQ3q5d0.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'Lora';font-style:italic;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI8MX1D_JOuMw_hLdO6T2wV9KnW-MoFoqJ2mvWc3ZyhTjcV.woff) format('woff');unicode-range:U+0460-052F,U+1C80-1C88,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F}@font-face{font-family:'Lora';font-style:italic;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI8MX1D_JOuMw_hLdO6T2wV9KnW-MoFoqt2mvWc3ZyhTjcV.woff) format('woff');unicode-range:U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}@font-face{font-family:'Lora';font-style:italic;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI8MX1D_JOuMw_hLdO6T2wV9KnW-MoFoqB2mvWc3ZyhTjcV.woff) format('woff');unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB}@font-face{font-family:'Lora';font-style:italic;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI8MX1D_JOuMw_hLdO6T2wV9KnW-MoFoqF2mvWc3ZyhTjcV.woff) format('woff');unicode-range:U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'Lora';font-style:italic;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI8MX1D_JOuMw_hLdO6T2wV9KnW-MoFoq92mvWc3ZyhTg.woff) format('woff');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'Lora';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI6MX1D_JOuGQbT0gvTJPa787weuxJMkqt8ndeYxZ2JTg.woff) format('woff');unicode-range:U+0460-052F,U+1C80-1C88,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F}@font-face{font-family:'Lora';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI6MX1D_JOuGQbT0gvTJPa787weuxJFkqt8ndeYxZ2JTg.woff) format('woff');unicode-range:U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}@font-face{font-family:'Lora';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI6MX1D_JOuGQbT0gvTJPa787weuxJOkqt8ndeYxZ2JTg.woff) format('woff');unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB}@font-face{font-family:'Lora';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI6MX1D_JOuGQbT0gvTJPa787weuxJPkqt8ndeYxZ2JTg.woff) format('woff');unicode-range:U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'Lora';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lora/v17/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkqt8ndeYxZ0.woff) format('woff');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}"}];
/******/ 	            // Enable feature:
/******/ 	            process.env.__NEXT_OPTIMIZE_FONTS = JSON.stringify(true);
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			574: 1
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.require = (chunkId) => (installedChunks[chunkId]);
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 			__webpack_require__.O();
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("../../chunks/" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			__webpack_require__.e(112);
/******/ 			__webpack_require__.e(130);
/******/ 			__webpack_require__.e(639);
/******/ 			__webpack_require__.e(277);
/******/ 			__webpack_require__.e(669);
/******/ 			return next();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;