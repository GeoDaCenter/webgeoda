exports.id = 495;
exports.ids = [495];
exports.modules = {

/***/ 46243:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "T": () => (/* binding */ Gutter)
/* harmony export */ });
/* unused harmony export Units */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85893);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Units = ["cm", "mm", "in", "px", "pt", "pc", "em", "ex", "ch", "rem", "vh", "vw", "vmin", "vmax"];
const Gutter = props => {
  const style = {};
  Units.forEach(unit => props[unit] ? style.height = `${props[unit]}${unit}` : null);
  return /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
    style: _objectSpread(_objectSpread({}, style), {}, {
      display: 'block'
    })
  });
};

/***/ }),

/***/ 44134:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ MainNav)
/* harmony export */ });
/* harmony import */ var _reach_menu_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(32150);
/* harmony import */ var _reach_menu_button_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(57281);
/* harmony import */ var _reach_menu_button_styles_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reach_menu_button_styles_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _MainNav_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(79102);
/* harmony import */ var _MainNav_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_MainNav_module_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85893);





function MainNav() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: (_MainNav_module_css__WEBPACK_IMPORTED_MODULE_2___default().masthead),
    children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx("h3", {
      className: (_MainNav_module_css__WEBPACK_IMPORTED_MODULE_2___default().mastheadTitle),
      children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx("a", {
        href: "/",
        children: "Webgeoda"
      })
    }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx("nav", {
      className: (_MainNav_module_css__WEBPACK_IMPORTED_MODULE_2___default().mainNav),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_reach_menu_button__WEBPACK_IMPORTED_MODULE_3__/* .Menu */ .v2, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_reach_menu_button__WEBPACK_IMPORTED_MODULE_3__/* .MenuButton */ .j2, {
          children: ["Menu", " ", /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx("span", {
            "aria-hidden": true,
            className: (_MainNav_module_css__WEBPACK_IMPORTED_MODULE_2___default().hamburger),
            children: "\u2630"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_reach_menu_button__WEBPACK_IMPORTED_MODULE_3__/* .MenuList */ .qy, {
          id: "menu",
          children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx(_reach_menu_button__WEBPACK_IMPORTED_MODULE_3__/* .MenuLink */ .Uk, {
            as: "a",
            href: "/",
            children: "Home"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx(_reach_menu_button__WEBPACK_IMPORTED_MODULE_3__/* .MenuLink */ .Uk, {
            as: "a",
            href: "/map",
            children: "Map"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx(_reach_menu_button__WEBPACK_IMPORTED_MODULE_3__/* .MenuLink */ .Uk, {
            as: "a",
            href: "/about",
            children: "About"
          })]
        })]
      })
    })]
  });
}

/***/ }),

/***/ 79102:
/***/ ((module) => {

// Exports
module.exports = {
	"masthead": "MainNav_masthead__1WGSO",
	"mainNav": "MainNav_mainNav__3zm79",
	"hamburger": "MainNav_hamburger__1NV8r",
	"mastheadTitle": "MainNav_mastheadTitle__385e2"
};


/***/ })

};
;