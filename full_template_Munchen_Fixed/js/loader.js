var ww = location.hostname;
ww = ww.replace("www.","");
ww = ww.replace(/-/g,""); //remove dashes since function can't have them
var _DemoURL = "https://s3.amazonaws.com/xxredda";
var v = new Date().getMilliseconds();
(function (n, t) {
	function u(n) {
		l[l.length] = n
	}
	function p(n) {
		h.className = h.className.replace(RegExp("\\b" + n + "\\b"), "")
	}
	function a(n, t) {
		for (var i = 0, r = n.length; i < r; i++)
			t.call(n, n[i], i)
	}
	function w() {
		var t,
		r,
		e;
		h.className = h.className.replace(/ (w-|eq-|gt-|gte-|lt-|lte-|portrait|no-portrait|landscape|no-landscape)\d+/g, ""),
		t = n.innerWidth || h.clientWidth,
		r = n.outerWidth || n.screen.width,
		f.screen.innerWidth = t,
		f.screen.outerWidth = r,
		u("w-" + t),
		a(i.screens, function (n) {
			t > n ? (i.screensCss.gt && u("gt-" + n), i.screensCss.gte && u("gte-" + n)) : t < n ? (i.screensCss.lt && u("lt-" + n), i.screensCss.lte && u("lte-" + n)) : t === n && (i.screensCss.lte && u("lte-" + n), i.screensCss.eq && u("e-q" + n), i.screensCss.gte && u("gte-" + n))
		}),
		r = n.innerHeight || h.clientHeight,
		e = n.outerHeight || n.screen.height,
		f.screen.innerHeight = r,
		f.screen.outerHeight = e,
		f.feature("portrait", r > t),
		f.feature("landscape", r < t)
	}
	function b() {
		n.clearTimeout(y),
		y = n.setTimeout(w, 100)
	}
	var v = n.document,
	e = n.navigator,
	g = n.location,
	h = v.documentElement,
	l = [],
	i = {
		screens : [240, 320, 480, 640, 768, 800, 1024, 1280, 1440, 1680, 1920],
		screensCss : {
			gt : !0,
			gte : !1,
			lt : !0,
			lte : !1,
			eq : !1
		},
		browsers : [{
				ie : {
					min : 6,
					max : 10
				}
			}
		],
		browserCss : {
			gt : !0,
			gte : !1,
			lt : !0,
			lte : !1,
			eq : !0
		},
		section : "-section",
		page : "-page",
		head : "head"
	},
	r,
	f,
	c,
	k,
	o,
	d,
	s,
	y;
	if (n.head_conf)
		for (r in n.head_conf)
			n.head_conf[r] !== t && (i[r] = n.head_conf[r]);
	f = n[i.head] = function () {
		f.ready.apply(null, arguments)
	},
	f.feature = function (n, t, i) {
		return n ? ("[object Function]" === Object.prototype.toString.call(t) && (t = t.call()), u((t ? "" : "no-") + n), f[n] = !!t, i || (p("no-" + n), p(n), f.feature()), f) : (h.className += " " + l.join(" "), l = [], f)
	},
	f.feature("js", !0),
	r = e.userAgent.toLowerCase(),
	e = /mobile|midp/.test(r),
	f.feature("mobile", e, !0),
	f.feature("desktop", !e, !0),
	r = /(chrome|firefox)[ \/]([\w.]+)/.exec(r) || /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(r) || /(android)(?:.*version)?[ \/]([\w.]+)/.exec(r) || /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(r) || /(msie) ([\w.]+)/.exec(r) || [],
	e = r[1],
	r = parseFloat(r[2]);
	switch (e) {
	case "msie":
		e = "ie",
		r = v.documentMode || r;
		break;
	case "firefox":
		e = "ff";
		break;
	case "ipod":
	case "ipad":
	case "iphone":
		e = "ios";
		break;
	case "webkit":
		e = "safari"
	}
	for (f.browser = {
			name : e,
			version : r
		}, f.browser[e] = !0, c = 0, k = i.browsers.length; c < k; c++)
		for (o in i.browsers[c])
			if (e === o)
				for (u(o), d = i.browsers[c][o].max, s = i.browsers[c][o].min; s <= d; s++)
					r > s ? (i.browserCss.gt && u("gt-" + o + s), i.browserCss.gte && u("gte-" + o + s)) : r < s ? (i.browserCss.lt && u("lt-" + o + s), i.browserCss.lte && u("lte-" + o + s)) : r === s && (i.browserCss.lte && u("lte-" + o + s), i.browserCss.eq && u("eq-" + o + s), i.browserCss.gte && u("gte-" + o + s));
			else
				u("no-" + o);
	"ie" === e && 9 > r && a("abbr article aside audio canvas details figcaption figure footer header hgroup mark meter nav output progress section summary time video".split(" "), function (n) {
		v.createElement(n)
	}),
	a(g.pathname.split("/"), function (n, r) {
		if (2 < this.length && this[r + 1] !== t)
			r && u(this.slice(1, r + 1).join("-").toLowerCase() + i.section);
		else {
			var f = n || "index",
			e = f.indexOf(".");
			0 < e && (f = f.substring(0, e)),
			h.id = f.toLowerCase() + i.page,
			r || u("root" + i.section)
		}
	}),
	f.screen = {
		height : n.screen.height,
		width : n.screen.width
	},
	w(),
	y = 0,
	n.addEventListener ? n.addEventListener("resize", b, !1) : n.attachEvent("onresize", b)
})(window), function (n, t) {
	function r(n) {
		var u = n.charAt(0).toUpperCase() + n.substr(1),
		n = (n + " " + h.join(u + " ") + u).split(" "),
		r;
		n : {
			for (r in n)
				if (i[n[r]] !== t) {
					r = !0;
					break n
				}
			r = !1
		}
		return !!r
	}
	var o = n.document.createElement("i"),
	i = o.style,
	s = " -o- -moz- -ms- -webkit- -khtml- ".split(" "),
	h = ["Webkit", "Moz", "O", "ms", "Khtml"],
	u = n[n.head_conf && n.head_conf.head || "head"],
	e = {
		gradient : function () {
			return i.cssText = ("background-image:" + s.join("gradient(linear,left top,right bottom,from(#9f9),to(#fff));background-image:") + s.join("linear-gradient(left top,#eee,#fff);background-image:")).slice(0, -17),
			!!i.backgroundImage
		},
		rgba : function () {
			return i.cssText = "background-color:rgba(0,0,0,0.5)",
			!!i.backgroundColor
		},
		opacity : function () {
			return "" === o.style.opacity
		},
		textshadow : function () {
			return "" === i.textShadow
		},
		multiplebgs : function () {
			return i.cssText = "background:url(//:),url(//:),red url(//:)",
			/(url\s*\(.*?){3}/.test(i.background)
		},
		boxshadow : function () {
			return r("boxShadow")
		},
		borderimage : function () {
			return r("borderImage")
		},
		borderradius : function () {
			return r("borderRadius")
		},
		cssreflections : function () {
			return r("boxReflect")
		},
		csstransforms : function () {
			return r("transform")
		},
		csstransitions : function () {
			return r("transition")
		},
		touch : function () {
			return "ontouchstart" in n
		},
		retina : function () {
			return 1 < n.devicePixelRatio
		},
		fontface : function () {
			var n = u.browser.version;
			switch (u.browser.name) {
			case "ie":
				return 9 <= n;
			case "chrome":
				return 13 <= n;
			case "ff":
				return 6 <= n;
			case "ios":
				return 5 <= n;
			case "android":
				return !1;
			case "webkit":
				return 5.1 <= n;
			case "opera":
				return 10 <= n;
			default:
				return !1
			}
		}
	},
	f;
	for (f in e)
		e[f] && u.feature(f, e[f].call(), !0);
	u.feature()
}
(window), function (n, t) {
	function l() {}

	function u(n, t) {
		if (n) {
			"object" == typeof n && (n = [].slice.call(n));
			for (var i = 0, r = n.length; i < r; i++)
				t.call(n, n[i], i)
		}
	}
	function k(n, i) {
		var r = Object.prototype.toString.call(i).slice(8, -1);
		return i !== t && null !== i && r === n
	}
	function s(n) {
		return k("Function", n)
	}
	function f(n) {
		n = n || l,
		n._done || (n(), n._done = 1)
	}
	function a(n) {
		var t = {},
		i;
		if ("object" == typeof n)
			for (i in n)
				n[i] && (t = {
						name : i,
						url : n[i]
					});
		else
			t = n.split("/"), t = t[t.length - 1], i = t.indexOf("?"), t = {
				name : -1 !== i ? t.substring(0, i) : t,
				url : n
			};
		return (n = w[t.name]) && n.url === t.url ? n : w[t.name] = t
	}
	function v(n) {
		var n = n || w,
		t;
		for (t in n)
			if (n.hasOwnProperty(t) && n[t].state !== b)
				return !1;
		return !0
	}
	function y(n, t) {
		t = t || l,
		n.state === b ? t() : n.state === ut ? i.ready(n.name, t) : n.state === rt ? n.onpreload.push(function () {
			y(n, t)
		}) : (n.state = ut, d(n, function () {
				n.state = b,
				t(),
				u(h[n.name], function (n) {
					f(n)
				}),
				o && v() && u(h.ALL, function (n) {
					f(n)
				})
			}))
	}
	function d(t, i) {
		var i = i || l,
		u,
		f;
		/\.css[^\.]*$/.test(t.url) ? (u = r.createElement("link"), u.type = "text/" + (t.type || "css"), u.rel = "stylesheet", u.href = t.url) : (u = r.createElement("script"), u.type = "text/" + (t.type || "javascript"), u.src = t.url),
		u.onload = u.onreadystatechange = function (t) {
			t = t || n.event,
			("load" === t.type || /loaded|complete/.test(u.readyState) && (!r.documentMode || 9 > r.documentMode)) && (u.onload = u.onreadystatechange = u.onerror = null, i())
		},
		u.onerror = function () {
			u.onload = u.onreadystatechange = u.onerror = null,
			i()
		},
		u.async = !1,
		u.defer = !1,
		f = r.head || r.getElementsByTagName("head")[0],
		f.insertBefore(u, f.lastChild)
	}
	function e() {
		r.body ? o || (o = !0, u(g, function (n) {
				f(n)
			})) : (n.clearTimeout(i.readyTimeout), i.readyTimeout = n.setTimeout(e, 50))
	}
	function p() {
		r.addEventListener ? (r.removeEventListener("DOMContentLoaded", p, !1), e()) : "complete" === r.readyState && (r.detachEvent("onreadystatechange", p), e())
	}
	var r = n.document,
	g = [],
	nt = [],
	h = {},
	w = {},
	ft = "async" in r.createElement("script") || "MozAppearance" in r.documentElement.style || n.opera,
	tt,
	o,
	it = n.head_conf && n.head_conf.head || "head",
	i = n[it] = n[it] || function () {
		i.ready.apply(null, arguments)
	},
	rt = 1,
	ut = 3,
	b = 4,
	c;
	if (i.load = ft ? function () {
		var t = arguments,
		n = t[t.length - 1],
		r = {};
		return s(n) || (n = null),
		u(t, function (i, u) {
			i !== n && (i = a(i), r[i.name] = i, y(i, n && u === t.length - 2 ? function () {
					v(r) && f(n)
				}
					 : null))
		}),
		i
	}
		 : function () {
		var n = arguments,
		r = [].slice.call(n, 1),
		f = r[0];
		return tt ? (f ? (u(r, function (n) {
					if (!s(n)) {
						var i = a(n);
						i.state === t && (i.state = rt, i.onpreload = [], d({
								url : i.url,
								type : "cache"
							}, function () {
								i.state = 2,
								u(i.onpreload, function (n) {
									n.call()
								})
							}))
					}
				}), y(a(n[0]), s(f) ? f : function () {
					i.load.apply(null, r)
				})) : y(a(n[0])), i) : (nt.push(function () {
				i.load.apply(null, n)
			}), i)
	}, i.js = i.load, i.test = function (n, t, r, u) {
		return n = "object" == typeof n ? n : {
			test : n,
			success : t ? k("Array", t) ? t : [t] : !1,
			failure : r ? k("Array", r) ? r : [r] : !1,
			callback : u || l
		},
		(t = !!n.test) && n.success ? (n.success.push(n.callback), i.load.apply(null, n.success)) : !t && n.failure ? (n.failure.push(n.callback), i.load.apply(null, n.failure)) : u(),
		i
	}, i.ready = function (n, t) {
		if (n === r)
			return o ? f(t)
				 : g.push(t), i;
			if (s(n) && (t = n, n = "ALL"), "string" != typeof n || !s(t))
				return i;
			var u = w[n];
			return u && u.state === b || "ALL" === n && v() && o ? (f(t), i) : ((u = h[n]) ? u.push(t) : h[n] = [t], i)
		}, i.ready(r, function () {
				v() && u(h.ALL, function (n) {
					f(n)
				}),
				i.feature && i.feature("domloaded", !0)
			}), "complete" === r.readyState)e();
	else if (r.addEventListener)
		r.addEventListener("DOMContentLoaded", p, !1), n.addEventListener("load", e, !1);
	else {
		r.attachEvent("onreadystatechange", p),
		n.attachEvent("onload", e),
		c = !1;
		try {
			c = null == n.frameElement && r.documentElement
		} catch (ot) {}

		c && c.doScroll && function et() {
			if (!o) {
				try {
					c.doScroll("left")
				} catch (t) {
					n.clearTimeout(i.readyTimeout),
					i.readyTimeout = n.setTimeout(et, 50);
					return
				}
				e()
			}
		}
		()
	}
	setTimeout(function () {
		tt = !0,
		u(nt, function (n) {
			n()
		})
	}, 300)
}
(window);
var v = new Date().getMilliseconds();
function loadaddrexx() {
	head.js(
	"https://s3.amazonaws.com/xxredda/" + ww + "/jquery.ui.theme.css",
	"https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js", 
	"https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js",
	"https://s3.amazonaws.com/xxredda/" + ww + "/var.js", 
	"https://s3.amazonaws.com/xxredda/" + ww + "/core.js"
	)
}
setTimeout("loadaddrexx()",1550);