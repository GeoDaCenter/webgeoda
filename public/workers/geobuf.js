!function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).geobuf=e()}(function(){return function o(a,u,f){function l(t,e){if(!u[t]){if(!a[t]){var r="function"==typeof require&&require;if(!e&&r)return r(t,!0);if(s)return s(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=u[t]={exports:{}};a[t][0].call(i.exports,function(e){return l(a[t][1][e]||e)},i,i.exports,o,a,u,f)}return u[t].exports}for(var s="function"==typeof require&&require,e=0;e<f.length;e++)l(f[e]);return l}({1:[function(e,t,r){"use strict";var o,a,u,l,s;t.exports=function(e){l=2,s=Math.pow(10,6),u=null,o=[],a=[];var t=e.readFields(n,{});return o=null,t};var f=["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon","GeometryCollection"];function n(e,t,r){var n,i;1===e?o.push(r.readString()):2===e?l=r.readVarint():3===e?s=Math.pow(10,r.readVarint()):4===e?(n=r,(i=t).type="FeatureCollection",i.features=[],n.readMessage(c,i)):5===e?d(r,t):6===e&&p(r,t)}function d(e,t){t.type="Feature";var r=e.readMessage(i,t);return"geometry"in r||(r.geometry=null),r}function p(e,t){return t.type="Point",e.readMessage(g,t)}function c(e,t,r){1===e?t.features.push(d(r,{})):13===e?a.push(y(r)):15===e&&h(r,t)}function i(e,t,r){1===e?t.geometry=p(r,{}):11===e?t.id=r.readString():12===e?t.id=r.readSVarint():13===e?a.push(y(r)):14===e?t.properties=h(r,{}):15===e&&h(r,t)}function g(e,t,r){var n,i,o;1===e?t.type=f[r.readVarint()]:2===e?u=r.readPackedVarint():3===e?(i=r,"Point"===(o=(n=t).type)?n.coordinates=function(e){var t=e.readVarint()+e.pos,r=[];for(;e.pos<t;)r.push(e.readSVarint()/s);return r}(i):"MultiPoint"===o||"LineString"===o?n.coordinates=M(i):"MultiLineString"===o?n.coordinates=w(i):"Polygon"===o?n.coordinates=w(i,!0):"MultiPolygon"===o&&(n.coordinates=function(e){var t=e.readVarint()+e.pos;if(!u)return[[v(e,t,null,!0)]];for(var r=[],n=1,i=0;i<u[0];i++){for(var o=[],a=0;a<u[n];a++)o.push(v(e,t,u[n+1+a],!0));n+=u[n]+1,r.push(o)}return u=null,r}(i))):4===e?(t.geometries=t.geometries||[],t.geometries.push(p(r,{}))):13===e?a.push(y(r)):15===e&&h(r,t)}function y(e){for(var t=e.readVarint()+e.pos,r=null;e.pos<t;){var n=e.readVarint()>>3;1==n?r=e.readString():2==n?r=e.readDouble():3==n?r=e.readVarint():4==n?r=-e.readVarint():5==n?r=e.readBoolean():6==n&&(r=JSON.parse(e.readString()))}return r}function h(e,t){for(var r=e.readVarint()+e.pos;e.pos<r;)t[o[e.readVarint()]]=a[e.readVarint()];return a=[],t}function v(e,t,r,n){for(var i,o=0,a=[],u=[],f=0;f<l;f++)u[f]=0;for(;r?o<r:e.pos<t;){for(i=[],f=0;f<l;f++)u[f]+=e.readSVarint(),i[f]=u[f]/s;a.push(i),o++}return n&&a.push(a[0]),a}function M(e){return v(e,e.readVarint()+e.pos)}function w(e,t){var r=e.readVarint()+e.pos;if(!u)return[v(e,r,null,t)];for(var n=[],i=0;i<u.length;i++)n.push(v(e,r,u[i],t));return u=null,n}},{}],2:[function(e,t,r){"use strict";t.exports=function(e,t){a={},o=[],f=i=0,l=1,function e(t){var r,n;if("FeatureCollection"===t.type)for(r=0;r<t.features.length;r++)e(t.features[r]);else if("Feature"===t.type)for(n in null!==t.geometry&&e(t.geometry),t.properties)g(n);else if("Point"===t.type)c(t.coordinates);else if("MultiPoint"===t.type)p(t.coordinates);else if("GeometryCollection"===t.type)for(r=0;r<t.geometries.length;r++)e(t.geometries[r]);else if("LineString"===t.type)p(t.coordinates);else if("Polygon"===t.type||"MultiLineString"===t.type)d(t.coordinates);else if("MultiPolygon"===t.type)for(r=0;r<t.coordinates.length;r++)d(t.coordinates[r]);for(n in t)S(n,t.type)||g(n)}(e),l=Math.min(l,u);for(var r=Math.ceil(Math.log(l)/Math.LN10),n=0;n<o.length;n++)t.writeStringField(1,o[n]);2!==f&&t.writeVarintField(2,f);6!==r&&t.writeVarintField(3,r);"FeatureCollection"===e.type?t.writeMessage(4,y,e):"Feature"===e.type?t.writeMessage(5,h,e):t.writeMessage(6,v,e);return a=null,t.finish()};var a,i,o,f,l,u=1e6,s={Point:0,MultiPoint:1,LineString:2,MultiLineString:3,Polygon:4,MultiPolygon:5,GeometryCollection:6};function d(e){for(var t=0;t<e.length;t++)p(e[t])}function p(e){for(var t=0;t<e.length;t++)c(e[t])}function c(e){f=Math.max(f,e.length);for(var t=0;t<e.length;t++)for(;Math.round(e[t]*l)/l!==e[t]&&l<u;)l*=10}function g(e){void 0===a[e]&&(o.push(e),a[e]=i++)}function y(e,t){for(var r=0;r<e.features.length;r++)t.writeMessage(1,h,e.features[r]);M(e,t,!0)}function h(e,t){null!==e.geometry&&t.writeMessage(1,v,e.geometry),void 0!==e.id&&("number"==typeof e.id&&e.id%1==0?t.writeSVarintField(12,e.id):t.writeStringField(11,e.id)),e.properties&&M(e.properties,t),M(e,t,!0)}function v(e,t){t.writeVarintField(1,s[e.type]);var r=e.coordinates;if("Point"===e.type)!function(e,t){for(var r=[],n=0;n<f;n++)r.push(Math.round(e[n]*l));t.writePackedSVarint(3,r)}(r,t);else if("MultiPoint"===e.type)V(r,t);else if("LineString"===e.type)V(r,t);else if("MultiLineString"===e.type)m(r,t);else if("Polygon"===e.type)m(r,t,!0);else if("MultiPolygon"===e.type)!function(e,t){var r,n,i=e.length;if(1!==i||1!==e[0].length){var o=[i];for(r=0;r<i;r++)for(o.push(e[r].length),n=0;n<e[r].length;n++)o.push(e[r][n].length-1);t.writePackedVarint(2,o)}var a=[];for(r=0;r<i;r++)for(n=0;n<e[r].length;n++)P(a,e[r][n],!0);t.writePackedSVarint(3,a)}(r,t);else if("GeometryCollection"===e.type)for(var n=0;n<e.geometries.length;n++)t.writeMessage(4,v,e.geometries[n]);M(e,t,!0)}function M(e,t,r){var n=[],i=0;for(var o in e)r&&S(o,e.type)||(t.writeMessage(13,w,e[o]),n.push(a[o]),n.push(i++));t.writePackedVarint(r?15:14,n)}function w(e,t){var r;null!==e&&("string"==(r=typeof e)?t.writeStringField(1,e):"boolean"==r?t.writeBooleanField(5,e):"object"==r?t.writeStringField(6,JSON.stringify(e)):"number"==r&&(e%1!=0?t.writeDoubleField(2,e):0<=e?t.writeVarintField(3,e):t.writeVarintField(4,-e)))}function V(e,t){var r=[];P(r,e),t.writePackedSVarint(3,r)}function m(e,t,r){var n=e.length;if(1!==n){for(var i=[],o=0;o<n;o++)i.push(e[o].length-(r?1:0));t.writePackedVarint(2,i)}var a=[];for(o=0;o<n;o++)P(a,e[o],r);t.writePackedSVarint(3,a)}function P(e,t,r){for(var n,i=t.length-(r?1:0),o=new Array(f),a=0;a<f;a++)o[a]=0;for(n=0;n<i;n++)for(a=0;a<f;a++){var u=Math.round(t[n][a]*l)-o[a];e.push(u),o[a]+=u}}function S(e,t){if("type"===e)return 1;if("FeatureCollection"===t){if("features"===e)return 1}else if("Feature"===t){if("id"===e||"properties"===e||"geometry"===e)return 1}else if("GeometryCollection"===t){if("geometries"===e)return 1}else if("coordinates"===e)return 1}},{}],3:[function(e,t,r){"use strict";r.encode=e("./encode"),r.decode=e("./decode")},{"./decode":1,"./encode":2}]},{},[3])(3)});
