!function(r, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (r = "undefined" != typeof globalThis ? globalThis : r || self).readXlsxFile = e()
}(this, (function() {
    "use strict";
    var r = {
        createDocument: function(r) {
            return (new DOMParser).parseFromString(r.trim(), "text/xml")
        }
    }
      , e = Uint8Array
      , t = Uint16Array
      , n = Uint32Array
      , o = new e([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0])
      , i = new e([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0])
      , u = new e([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
      , a = function(r, e) {
        for (var o = new t(31), i = 0; i < 31; ++i)
            o[i] = e += 1 << r[i - 1];
        var u = new n(o[30]);
        for (i = 1; i < 30; ++i)
            for (var a = o[i]; a < o[i + 1]; ++a)
                u[a] = a - o[i] << 5 | i;
        return [o, u]
    }
      , f = a(o, 2)
      , l = f[0]
      , c = f[1];
    l[28] = 258,
    c[258] = 28;
    for (var s = a(i, 0)[0], p = new t(32768), y = 0; y < 32768; ++y) {
        var m = (43690 & y) >>> 1 | (21845 & y) << 1;
        m = (61680 & (m = (52428 & m) >>> 2 | (13107 & m) << 2)) >>> 4 | (3855 & m) << 4,
        p[y] = ((65280 & m) >>> 8 | (255 & m) << 8) >>> 1
    }
    var b = function(r, e, n) {
        for (var o = r.length, i = 0, u = new t(e); i < o; ++i)
            r[i] && ++u[r[i] - 1];
        var a, f = new t(e);
        for (i = 0; i < e; ++i)
            f[i] = f[i - 1] + u[i - 1] << 1;
        if (n) {
            a = new t(1 << e);
            var l = 15 - e;
            for (i = 0; i < o; ++i)
                if (r[i])
                    for (var c = i << 4 | r[i], s = e - r[i], y = f[r[i] - 1]++ << s, m = y | (1 << s) - 1; y <= m; ++y)
                        a[p[y] >>> l] = c
        } else
            for (a = new t(o),
            i = 0; i < o; ++i)
                r[i] && (a[i] = p[f[r[i] - 1]++] >>> 15 - r[i]);
        return a
    }
      , v = new e(288);
    for (y = 0; y < 144; ++y)
        v[y] = 8;
    for (y = 144; y < 256; ++y)
        v[y] = 9;
    for (y = 256; y < 280; ++y)
        v[y] = 7;
    for (y = 280; y < 288; ++y)
        v[y] = 8;
    var d = new e(32);
    for (y = 0; y < 32; ++y)
        d[y] = 5;
    var h = b(v, 9, 1)
      , g = b(d, 5, 1)
      , w = function(r) {
        for (var e = r[0], t = 1; t < r.length; ++t)
            r[t] > e && (e = r[t]);
        return e
    }
      , O = function(r, e, t) {
        var n = e / 8 | 0;
        return (r[n] | r[n + 1] << 8) >> (7 & e) & t
    }
      , S = function(r, e) {
        var t = e / 8 | 0;
        return (r[t] | r[t + 1] << 8 | r[t + 2] << 16) >> (7 & e)
    }
      , j = function(r, o, i) {
        (null == o || o < 0) && (o = 0),
        (null == i || i > r.length) && (i = r.length);
        var u = new (2 == r.BYTES_PER_ELEMENT ? t : 4 == r.BYTES_PER_ELEMENT ? n : e)(i - o);
        return u.set(r.subarray(o, i)),
        u
    }
      , A = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"]
      , E = function(r, e, t) {
        var n = new Error(e || A[r]);
        if (n.code = r,
        Error.captureStackTrace && Error.captureStackTrace(n, E),
        !t)
            throw n;
        return n
    }
      , P = function(r, t, n) {
        var a = r.length;
        if (!a || n && n.f && !n.l)
            return t || new e(0);
        var f = !t || n
          , c = !n || n.i;
        n || (n = {}),
        t || (t = new e(3 * a));
        var p = function(r) {
            var n = t.length;
            if (r > n) {
                var o = new e(Math.max(2 * n, r));
                o.set(t),
                t = o
            }
        }
          , y = n.f || 0
          , m = n.p || 0
          , v = n.b || 0
          , d = n.l
          , A = n.d
          , P = n.m
          , x = n.n
          , I = 8 * a;
        do {
            if (!d) {
                y = O(r, m, 1);
                var T = O(r, m + 1, 3);
                if (m += 3,
                !T) {
                    var k = r[(L = 4 + ((m + 7) / 8 | 0)) - 4] | r[L - 3] << 8
                      , N = L + k;
                    if (N > a) {
                        c && E(0);
                        break
                    }
                    f && p(v + k),
                    t.set(r.subarray(L, N), v),
                    n.b = v += k,
                    n.p = m = 8 * N,
                    n.f = y;
                    continue
                }
                if (1 == T)
                    d = h,
                    A = g,
                    P = 9,
                    x = 5;
                else if (2 == T) {
                    var D = O(r, m, 31) + 257
                      , C = O(r, m + 10, 15) + 4
                      , _ = D + O(r, m + 5, 31) + 1;
                    m += 14;
                    for (var F = new e(_), M = new e(19), U = 0; U < C; ++U)
                        M[u[U]] = O(r, m + 3 * U, 7);
                    m += 3 * C;
                    var R = w(M)
                      , $ = (1 << R) - 1
                      , B = b(M, R, 1);
                    for (U = 0; U < _; ) {
                        var L, V = B[O(r, m, $)];
                        if (m += 15 & V,
                        (L = V >>> 4) < 16)
                            F[U++] = L;
                        else {
                            var X = 0
                              , q = 0;
                            for (16 == L ? (q = 3 + O(r, m, 3),
                            m += 2,
                            X = F[U - 1]) : 17 == L ? (q = 3 + O(r, m, 7),
                            m += 3) : 18 == L && (q = 11 + O(r, m, 127),
                            m += 7); q--; )
                                F[U++] = X
                        }
                    }
                    var z = F.subarray(0, D)
                      , G = F.subarray(D);
                    P = w(z),
                    x = w(G),
                    d = b(z, P, 1),
                    A = b(G, x, 1)
                } else
                    E(1);
                if (m > I) {
                    c && E(0);
                    break
                }
            }
            f && p(v + 131072);
            for (var Y = (1 << P) - 1, W = (1 << x) - 1, H = m; ; H = m) {
                var J = (X = d[S(r, m) & Y]) >>> 4;
                if ((m += 15 & X) > I) {
                    c && E(0);
                    break
                }
                if (X || E(2),
                J < 256)
                    t[v++] = J;
                else {
                    if (256 == J) {
                        H = m,
                        d = null;
                        break
                    }
                    var K = J - 254;
                    if (J > 264) {
                        var Q = o[U = J - 257];
                        K = O(r, m, (1 << Q) - 1) + l[U],
                        m += Q
                    }
                    var Z = A[S(r, m) & W]
                      , rr = Z >>> 4;
                    Z || E(3),
                    m += 15 & Z;
                    G = s[rr];
                    if (rr > 3) {
                        Q = i[rr];
                        G += S(r, m) & (1 << Q) - 1,
                        m += Q
                    }
                    if (m > I) {
                        c && E(0);
                        break
                    }
                    f && p(v + 131072);
                    for (var er = v + K; v < er; v += 4)
                        t[v] = t[v - G],
                        t[v + 1] = t[v + 1 - G],
                        t[v + 2] = t[v + 2 - G],
                        t[v + 3] = t[v + 3 - G];
                    v = er
                }
            }
            n.l = d,
            n.p = H,
            n.b = v,
            n.f = y,
            d && (y = 1,
            n.m = P,
            n.d = A,
            n.n = x)
        } while (!y);
        return v == t.length ? t : j(t, 0, v)
    }
      , x = new e(0)
      , I = function(r, e) {
        return r[e] | r[e + 1] << 8
    }
      , T = function(r, e) {
        return (r[e] | r[e + 1] << 8 | r[e + 2] << 16 | r[e + 3] << 24) >>> 0
    }
      , k = function(r, e) {
        return T(r, e) + 4294967296 * T(r, e + 4)
    };
    function N(r, e) {
        return P(r, e)
    }
    var D = "undefined" != typeof TextDecoder && new TextDecoder;
    try {
        D.decode(x, {
            stream: !0
        }),
        1
    } catch (r) {}
    var C = function(r) {
        for (var e = "", t = 0; ; ) {
            var n = r[t++]
              , o = (n > 127) + (n > 223) + (n > 239);
            if (t + o > r.length)
                return [e, j(r, t - 1)];
            o ? 3 == o ? (n = ((15 & n) << 18 | (63 & r[t++]) << 12 | (63 & r[t++]) << 6 | 63 & r[t++]) - 65536,
            e += String.fromCharCode(55296 | n >> 10, 56320 | 1023 & n)) : e += 1 & o ? String.fromCharCode((31 & n) << 6 | 63 & r[t++]) : String.fromCharCode((15 & n) << 12 | (63 & r[t++]) << 6 | 63 & r[t++]) : e += String.fromCharCode(n)
        }
    };
    function _(r, e) {
        if (e) {
            for (var t = "", n = 0; n < r.length; n += 16384)
                t += String.fromCharCode.apply(null, r.subarray(n, n + 16384));
            return t
        }
        if (D)
            return D.decode(r);
        var o = C(r)
          , i = o[0];
        return o[1].length && E(8),
        i
    }
    var F = function(r, e) {
        return e + 30 + I(r, e + 26) + I(r, e + 28)
    }
      , M = function(r, e, t) {
        var n = I(r, e + 28)
          , o = _(r.subarray(e + 46, e + 46 + n), !(2048 & I(r, e + 8)))
          , i = e + 46 + n
          , u = T(r, e + 20)
          , a = t && 4294967295 == u ? U(r, i) : [u, T(r, e + 24), T(r, e + 42)]
          , f = a[0]
          , l = a[1]
          , c = a[2];
        return [I(r, e + 10), f, l, o, i + I(r, e + 30) + I(r, e + 32), c]
    }
      , U = function(r, e) {
        for (; 1 != I(r, e); e += 4 + I(r, e + 2))
            ;
        return [k(r, e + 12), k(r, e + 4), k(r, e + 20)]
    };
    function R(r) {
        var t = function(r, t) {
            for (var n = {}, o = r.length - 22; 101010256 != T(r, o); --o)
                (!o || r.length - o > 65558) && E(13);
            var i = I(r, o + 8);
            if (!i)
                return {};
            var u = T(r, o + 16)
              , a = 4294967295 == u || 65535 == i;
            if (a) {
                var f = T(r, o - 12);
                (a = 101075792 == T(r, f)) && (i = T(r, f + 32),
                u = T(r, f + 48))
            }
            for (var l = t && t.filter, c = 0; c < i; ++c) {
                var s = M(r, u, a)
                  , p = s[0]
                  , y = s[1]
                  , m = s[2]
                  , b = s[3]
                  , v = s[4]
                  , d = s[5]
                  , h = F(r, d);
                u = v,
                l && !l({
                    name: b,
                    size: y,
                    originalSize: m,
                    compression: p
                }) || (p ? 8 == p ? n[b] = N(r.subarray(h, h + y), new e(m)) : E(14, "unknown compression type " + p) : n[b] = j(r, h, h + y))
            }
            return n
        }(new Uint8Array(r));
        return Promise.resolve(function(r) {
            for (var e = [], t = 0, n = Object.keys(r); t < n.length; t++) {
                var o = n[t];
                e[o] = _(r[o])
            }
            return e
        }(t))
    }
    function $(r, e) {
        for (var t = 0; t < r.childNodes.length; ) {
            var n = r.childNodes[t];
            if (1 === n.nodeType && X(n) === e)
                return n;
            t++
        }
    }
    function B(r, e) {
        for (var t = [], n = 0; n < r.childNodes.length; ) {
            var o = r.childNodes[n];
            1 === o.nodeType && X(o) === e && t.push(o),
            n++
        }
        return t
    }
    function L(r, e, t) {
        for (var n = 0; n < r.childNodes.length; ) {
            var o = r.childNodes[n];
            e ? 1 === o.nodeType && X(o) === e && t(o, n) : t(o, n),
            n++
        }
    }
    var V = /.+\:/;
    function X(r) {
        return r.tagName.replace(V, "")
    }
    function q(r) {
        if (1 !== r.nodeType)
            return r.textContent;
        for (var e = "<" + X(r), t = 0; t < r.attributes.length; )
            e += " " + r.attributes[t].name + '="' + r.attributes[t].value + '"',
            t++;
        e += ">";
        for (var n = 0; n < r.childNodes.length; )
            e += q(r.childNodes[n]),
            n++;
        return e += "</" + X(r) + ">"
    }
    function z(r) {
        var e, t, n = r.documentElement;
        return e = function(r) {
            var e = $(r, "t");
            if (e)
                return e.textContent;
            var t = "";
            return L(r, "r", (function(r) {
                t += $(r, "t").textContent
            }
            )),
            t
        }
        ,
        t = [],
        L(n, "si", (function(r, n) {
            t.push(e(r, n))
        }
        )),
        t
    }
    function G(r, e) {
        var t = e.createDocument(r)
          , n = {}
          , o = $(t.documentElement, "workbookPr");
        o && "1" === o.getAttribute("date1904") && (n.epoch1904 = !0),
        n.sheets = [];
        return function(r) {
            return B($(r.documentElement, "sheets"), "sheet")
        }(t).forEach((function(r) {
            r.getAttribute("name") && n.sheets.push({
                id: r.getAttribute("sheetId"),
                name: r.getAttribute("name"),
                relationId: r.getAttribute("r:id")
            })
        }
        )),
        n
    }
    function Y(r, e) {
        var t = e.createDocument(r)
          , n = {
            sheets: {},
            sharedStrings: void 0,
            styles: void 0
        };
        return function(r) {
            return B(r.documentElement, "Relationship")
        }(t).forEach((function(r) {
            var e = r.getAttribute("Target");
            switch (r.getAttribute("Type")) {
            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles":
                n.styles = W(e);
                break;
            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings":
                n.sharedStrings = W(e);
                break;
            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet":
                n.sheets[r.getAttribute("Id")] = W(e)
            }
        }
        )),
        n
    }
    function W(r) {
        return "/" === r[0] ? r.slice(1) : "xl/" + r
    }
    function H(r) {
        return H = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
            return typeof r
        }
        : function(r) {
            return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r
        }
        ,
        H(r)
    }
    function J(r, e) {
        var t = Object.keys(r);
        if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(r);
            e && (n = n.filter((function(e) {
                return Object.getOwnPropertyDescriptor(r, e).enumerable
            }
            ))),
            t.push.apply(t, n)
        }
        return t
    }
    function K(r) {
        for (var e = 1; e < arguments.length; e++) {
            var t = null != arguments[e] ? arguments[e] : {};
            e % 2 ? J(Object(t), !0).forEach((function(e) {
                Q(r, e, t[e])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(t)) : J(Object(t)).forEach((function(e) {
                Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(t, e))
            }
            ))
        }
        return r
    }
    function Q(r, e, t) {
        return (e = function(r) {
            var e = function(r, e) {
                if ("object" !== H(r) || null === r)
                    return r;
                var t = r[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var n = t.call(r, e || "default");
                    if ("object" !== H(n))
                        return n;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === e ? String : Number)(r)
            }(r, "string");
            return "symbol" === H(e) ? e : String(e)
        }(e))in r ? Object.defineProperty(r, e, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : r[e] = t,
        r
    }
    function Z(r, e) {
        if (!r)
            return {};
        var t, n, o = e.createDocument(r), i = (t = o,
        n = $(t.documentElement, "cellStyleXfs"),
        n ? B(n, "xf") : []).map(er), u = function(r) {
            var e = $(r.documentElement, "numFmts");
            return e ? B(e, "numFmt") : []
        }(o).map(rr).reduce((function(r, e) {
            return r[e.id] = e,
            r
        }
        ), []);
        return function(r) {
            var e = $(r.documentElement, "cellXfs");
            return e ? B(e, "xf") : []
        }(o).map((function(r) {
            return r.hasAttribute("xfId") ? K(K({}, i[r.xfId]), er(r, u)) : er(r, u)
        }
        ))
    }
    function rr(r) {
        return {
            id: r.getAttribute("numFmtId"),
            template: r.getAttribute("formatCode")
        }
    }
    function er(r, e) {
        var t = {};
        if (r.hasAttribute("numFmtId")) {
            var n = r.getAttribute("numFmtId");
            e[n] ? t.numberFormat = e[n] : t.numberFormat = {
                id: n
            }
        }
        return t
    }
    function tr(r, e) {
        e && e.epoch1904 && (r += 1462);
        return new Date(Math.round(24 * (r - 25569) * 36e5))
    }
    function nr(r, e) {
        var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (t)
            return (t = t.call(r)).next.bind(t);
        if (Array.isArray(r) || (t = function(r, e) {
            if (!r)
                return;
            if ("string" == typeof r)
                return or(r, e);
            var t = Object.prototype.toString.call(r).slice(8, -1);
            "Object" === t && r.constructor && (t = r.constructor.name);
            if ("Map" === t || "Set" === t)
                return Array.from(r);
            if ("Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
                return or(r, e)
        }(r)) || e && r && "number" == typeof r.length) {
            t && (r = t);
            var n = 0;
            return function() {
                return n >= r.length ? {
                    done: !0
                } : {
                    done: !1,
                    value: r[n++]
                }
            }
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }
    function or(r, e) {
        (null == e || e > r.length) && (e = r.length);
        for (var t = 0, n = new Array(e); t < e; t++)
            n[t] = r[t];
        return n
    }
    function ir(r, e, t) {
        if (r) {
            var n = e[r];
            if (!n)
                throw new Error("Cell style not found: ".concat(r));
            if (!n.numberFormat)
                return !1;
            if (ur.indexOf(Number(n.numberFormat.id)) >= 0 || t.dateFormat && n.numberFormat.template === t.dateFormat || !1 !== t.smartDateParser && n.numberFormat.template && function(r) {
                for (var e, t = nr((r = (r = (r = r.toLowerCase()).replace(ar, "")).replace(fr, "")).split(/\W+/)); !(e = t()).done; ) {
                    var n = e.value;
                    if (lr.indexOf(n) < 0)
                        return !1
                }
                return !0
            }(n.numberFormat.template))
                return !0
        }
    }
    var ur = [14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 30, 36, 45, 46, 47, 50, 57]
      , ar = /^\[\$-414\]/
      , fr = /;@$/;
    var lr = ["ss", "mm", "h", "hh", "am", "pm", "d", "dd", "m", "mm", "mmm", "mmmm", "yy", "yyyy", "e"];
    function cr(r, e, t) {
        var n = t.getInlineStringValue
          , o = t.getInlineStringXml
          , i = t.getStyleId
          , u = t.styles
          , a = t.values
          , f = t.properties
          , l = t.options;
        switch (e || (e = "n"),
        e) {
        case "str":
            r = sr(r, l);
            break;
        case "inlineStr":
            if (void 0 === (r = n()))
                throw new Error('Unsupported "inline string" cell value structure: '.concat(o()));
            r = sr(r, l);
            break;
        case "s":
            var c = Number(r);
            if (isNaN(c))
                throw new Error('Invalid "shared" string index: '.concat(r));
            if (c >= a.length)
                throw new Error('An out-of-bounds "shared" string index: '.concat(r));
            r = sr(r = a[c], l);
            break;
        case "b":
            if ("1" === r)
                r = !0;
            else {
                if ("0" !== r)
                    throw new Error('Unsupported "boolean" cell value: '.concat(r));
                r = !1
            }
            break;
        case "z":
            r = void 0;
            break;
        case "e":
            r = function(r) {
                switch (r) {
                case 0:
                    return "#NULL!";
                case 7:
                    return "#DIV/0!";
                case 15:
                    return "#VALUE!";
                case 23:
                    return "#REF!";
                case 29:
                    return "#NAME?";
                case 36:
                    return "#NUM!";
                case 42:
                    return "#N/A";
                case 43:
                    return "#GETTING_DATA";
                default:
                    return "#ERROR_".concat(r)
                }
            }(r);
            break;
        case "d":
            if (void 0 === r)
                break;
            var s = new Date(r);
            if (isNaN(s.valueOf()))
                throw new Error('Unsupported "date" cell value: '.concat(r));
            r = s;
            break;
        case "n":
            if (void 0 === r)
                break;
            r = ir(i(), u, l) ? tr(r = pr(r), f) : (l.parseNumber || pr)(r);
            break;
        default:
            throw new TypeError("Cell type not supported: ".concat(e))
        }
        return void 0 === r && (r = null),
        r
    }
    function sr(r, e) {
        return !1 !== e.trim && (r = r.trim()),
        "" === r && (r = void 0),
        r
    }
    function pr(r) {
        var e = Number(r);
        if (isNaN(e))
            throw new Error('Invalid "numeric" cell value: '.concat(r));
        return e
    }
    var yr = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    function mr(r) {
        for (var e = 0, t = 0; t < r.length; )
            e *= 26,
            e += yr.indexOf(r[t]),
            t++;
        return e
    }
    function br(r) {
        return r = r.split(/(\d+)/),
        [parseInt(r[1]), mr(r[0].trim())]
    }
    function vr(r, e, t, n, o, i, u) {
        var a, f = br(r.getAttribute("r")), l = function(r, e) {
            return $(e, "v")
        }(0, r), c = l && l.textContent;
        return r.hasAttribute("t") && (a = r.getAttribute("t")),
        {
            row: f[0],
            column: f[1],
            value: cr(c, a, {
                getInlineStringValue: function() {
                    return function(r, e) {
                        if (e.firstChild && "is" === X(e.firstChild) && e.firstChild.firstChild && "t" === X(e.firstChild.firstChild))
                            return e.firstChild.firstChild.textContent
                    }(0, r)
                },
                getInlineStringXml: function() {
                    return q(r)
                },
                getStyleId: function() {
                    return r.getAttribute("s")
                },
                styles: o,
                values: n,
                properties: i,
                options: u
            })
        }
    }
    function dr(r, e, t, n, o, i) {
        var u = function(r) {
            var e = $(r.documentElement, "sheetData")
              , t = [];
            return L(e, "row", (function(r) {
                L(r, "c", (function(r) {
                    t.push(r)
                }
                ))
            }
            )),
            t
        }(r);
        return 0 === u.length ? [] : u.map((function(r) {
            return vr(r, 0, 0, t, n, o, i)
        }
        ))
    }
    function hr(r, e) {
        return function(r) {
            if (Array.isArray(r))
                return r
        }(r) || function(r, e) {
            var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
            if (null != t) {
                var n, o, i, u, a = [], f = !0, l = !1;
                try {
                    if (i = (t = t.call(r)).next,
                    0 === e) {
                        if (Object(t) !== t)
                            return;
                        f = !1
                    } else
                        for (; !(f = (n = i.call(t)).done) && (a.push(n.value),
                        a.length !== e); f = !0)
                            ;
                } catch (r) {
                    l = !0,
                    o = r
                } finally {
                    try {
                        if (!f && null != t.return && (u = t.return(),
                        Object(u) !== u))
                            return
                    } finally {
                        if (l)
                            throw o
                    }
                }
                return a
            }
        }(r, e) || function(r, e) {
            if (!r)
                return;
            if ("string" == typeof r)
                return gr(r, e);
            var t = Object.prototype.toString.call(r).slice(8, -1);
            "Object" === t && r.constructor && (t = r.constructor.name);
            if ("Map" === t || "Set" === t)
                return Array.from(r);
            if ("Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
                return gr(r, e)
        }(r, e) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function gr(r, e) {
        (null == e || e > r.length) && (e = r.length);
        for (var t = 0, n = new Array(e); t < e; t++)
            n[t] = r[t];
        return n
    }
    function wr(r) {
        var e = function(r) {
            var e = $(r.documentElement, "dimension");
            if (e)
                return e.getAttribute("ref")
        }(r);
        if (e)
            return 1 === (e = e.split(":").map(br).map((function(r) {
                var e = hr(r, 2);
                return {
                    row: e[0],
                    column: e[1]
                }
            }
            ))).length && (e = [e[0], e[0]]),
            e
    }
    function Or(r, e) {
        var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (t)
            return (t = t.call(r)).next.bind(t);
        if (Array.isArray(r) || (t = function(r, e) {
            if (!r)
                return;
            if ("string" == typeof r)
                return Sr(r, e);
            var t = Object.prototype.toString.call(r).slice(8, -1);
            "Object" === t && r.constructor && (t = r.constructor.name);
            if ("Map" === t || "Set" === t)
                return Array.from(r);
            if ("Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
                return Sr(r, e)
        }(r)) || e && r && "number" == typeof r.length) {
            t && (r = t);
            var n = 0;
            return function() {
                return n >= r.length ? {
                    done: !0
                } : {
                    done: !1,
                    value: r[n++]
                }
            }
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }
    function Sr(r, e) {
        (null == e || e > r.length) && (e = r.length);
        for (var t = 0, n = new Array(e); t < e; t++)
            n[t] = r[t];
        return n
    }
    function jr(r, e) {
        var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (t)
            return (t = t.call(r)).next.bind(t);
        if (Array.isArray(r) || (t = function(r, e) {
            if (!r)
                return;
            if ("string" == typeof r)
                return Ar(r, e);
            var t = Object.prototype.toString.call(r).slice(8, -1);
            "Object" === t && r.constructor && (t = r.constructor.name);
            if ("Map" === t || "Set" === t)
                return Array.from(r);
            if ("Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
                return Ar(r, e)
        }(r)) || e && r && "number" == typeof r.length) {
            t && (r = t);
            var n = 0;
            return function() {
                return n >= r.length ? {
                    done: !0
                } : {
                    done: !1,
                    value: r[n++]
                }
            }
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }
    function Ar(r, e) {
        (null == e || e > r.length) && (e = r.length);
        for (var t = 0, n = new Array(e); t < e; t++)
            n[t] = r[t];
        return n
    }
    function Er(r, e) {
        return function(r) {
            if (Array.isArray(r))
                return r
        }(r) || function(r, e) {
            var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
            if (null != t) {
                var n, o, i, u, a = [], f = !0, l = !1;
                try {
                    if (i = (t = t.call(r)).next,
                    0 === e) {
                        if (Object(t) !== t)
                            return;
                        f = !1
                    } else
                        for (; !(f = (n = i.call(t)).done) && (a.push(n.value),
                        a.length !== e); f = !0)
                            ;
                } catch (r) {
                    l = !0,
                    o = r
                } finally {
                    try {
                        if (!f && null != t.return && (u = t.return(),
                        Object(u) !== u))
                            return
                    } finally {
                        if (l)
                            throw o
                    }
                }
                return a
            }
        }(r, e) || Pr(r, e) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function Pr(r, e) {
        if (r) {
            if ("string" == typeof r)
                return xr(r, e);
            var t = Object.prototype.toString.call(r).slice(8, -1);
            return "Object" === t && r.constructor && (t = r.constructor.name),
            "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? xr(r, e) : void 0
        }
    }
    function xr(r, e) {
        (null == e || e > r.length) && (e = r.length);
        for (var t = 0, n = new Array(e); t < e; t++)
            n[t] = r[t];
        return n
    }
    function Ir(r, e) {
        var t = r.dimensions
          , n = r.cells;
        if (0 === n.length)
            return [];
        var o = Er(t, 2);
        o[0];
        for (var i = o[1], u = i.column, a = i.row, f = new Array(a), l = 0; l < a; ) {
            f[l] = new Array(u);
            for (var c = 0; c < u; )
                f[l][c] = null,
                c++;
            l++
        }
        for (var s, p = function(r, e) {
            var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
            if (t)
                return (t = t.call(r)).next.bind(t);
            if (Array.isArray(r) || (t = Pr(r)) || e && r && "number" == typeof r.length) {
                t && (r = t);
                var n = 0;
                return function() {
                    return n >= r.length ? {
                        done: !0
                    } : {
                        done: !1,
                        value: r[n++]
                    }
                }
            }
            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }(n); !(s = p()).done; ) {
            var y = s.value
              , m = y.row - 1
              , b = y.column - 1;
            b < u && m < a && (f[m][b] = y.value)
        }
        var v = e.rowMap;
        if (v)
            for (var d = 0; d < f.length; )
                v[d] = d,
                d++;
        return f = function(r) {
            for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, t = e.rowMap, n = e.accessor, o = void 0 === n ? function(r) {
                return r
            }
            : n, i = e.onlyTrimAtTheEnd, u = r.length - 1; u >= 0; ) {
                for (var a, f = !0, l = Or(r[u]); !(a = l()).done; )
                    if (null !== o(a.value)) {
                        f = !1;
                        break
                    }
                if (f)
                    r.splice(u, 1),
                    t && t.splice(u, 1);
                else if (i)
                    break;
                u--
            }
            return r
        }(function(r) {
            for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, t = e.accessor, n = void 0 === t ? function(r) {
                return r
            }
            : t, o = e.onlyTrimAtTheEnd, i = r[0].length - 1; i >= 0; ) {
                for (var u, a = !0, f = jr(r); !(u = f()).done; )
                    if (null !== n(u.value[i])) {
                        a = !1;
                        break
                    }
                if (a)
                    for (var l = 0; l < r.length; )
                        r[l].splice(i, 1),
                        l++;
                else if (o)
                    break;
                i--
            }
            return r
        }(f, {
            onlyTrimAtTheEnd: !0
        }), {
            onlyTrimAtTheEnd: !0,
            rowMap: v
        }),
        e.transformData && (f = e.transformData(f)),
        f
    }
    function Tr(r) {
        return Tr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
            return typeof r
        }
        : function(r) {
            return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r
        }
        ,
        Tr(r)
    }
    function kr(r, e) {
        var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (t)
            return (t = t.call(r)).next.bind(t);
        if (Array.isArray(r) || (t = function(r, e) {
            if (!r)
                return;
            if ("string" == typeof r)
                return Nr(r, e);
            var t = Object.prototype.toString.call(r).slice(8, -1);
            "Object" === t && r.constructor && (t = r.constructor.name);
            if ("Map" === t || "Set" === t)
                return Array.from(r);
            if ("Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
                return Nr(r, e)
        }(r)) || e && r && "number" == typeof r.length) {
            t && (r = t);
            var n = 0;
            return function() {
                return n >= r.length ? {
                    done: !0
                } : {
                    done: !1,
                    value: r[n++]
                }
            }
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }
    function Nr(r, e) {
        (null == e || e > r.length) && (e = r.length);
        for (var t = 0, n = new Array(e); t < e; t++)
            n[t] = r[t];
        return n
    }
    function Dr(r, e) {
        var t = Object.keys(r);
        if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(r);
            e && (n = n.filter((function(e) {
                return Object.getOwnPropertyDescriptor(r, e).enumerable
            }
            ))),
            t.push.apply(t, n)
        }
        return t
    }
    function Cr(r, e, t) {
        return (e = function(r) {
            var e = function(r, e) {
                if ("object" !== Tr(r) || null === r)
                    return r;
                var t = r[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var n = t.call(r, e || "default");
                    if ("object" !== Tr(n))
                        return n;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === e ? String : Number)(r)
            }(r, "string");
            return "symbol" === Tr(e) ? e : String(e)
        }(e))in r ? Object.defineProperty(r, e, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : r[e] = t,
        r
    }
    function _r(r, e) {
        var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        t.sheet || (t = function(r) {
            for (var e = 1; e < arguments.length; e++) {
                var t = null != arguments[e] ? arguments[e] : {};
                e % 2 ? Dr(Object(t), !0).forEach((function(e) {
                    Cr(r, e, t[e])
                }
                )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(t)) : Dr(Object(t)).forEach((function(e) {
                    Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(t, e))
                }
                ))
            }
            return r
        }({
            sheet: 1
        }, t));
        var n = function(e) {
            if (!r[e])
                throw new Error('"'.concat(e, '" file not found inside the *.xlsx file zip archive'));
            return r[e]
        }
          , o = Y(n("xl/_rels/workbook.xml.rels"), e)
          , i = o.sharedStrings ? function(r, e) {
            return r ? z(e.createDocument(r)) : []
        }(n(o.sharedStrings), e) : []
          , u = o.styles ? Z(n(o.styles), e) : {}
          , a = G(n("xl/workbook.xml"), e);
        if (t.getSheets)
            return a.sheets.map((function(r) {
                return {
                    name: r.name
                }
            }
            ));
        var f = function(r, e) {
            if ("number" == typeof r) {
                var t = e[r - 1];
                return t && t.relationId
            }
            for (var n, o = kr(e); !(n = o()).done; ) {
                var i = n.value;
                if (i.name === r)
                    return i.relationId
            }
        }(t.sheet, a.sheets);
        if (!f || !o.sheets[f])
            throw function(r, e) {
                var t = e && e.map((function(r, e) {
                    return '"'.concat(r.name, '" (#').concat(e + 1, ")")
                }
                )).join(", ");
                return new Error("Sheet ".concat("number" == typeof r ? "#" + r : '"' + r + '"', " not found in the *.xlsx file.").concat(e ? " Available sheets: " + t + "." : ""))
            }(t.sheet, a.sheets);
        var l = function(r, e, t, n, o, i) {
            var u = e.createDocument(r)
              , a = dr(u, 0, t, n, o, i)
              , f = wr(u) || function(r) {
                var e = function(r, e) {
                    return r - e
                }
                  , t = r.map((function(r) {
                    return r.row
                }
                )).sort(e)
                  , n = r.map((function(r) {
                    return r.column
                }
                )).sort(e)
                  , o = t[0]
                  , i = t[t.length - 1];
                return [{
                    row: o,
                    column: n[0]
                }, {
                    row: i,
                    column: n[n.length - 1]
                }]
            }(a);
            return {
                cells: a,
                dimensions: f
            }
        }(n(o.sheets[f]), e, i, u, a, t)
          , c = Ir(l, t);
        return t.properties ? {
            data: c,
            properties: a
        } : c
    }
    function Fr(r) {
        return Fr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
            return typeof r
        }
        : function(r) {
            return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r
        }
        ,
        Fr(r)
    }
    function Mr(r, e) {
        for (var t = 0; t < e.length; t++) {
            var n = e[t];
            n.enumerable = n.enumerable || !1,
            n.configurable = !0,
            "value"in n && (n.writable = !0),
            Object.defineProperty(r, (o = n.key,
            i = void 0,
            i = function(r, e) {
                if ("object" !== Fr(r) || null === r)
                    return r;
                var t = r[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var n = t.call(r, e || "default");
                    if ("object" !== Fr(n))
                        return n;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === e ? String : Number)(r)
            }(o, "string"),
            "symbol" === Fr(i) ? i : String(i)), n)
        }
        var o, i
    }
    function Ur(r) {
        var e = Br();
        return function() {
            var t, n = Vr(r);
            if (e) {
                var o = Vr(this).constructor;
                t = Reflect.construct(n, arguments, o)
            } else
                t = n.apply(this, arguments);
            return function(r, e) {
                if (e && ("object" === Fr(e) || "function" == typeof e))
                    return e;
                if (void 0 !== e)
                    throw new TypeError("Derived constructors may only return object or undefined");
                return function(r) {
                    if (void 0 === r)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return r
                }(r)
            }(this, t)
        }
    }
    function Rr(r) {
        var e = "function" == typeof Map ? new Map : void 0;
        return Rr = function(r) {
            if (null === r || (t = r,
            -1 === Function.toString.call(t).indexOf("[native code]")))
                return r;
            var t;
            if ("function" != typeof r)
                throw new TypeError("Super expression must either be null or a function");
            if (void 0 !== e) {
                if (e.has(r))
                    return e.get(r);
                e.set(r, n)
            }
            function n() {
                return $r(r, arguments, Vr(this).constructor)
            }
            return n.prototype = Object.create(r.prototype, {
                constructor: {
                    value: n,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }),
            Lr(n, r)
        }
        ,
        Rr(r)
    }
    function $r(r, e, t) {
        return $r = Br() ? Reflect.construct.bind() : function(r, e, t) {
            var n = [null];
            n.push.apply(n, e);
            var o = new (Function.bind.apply(r, n));
            return t && Lr(o, t.prototype),
            o
        }
        ,
        $r.apply(null, arguments)
    }
    function Br() {
        if ("undefined" == typeof Reflect || !Reflect.construct)
            return !1;
        if (Reflect.construct.sham)
            return !1;
        if ("function" == typeof Proxy)
            return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}
            ))),
            !0
        } catch (r) {
            return !1
        }
    }
    function Lr(r, e) {
        return Lr = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, e) {
            return r.__proto__ = e,
            r
        }
        ,
        Lr(r, e)
    }
    function Vr(r) {
        return Vr = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
            return r.__proto__ || Object.getPrototypeOf(r)
        }
        ,
        Vr(r)
    }
    var Xr = function(r) {
        !function(r, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            r.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: r,
                    writable: !0,
                    configurable: !0
                }
            }),
            Object.defineProperty(r, "prototype", {
                writable: !1
            }),
            e && Lr(r, e)
        }(i, r);
        var e, t, n, o = Ur(i);
        function i(r) {
            var e;
            return function(r, e) {
                if (!(r instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, i),
            (e = o.call(this, "invalid")).reason = r,
            e
        }
        return e = i,
        t && Mr(e.prototype, t),
        n && Mr(e, n),
        Object.defineProperty(e, "prototype", {
            writable: !1
        }),
        e
    }(Rr(Error));
    function qr(r) {
        if ("string" == typeof r) {
            var e = r;
            if (r = Number(r),
            String(r) !== e)
                throw new Xr("not_a_number")
        }
        if ("number" != typeof r)
            throw new Xr("not_a_number");
        if (isNaN(r))
            throw new Xr("invalid_number");
        if (!isFinite(r))
            throw new Xr("out_of_bounds");
        return r
    }
    function zr(r) {
        if ("string" == typeof r)
            return r;
        if ("number" == typeof r) {
            if (isNaN(r))
                throw new Xr("invalid_number");
            if (!isFinite(r))
                throw new Xr("out_of_bounds");
            return String(r)
        }
        throw new Xr("not_a_string")
    }
    function Gr(r) {
        if ("boolean" == typeof r)
            return r;
        throw new Xr("not_a_boolean")
    }
    function Yr(r, e) {
        return function(r) {
            if (Array.isArray(r))
                return r
        }(r) || function(r, e) {
            var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
            if (null != t) {
                var n, o, i, u, a = [], f = !0, l = !1;
                try {
                    if (i = (t = t.call(r)).next,
                    0 === e) {
                        if (Object(t) !== t)
                            return;
                        f = !1
                    } else
                        for (; !(f = (n = i.call(t)).done) && (a.push(n.value),
                        a.length !== e); f = !0)
                            ;
                } catch (r) {
                    l = !0,
                    o = r
                } finally {
                    try {
                        if (!f && null != t.return && (u = t.return(),
                        Object(u) !== u))
                            return
                    } finally {
                        if (l)
                            throw o
                    }
                }
                return a
            }
        }(r, e) || Hr(r, e) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function Wr(r) {
        return Wr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
            return typeof r
        }
        : function(r) {
            return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r
        }
        ,
        Wr(r)
    }
    function Hr(r, e) {
        if (r) {
            if ("string" == typeof r)
                return Jr(r, e);
            var t = Object.prototype.toString.call(r).slice(8, -1);
            return "Object" === t && r.constructor && (t = r.constructor.name),
            "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Jr(r, e) : void 0
        }
    }
    function Jr(r, e) {
        (null == e || e > r.length) && (e = r.length);
        for (var t = 0, n = new Array(e); t < e; t++)
            n[t] = r[t];
        return n
    }
    function Kr(r, e) {
        var t = Object.keys(r);
        if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(r);
            e && (n = n.filter((function(e) {
                return Object.getOwnPropertyDescriptor(r, e).enumerable
            }
            ))),
            t.push.apply(t, n)
        }
        return t
    }
    function Qr(r) {
        for (var e = 1; e < arguments.length; e++) {
            var t = null != arguments[e] ? arguments[e] : {};
            e % 2 ? Kr(Object(t), !0).forEach((function(e) {
                Zr(r, e, t[e])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(t)) : Kr(Object(t)).forEach((function(e) {
                Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(t, e))
            }
            ))
        }
        return r
    }
    function Zr(r, e, t) {
        return (e = function(r) {
            var e = function(r, e) {
                if ("object" !== Wr(r) || null === r)
                    return r;
                var t = r[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var n = t.call(r, e || "default");
                    if ("object" !== Wr(n))
                        return n;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === e ? String : Number)(r)
            }(r, "string");
            return "symbol" === Wr(e) ? e : String(e)
        }(e))in r ? Object.defineProperty(r, e, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : r[e] = t,
        r
    }
    var re = {
        isColumnOriented: !1
    };
    function ee(r, e, t) {
        var n = t = t ? Qr(Qr({}, re), t) : re
          , o = n.isColumnOriented
          , i = n.rowMap
          , u = n.ignoreEmptyRows;
        !function(r) {
            for (var e = 0, t = Object.keys(r); e < t.length; e++) {
                var n = t[e];
                if (!r[n].prop)
                    throw new Error('"prop" not defined for schema entry "'.concat(n, '".'))
            }
        }(e),
        o && (r = ue(r));
        for (var a = r[0], f = [], l = [], c = 1; c < r.length; c++) {
            var s = te(e, r[c], c, a, l, t);
            null === s && !1 !== u || f.push(s)
        }
        if (i)
            for (var p, y = function(r, e) {
                var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
                if (t)
                    return (t = t.call(r)).next.bind(t);
                if (Array.isArray(r) || (t = Hr(r)) || e && r && "number" == typeof r.length) {
                    t && (r = t);
                    var n = 0;
                    return function() {
                        return n >= r.length ? {
                            done: !0
                        } : {
                            done: !1,
                            value: r[n++]
                        }
                    }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }(l); !(p = y()).done; ) {
                var m = p.value;
                m.row = i[m.row - 1] + 1
            }
        return {
            rows: f,
            errors: l
        }
    }
    function te(r, e, t, n, o, i) {
        for (var u = {}, a = !0, f = function(e) {
            var n = e.column
              , o = e.value
              , i = e.error
              , u = e.reason
              , a = {
                error: i,
                row: t + 1,
                column: n,
                value: o
            };
            return u && (a.reason = u),
            r[n].type && (a.type = r[n].type),
            a
        }, l = [], c = function() {
            var c, y, m, b = p[s], v = r[b], d = "object" === Wr(v.type) && !Array.isArray(v.type), h = e[n.indexOf(b)];
            if (void 0 === h && (h = null),
            d)
                c = te(v.type, e, t, n, o, i);
            else if (null === h)
                c = null;
            else if (Array.isArray(v.type)) {
                var g = !1
                  , w = function(r) {
                    var e = []
                      , t = 0;
                    for (; t < r.length; ) {
                        var n = Yr(ie(r, ",", t), 2)
                          , o = n[0];
                        t += n[1] + 1,
                        e.push(o.trim())
                    }
                    return e
                }(h).map((function(r) {
                    var e = ne(r, v, i);
                    return e.error && (c = r,
                    y = e.error,
                    m = e.reason),
                    null !== e.value && (g = !0),
                    e.value
                }
                ));
                y || (c = g ? w : null)
            } else {
                var O = ne(h, v, i);
                y = O.error,
                m = O.reason,
                c = y ? h : O.value
            }
            y || null !== c || ("function" == typeof v.required ? l.push({
                column: b
            }) : !0 === v.required && (y = "required")),
            y ? o.push(f({
                column: b,
                value: c,
                error: y,
                reason: m
            })) : (a && null !== c && (a = !1),
            (null !== c || i.includeNullValues) && (u[v.prop] = c))
        }, s = 0, p = Object.keys(r); s < p.length; s++)
            c();
        if (a)
            return null;
        for (var y = 0, m = l; y < m.length; y++) {
            var b = m[y].column;
            r[b].required(u) && o.push(f({
                column: b,
                value: null,
                error: "required"
            }))
        }
        return u
    }
    function ne(r, e, t) {
        if (null === r)
            return {
                value: null
            };
        var n;
        if (n = e.parse ? oe(r, e.parse) : e.type ? function(r, e, t) {
            switch (e) {
            case String:
                return oe(r, zr);
            case Number:
                return oe(r, qr);
            case Date:
                return oe(r, (function(r) {
                    return function(r, e) {
                        var t = e.properties;
                        if (r instanceof Date) {
                            if (isNaN(r.valueOf()))
                                throw new Xr("out_of_bounds");
                            return r
                        }
                        if ("number" == typeof r) {
                            if (isNaN(r))
                                throw new Xr("invalid_number");
                            if (!isFinite(r))
                                throw new Xr("out_of_bounds");
                            var n = tr(r, t);
                            if (isNaN(n.valueOf()))
                                throw new Xr("out_of_bounds");
                            return n
                        }
                        throw new Xr("not_a_date")
                    }(r, {
                        properties: t.properties
                    })
                }
                ));
            case Boolean:
                return oe(r, Gr);
            default:
                if ("function" == typeof e)
                    return oe(r, e);
                throw new Error("Unsupported schema type: ".concat(e && e.name || e))
            }
        }(r, Array.isArray(e.type) ? e.type[0] : e.type, t) : {
            value: r
        },
        n.error)
            return n;
        if (null !== n.value) {
            if (e.oneOf && e.oneOf.indexOf(n.value) < 0)
                return {
                    error: "invalid",
                    reason: "unknown"
                };
            if (e.validate)
                try {
                    e.validate(n.value)
                } catch (r) {
                    return {
                        error: r.message
                    }
                }
        }
        return n
    }
    function oe(r, e) {
        try {
            return void 0 === (r = e(r)) ? {
                value: null
            } : {
                value: r
            }
        } catch (r) {
            var t = {
                error: r.message
            };
            return r.reason && (t.reason = r.reason),
            t
        }
    }
    function ie(r, e, t) {
        for (var n = 0, o = ""; t + n < r.length; ) {
            var i = r[t + n];
            if (i === e)
                return [o, n];
            if ('"' === i) {
                var u = ie(r, '"', t + n + 1);
                o += u[0],
                n += 1 + u[1] + 1
            } else
                o += i,
                n++
        }
        return [o, n]
    }
    var ue = function(r) {
        return r[0].map((function(e, t) {
            return r.map((function(r) {
                return r[t]
            }
            ))
        }
        ))
    };
    function ae(r) {
        return ae = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
            return typeof r
        }
        : function(r) {
            return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r
        }
        ,
        ae(r)
    }
    function fe(r) {
        for (var e = {}, t = 0, n = Object.keys(r); t < n.length; t++) {
            var o = n[t]
              , i = r[o]
              , u = void 0;
            "object" === ae(i) && (i = Object.keys(r[o])[0],
            u = fe(r[o][i])),
            e[o] = {
                prop: i
            },
            u && (e[o].type = u)
        }
        return e
    }
    function le(r) {
        return le = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
            return typeof r
        }
        : function(r) {
            return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r
        }
        ,
        le(r)
    }
    var ce = ["schema", "map"];
    function se(r, e) {
        var t = Object.keys(r);
        if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(r);
            e && (n = n.filter((function(e) {
                return Object.getOwnPropertyDescriptor(r, e).enumerable
            }
            ))),
            t.push.apply(t, n)
        }
        return t
    }
    function pe(r) {
        for (var e = 1; e < arguments.length; e++) {
            var t = null != arguments[e] ? arguments[e] : {};
            e % 2 ? se(Object(t), !0).forEach((function(e) {
                ye(r, e, t[e])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(t)) : se(Object(t)).forEach((function(e) {
                Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(t, e))
            }
            ))
        }
        return r
    }
    function ye(r, e, t) {
        return (e = function(r) {
            var e = function(r, e) {
                if ("object" !== le(r) || null === r)
                    return r;
                var t = r[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var n = t.call(r, e || "default");
                    if ("object" !== le(n))
                        return n;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === e ? String : Number)(r)
            }(r, "string");
            return "symbol" === le(e) ? e : String(e)
        }(e))in r ? Object.defineProperty(r, e, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : r[e] = t,
        r
    }
    function me(r, e) {
        if (null == r)
            return {};
        var t, n, o = function(r, e) {
            if (null == r)
                return {};
            var t, n, o = {}, i = Object.keys(r);
            for (n = 0; n < i.length; n++)
                t = i[n],
                e.indexOf(t) >= 0 || (o[t] = r[t]);
            return o
        }(r, e);
        if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(r);
            for (n = 0; n < i.length; n++)
                t = i[n],
                e.indexOf(t) >= 0 || Object.prototype.propertyIsEnumerable.call(r, t) && (o[t] = r[t])
        }
        return o
    }
    function be(r, e, t) {
        var n = t.schema
          , o = t.map
          , i = me(t, ce);
        !n && o && (n = fe(o));
        var u = _r(r, e, pe(pe({}, i), {}, {
            properties: n || i.properties
        }));
        return n ? ee(u.data, n, pe(pe({}, i), {}, {
            properties: u.properties
        })) : u
    }
    return function(e) {
        var t, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return (t = e,
        t instanceof File || t instanceof Blob ? t.arrayBuffer().then(R) : R(t)).then((function(e) {
            return be(e, r, n)
        }
        ))
    }
}
));
//# sourceMappingURL=read-excel-file.min.js.map
