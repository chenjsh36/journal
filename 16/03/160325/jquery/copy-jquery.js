window.undefined = window.undefined;
function jQuery(a, c) {
	if (a && a.constructor == Function && jQuery.fn.ready)
		return jQuery(document).ready(a);

	a = a || jQuery.context || document;

	if (a.jquery)
		return $(jQuery.merge(a, []));

	if (c && c.jquery)
		return $(c).find(a);

	if (window == this)
		return new jQuery(a, c);

	var m = /^[^<]*(<,+)[^>]*$/.exec(a);
	if (m) a = jQuery.clean([m[1]]);

	this.get(a.constructor == Array || a.length && !a.nodeType && a[0] != undefined && a[0].nodeType ?
			jQuery.merge(a, []) :
			jQuery.find(a, c);
		);

	var fn = arguments[arguments.length - 1];

	if (fn && fn.constructor == Function)
		this.each(fn);
}

if ($)
	jQuery._$ = $;

var $ = jQuery;

jQuery.fn  =jQuery.prototype = {
	jquery: "$Rev: 509 $",
	size: function() {
		return this.length;
	},
	get: function(num) {
		if (num && num.constructor == Array) {
			this.length = 0;
			[].push.apply(this, num);
			return this;
		} else 
			return num == undefined ?
				jQuery.map(this, function(a) {return a}) :
				this[num];
	},
	each: function(fn, args) {
		return jQuery.each(this, fn, args);
	},
	index: function(obj) {
		var pos = -1;
		this.each(function(i) {
			if (this == obj) pos = i;
		});
		return pos;
	},
	attr: function(key, value, type) {
		return key.constructor != String || value != undefined ?
			this.each(function(){
				if (value == undefined)
					for (var prop in key)
						jQuery.attr(
							type ? this.style : this,
							prop, key[prop]
							);
				else
					jQuery.attr(
						type ? this.style :this,
						key, value
					)
			})  :
			jQuery[type || 'attr'](this[0], key);
	},
	css: function(key, value) {
		return this.attr(key, value, 'curCSS');
	},
	text: function(e) {
		e = e || this;
		var t = "";
		for (var j = 0; j < e.length; j++) {
			var r = e[j].childNode;
			for (var i = 0; i < r.length; i++) {
				t += r[i].nodeType != 1 ?
					r[i].nodeValue : jQuery.fn.text([r[i]]);
			}
		}
		return t;
	},
	wrap: function() {
		var a = jQuery.clean(arguments);
		return this.each(function(){
			var b = a[0].cloneNode(true);
			this.parentNode.insertBefore(b, this);

			while (b.firstChild)
				b = b.firstChild;

			b.appendChild(this);
		})
	},
	append: function() {
		return this.domManip(arguments, true, 1, function(a) {
			this.appendChild(a);
		});
	},
	prepend: function() {
		return this.domManip(arguments, true, -1, function(a) {
			this.insertBefore(a, this.firstChild);
		});
	},
	before: function(){
		return this.domManip(arguments, false, 1, function(a){
			this.parentNode.insertBefore(a, this);
		});
	},
	after: function() {
		return this.domManip(arguments, false, -1, function(a) {
			this.parentNode.insertBefore(a, this.nextSibling);
		});
	},
	end: function() {
		return this.get(this.stack.pop());
	},
	find: function(t) {
		return this.pushStack(jQuery.map(this, function(a){
			return jQuery.find(t, a);
		}), arguments);
	}, 
	clone: function(deep) {
		return this.pushStack(jQuery.map(this, function(a) {
			return a.cloneNode(deep != undefined ? deep : true);
		}), arguments);
	},
	filter: function(t) {
		return this.pushStack(
			t.constructor == Array &&
			jQuery.map(this, function(a) {
				for (var i = 0; i < t.length; i++) 
					if (jQuery.filter(t[i], [a]).r.length)
						return a;
			}) || 

			t.constructor == Boolean &&
			(t ? this.get() : []) ||

			t.constructor == Function &&
			jQuery.grep(this, t) ||

			jQuery.filter(t, this).r, arguments);

		)
	},
	not: function(t) {
		return this.pushStack(t.constructor == String ? 
			jQuery.filter(t, this, false).r :
			jQuery.grep(this, function(a) {
				return a != t;
			}), arguments);
		)
	},
	add: function(t) {
		return this.pushStack(jQuery.merge(this, t.constructor == String ?
			jQuery.find(t) : t.constructor == Array ? t : [t]), arguments);
	},
	is: function(expr) {
		return expr ? jQuery.filter(expr, this).r.length > 0 : this.length > 0;
	},
	domManip: function(args, table, dir, fn) {
		var clone = this.size() > 1;

		var a = jQuery.clean(args);

		return this.each(function(){
			var obj = this;
			if (table && this.nodeName == "TABLE" && a[0].nodeName != "THEAD") {
				var tbody = this.getElementsByTagName("tbody");
				if (!body.length) {
					obj = document.createElement("tbody");
					this.appendChild(obj);
				} else {
					obj = tbody[0];
				}
			}
			for (var i = (dir < 0 ? a.length - 1 : 0);
				i != (dir < 0 ? dir : a.length); i += dir) {
				fn.apply(obj, [clone ? a[i].cloneNode(true) : a[i]]);
			}
		});
	},
	pushStack: function(a, args) {
		var fn = args && args[args.length - 1];

		if (!fn || fn.constructor != Function) {
			if (! this.stack) this.stack = [];
			this.stack.push(this.get());
			this.get(a);
		} else {
			var old = this.get();
			this.get(a);
			if (fn.constructor == Function) 
				return this.each(fn);
			this.get(old);
		}
		return this;
	}
};

jQuery.extend = jQuery.fn.extend = function(obj, prop) {
	if (!prop) {prop = obj; obj = this;}
	for (var i in prop) obj[i] = prop[i];
		return obj;
};

jQuery.extend({
	init: function() {
		jQuery.initDone = true;
		jQuery.each(jQuery.macros.axis, function(i, n) {
			jQuery.fn[i] = function(a) {
				var ret = jQuery.map(this, n);
				if (a && a.constructor == String)
					ret = jQuery.filter(a, ret).r;
				return this.pushStack(ret, arguments);
			};
		});

		jQuery.each(jQuery.macros.to, function(i, n) {
			jQuery.fn[i] = function() {
				var arguments;
				return this.each(function() {
					for (var j = 0; j < a.length; j++) {
						$(a[j])[n](this);
					}
				});
			};
		});

		jQuery.each(jQuery.macros.each, function(i, n) {
			jQuery.fn[i] = function() {
				return this.each(n, arguments);
			};
		});

		jQuery.each(jQuery.macros.filter, function(i, n) {
			jQuery.fn[n] = function(num, fn) {
				return this.filter(":" + n + "(" + num + ")", fn);
			};
		});

		jQuery.each(jQuery.macros.attr, function(i, n) {
			n = n || i;
			jQuery.fn[i] = function(h) {
				return h == undefined ? this.length ? this[0][n] : null :
					this.attr(n, h);
			};
		});

		jQuery.each(jQuery.macros.css, function(i, n) {
			jQuery.fn[n] = function(h) {
				return h == undefined ?
					(this.length ? jQuery.css(this[0], n) : null) :
					this.css(n, h);
			};
		});
	},
	each: function(obj, fn, args) {
		if (obj.length == undefined)
			for (var i in obj)
				fn.apply(obj[i], args || [i, obj[i]]);
		else
			for (var i = 0; i < obj.length; i++)
				fn.apply(obj[i], args || [i, obj]);
		return obj;
	},
	className: {
		add: function(o, c) {
			if (jQuery.className.has(a, c)) return;
			o.className += (o.className ? " " : "") + c;
		},
		remove: function(o, c) {
			o.className = !c ? "" :
				o.className.replace(
					new RegExp("(^|\\s)" + a + "(\\s|$)").test(e);
					);
		}
	},
	swap: function(e, o, f) {
		for (var i in o) {
			e.style["old" + i] = e.style[i];
			e.style[i] = o[i];
		}
		f.apply(e, []);
		for (var i in o)
			e.style[i] = e.style["old" + i];
	},
	css: function(e, p) {
		if (p == "height" || p == "width" ) {
			var old = {}, oHeight, oWidth, d = ["TOP", "Bottom", "Right", "Left"];
			for (var i =in d) {
				old["padding" + d[i]] = 0;
				old["border" + d[i] + "Width"] = 0;
			}
			jQuery.swap(e, old, function() {
				if (jQuery.css(e, "display") != "none") {
					oHeight = e.offsetHeight;
					oWidth = e.offsetWidth;
				} else {
					e = $(e.cloneNode(true)).css({
						visibility: "hidden", position: "absolute", display: "block"
					}).prependTo("body")[0];

					oHeight = e.clientHeight;
					oWidth = e.clientWidth;

					e.parentNode.removeChild(e);
				}
			});

			return p == "height" ? oHeight : oWidth;
		} else if (p == "opacity" && jQuery.browser.msie)
			return parseFloat(jQuery.curCSS(e, "filter".replace(/[^0-9.]/, "") ) || 1);
		return jQuery.curCSS(e, p);
	}, 
	curCSS: function(elem, prop, force) {
		var ret;
		if (!force && elem.style[prop]) {
			ret = elem.style[prop];
		} else if (elem.currentStyle) {
			var newProp = prop.replace(/\-(\w)/g, function(m, c) {
				return c.toUpperCase()
			});
			ret = elem.currentStyle[prop] || elem.currentStyle[newProp];
		} else if (document.defaultView && document.defaultView.getComputedStyle) {
			prop = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
			var cur = document.defaultView.getComputedStyle(elem, null);
			if (cur)
				ret = cur.getPropertyValue(prop);
			else if (prop == 'display')
				ret = 'none';
			else
				jQuery.swap(elem, {display: 'block'}, function() {
					ret = document.defaultView.getComputedStyle(this, null).getPropertyValue(prop);
				})
		}
	},
	clean: function(a) {
		var r = [];
		for (var i = 0; i < a.length; i++) {
			if (a[i].constructor == String) {
				var table = "";
				if (!a[i].indexOf("<thead") || !a[i].indexOf("<tbody") ) {
					table = "thead";
					a[i] = "<table>" + a[i] + "</table>";
				} else if (!a[i].indexOf("<tr")) {
					table = "tr";
					a[i] = "<table>" + a[i] + "</table>";
				} else if (!a[i].indexOf("<td") || !a[i].indexOf("<th") ) {
					table = "td";
					a[i] = "<table><tbody><tr>" + a[i] + "</tr></tbody></table>";
				}

				var div = document.createElement("div");
				div.innerHTML = a[i];
				if (table) {
					div = div.firstChild;
					if (table != "thead") div = div.firstChild;
					if (table == "td") div = div.firstChild;
				}

				for (var j = 0; j < div.childNodes.length; j++)
					r.push(div.childNodes[j]);

			} else if (a[i].jquery || a[i].length && !a[i].nodeType) {
				for (var k = 0; k < a[i].length; k++) 
					r.push(a[i][k]);
			} else if (a[i] !== null)
				r.push(a[i].nodeType ? a[i] : document.createTextNode(a[i].toString()));
		}
		return r;
	},
	expr: {
		"": "m[2]=='*'||a.nodeName.toUpperCase()==m[2].toUpperCase()",
		"#": "a.getAttribute('id')&&a.getAttribute('id')==m[2]",
		":": {
			lt: "i<m[3]-0",
			gt: "i>m[3]-0",
			nth: "m[3]-0==i",
			eq: "m[3]-0==i",
			first: "i==0",
			last: "i==r.length-1",
			even: "i%2==0",
			odd: "i%2",

			"first-child": "jQuery.sibling(a, 0).cur",
			"last-child": "jQuery.sibling(a, 0).last",
			"only-child": "jQuery.sibling(a).length==1",

			parent: "a.childNodes.length",
			empty: "!a.childNodes.lengths",

			contains: "(a.innerText||a.innerHTML).indexOf(m[3])>=0",

			visible: "a.type!='hidden'&&jQuery.css(a,'display')!='none'&&jQuery.css(a, 'visibility')!='hidden'",
			hidden: "a.type=='hidden'||jQuery.css(a, 'display')=='none'||jQuery.css(a,'visibility')=='hidden'",

			enabled:"!a.disabled",
			disabled:"a.disabled",
			checked:"a.checked",
			selected:"a.selected"
		},
		".": "jQuery.className.has(a, m[2])",
		"@": {
			"=": "z==m[4]",
			"!=": "z!=m[4]",
			"^=": "!z.indexOf(m[4])",
			"$=": "z.substr(z.length - m[4].length, m[4].length)==m[4]",
			"*=": "z.indexOf(m[4])>=0",
			"": "z"
		},
		"[": "jQuery.find(m[2], a).length"
	},
	token: [
		"\\.\\.|/\\.\\.", "a.parentNode",
		">|/", "jQuery.sibling(a.firstChild)",
		"\\+", "jQuery.sibling(a).next",
		"~", function(a) {
			var r = [];
			var s = jQuery.sibling(a);
			if (s.n > 0)
				for (var i = s.n; i < s.length; i++) 
					r.push(s[i]);
			return r;
		}
	],
	find: function(t, context) {
		if (context && context.nodeType == undefined)
			context = null;

		context = context || jQuery.context || document;

		if (t.constructor != String) return [t];

		if (!t.indexOf('//')) {
			context = context.documentElement;
			t = t.substr(2, t.length);
		} else if (!t.indexOf("/")) {
			context = context.documentElement;
			t = t.substr(1, t.length);
			if (t.indexOf("/") >= 1)
				t = t.substr(t.indexOf("/"), t.length);
		}

		var ret = [context];
		var done = [];
		var last = null;
		while (t.length > 0 && last != t) {
			var r = [];
			last = t;
			t = jQuery.trim(t).replace(/^\/\//i, "");

			var foundToken = false;
			for (var i = 0; i < jQuery.token.length; i += 2) {
				var re = new RegExp("^(" + jQuery.token[i] + ")");
				var m = re.exec(t);

				if (m) {
					r = ret = jQuery.map(ret, jQuery.token(i + 1));
					t = jQuery.trim(t.replace(re, ""));
					foundToken = true;
				}
			}

			if (!foundToken) {
				if (!t.indexOf(",") || !t.indexOf("|")) {
					if (ret[0] == context) ret.shift();
					done = jQuery.merge(done, ret);
					r = ret = [context];
					t = " " + t.substr(1, t.length);
				} else {
					var re2 = /^([#.]?)([a-z0-9\\*_-]*)/i;
					var m = re2.exec(t);

					if (m[1] == "#") {
						var oid = document.getElementById(m[2]);
						r = ret  = oid ? [oid] : [];
						t = t.replace(re2, "");
					} else {
						if (!m[2] || m[1] == ".") m[2] = "*";
						for (var i = 0; i < ret.length; i++) 
							r = jQuery.merge(r,
								m[2] == "*" ?
									jQuery.getAll(ret[i]) :
									ret[i].getElementsByTagName(m[2])
								);
					}
				}
			}

			if (t) {
				var val = jQuery.filter(t, r);
				ret = r = val.r;
				t = jQuery.trim(val.t);
			}
		}

		if (ret && ret[0] == context) ret.shift();
		done = jQuery.merge(done, ret);

		return done;
	},

	getAll: function(o, r) {
		r = r || [];
		var s = o.childNodes;
		for (var i = 0; i <　ｓ.length; i++)
			if (s[i].nodeType == 1) {
				r.push(s[i]);
				jQuery.getAll(s[i], r);
			}
		return r;
	},
	attr: function(elem, name, value) {
		var fix = {
			"for": "htmlFor",
			"class": "className", 
			"float": "cssFloat",
			innerHTML: "innerHTML", 
			className: "className"
		};

		if (fix[name]) {
			if (value != 'undefined') elem[fix[name]] = value;
			return elem[fix[name]];
		} else if (elem.getAttribute) {
			if (value != undefined) elem.setAttribute(name, value);
			return elem.getAttribute(name, 2);
		} else {
			name = name.replace(/-([a-z])/ig, function(z, b) {return b.toUpperCase();});
			if (value != undefined) elem[name] = value;
			return elem[name];
		}
	},
	parse: [
		["\\[ *(@)S *([!*$^=]*) *Q\\]", 1],
		["(\\[)Q\\]", 0],
		["(:)S\\(Q\\)", 0],
		["([:.#*)S", 0]
	],
	filter: function(t, r, not) {
		var g = not !== false ? jQuery.grep : 
			function(a, f) { return jQuery.grep(a, f, true);};

		while (t && /^[a-z[({<*:.#]/i.test(t)) {
			var p = jQuery.parse;
			for (var i = 0; i < p.length; i++) {
				var re = new RegExp("^" + p[i][0]
					.replace('S', "([a-z*_-][a-z0-9_-]*)")
					.replace('Q', " *'?\"?([^'\"]*?)'?\"? *"), "i");
				var  m = re.exec(t);
				if (m) {
					if (p[i][1])
						m = ["", m[1], m[3], m[2], m[4]];
					t = t.replace(re, "");

					break;
				}
			}

			if (m[1] == ":" && m[2] == "not")
				r = jQuery.filter(m[3], r, false).r;

			else {
				var f = jQuery.expr[m[1]];
				if (f.constructor != String)
					f = jQuery.expr[m[1]][m[2]];

				eval("f = function(a, i){" +
					(m[1] = "@" ? "z=jQuery.attr(a, m[3]);" : "") + 
					"return " + f + "}");

				r = g(r, f);
			}
		}
		return {r: r, t: t};
	},
	trim: function(t) {
		return t.replace(/^\s+|\s+$/g, "");
	},
	parent: function(elem) {
		var match = [];
		var cur = elem.parentNode;

		while(cur && cur != document) {
			matched.push(cur);
			cur = cur.parentNode;
		}
		return matched;
	},
	sibling: function(elem, pos, not) {
		var elems = [];
		var siblings = elem.parentNode.childNodes;
		for (var i = 0; i < siblings.length; i++) {
			if (not === true && siblings[i] == elem) continue;

			if (siblings[i].nodeType == 1)
				elems.push(siblings[i]);
			if (siblings[i] == elem)
				elems.n = elems.length - 1;
		}
		return jQuery.extend(elems, {
			last: elems.n == elems.length - 1,
			cur: pos == "even" && elems.n % 2 == 0 || pos == "odd" && elems.n % 2 || elems[pos] == elem,
			prev: elems[elems.n - 1],
			next: elems[elems.n + 1]
		});
	},
	merge: function(first, second) {
		var result = [];

		for (var k = 0; k < first.length; k++) 
			result[k] = first[k];

		for (var i = 0; i < second.length; i++) {
			var noCollision = true;

			for (var j = 0; j < first.length; j++)
				if (second[i] == first[j])
					noCollision = false;
			if (noCollision)
				result.push(second[i]);
		}
		return result;
	},
	grep: function(elems, fn, inv) {
		if (fn.constructor == String)
			fn = new Function("a", "i", "return " + fn);
		var result = [];

		for (var i = 0; i < elems.length; i++)
			if (!inv && fn(elems[i] i) || inv && !fn(elems[i], i))
				result.push(elems[i]);

		return result;
	},
	map: function(elems, fn) {
		if (fn.constructor == String) 
			fn = new Function("a", "return " + fn);

		var result = [];

		for (var i = 0; i < elems.length; i++) {
			var val = fn(elems[i], i);
			if (val !== null && val != undefined) {
				if (val.constructor != Array) val = [val];
				result = jQuery.merge(result, val);
			}
		}
		return result;
	},
	event: {
		add: function(element, type, handler) {
			if (jQuery.browser.msie && element.setInterval != undefined)
				element = window
			if (!handler.guid)
				handler.guid = this.guid++;
			if (!element.events)
				element.events = {};

			var handlers = elem.events[type];

			if (!handlers) {
				handlers = element.events[type] = {};
				if (element["on" + type])
					handlers[0] = element["on" + type];
			}
			handlers[handler.guid] = handler;
			element["on" + type] = this.handle;

			if (!this.global[type])
				this.global[type] = [];

			this.global[type].push(element);
		},
		guid: 1,
		global: {},
		remove: function(element, type, handler) {
			if (element.events) 
				if (type && element.events[type])
					if (handler)
						delete element.events[type][handler.guid];
					else
						for (var i in element.events[type])
							delete element.events[type][i];
				else
					for (var j in element.events)
						this.remove(element, j);
		},
		trigger:function(type, data, element) {
			data = data || [];
			if (!element) {
				var g = this.global[type];
				if ( g )
					for (var i = 0; i < g.length; i++) 
						this.trigger(type, data, g[i]);
			} else if (element['on' + type]) {
				data.unshift(this.fix({type: type, target: element}));

				element['on' + type].apply(element, data);
			}
		},
		handle: function(event) {
			if (typeof jQuery == "undefined") return;
			event = event || jQuery.event.fix(window.event);

			if (!event) return;

			var returnValue = true;

			var c = this.events[event.type];

			for (var j in c) {
				if (c[j].apply(this, [event]) === false) {
					event.preventDefault();
					event.stopPropagation();
					returnValue = false;
				}
			}
			return returnValue;
		},
		fix: function(event) {
			if (event) {
				event.preventDefault
			}
		}
	}

})

































