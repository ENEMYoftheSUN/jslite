(function (W, U)
	{
		"use strict";
		/**
		 * @projectDescription
		 * lite<br/>
		 * A JavaScript toolbox focused on small size and efficiency.
		 * Extends native classes.
		 * Native methods and properties are not overridden if they already exist.
		 * Please note that lite methods are always accessible via lite._methods.<Native Class>.<Method>.call (<Object>, ...)
		 * eg : lite._methods.Array.reduce.call ([10, 20, 30], function (a, b) { return a + b; }, 0);    // 60
		 *
		 * -----------------------------------------------------------------------------------------------------------------
		 * Example : a tiny password generator :
		 * <code>
		 * // RULES : generate <b>howMany</b> words of random characters and case. Maximum length is <b>len</b>.
		 * var f = function (howMany, len) {
     *     return [].range (65, 65 + 26).repeat (howMany).map (function (v) { return v + (Math.intRandom (1) * 32); }).shuffle ().chop (howMany).map (function (v) { return v.first (v.length.max (len)).stringify (); })
     * };
		 *
		 *f.repeat (5, null, [ 2, 10 ]);  // [["SaComKrcRU", "YXGWilZbun"], ["typRTBZkXb", "GEGUPSzCDl"], ["VoiZkdVwhJ", "guobmNELcX"], ["GCdOEaIcsM", "pQLnWoXsil"], ["YazJUDRaGW", "eiLNvcZUCM"]]
		 *f.repeat (2, null, [ 4, 30 ]);  //  [["XjqkUDwmRENgZZyPKNVGvtropc", "cVapJfLktSEdyAaUMcuHrYWZTI", "AqFzhQHJkWbxgdMBexpljssRWT", "nFoioiEuyCbHSNbDoMfIVGXQll"], ["YicWOHPgXNzbwhsuWMEPOaUfhv", "OyPElSRagEQXyUAnDjnzssgpyk", "OcvMWQNkcxFIqIxtjLIRbkhrBA", "lzdMmtBdGrvtjFCZeDukQjLFVT"]]</code>
		 *
		 * @author        Paulo "SICKofitALL" RITO (paulo.rito@gmail.com)
		 * @license        freeware
		 * @version        1.1.20131227
		 * @location    http://www.jslite.net/
		 * @name        lite
		 */

		var
			O = Object,
			P = 'prototype',
			OP = O[P].toString,
			AP = Array[P],
			SP = String[P],
			M = Math,
			Q = '',
			S = ' ',
			F = 'function',
			N = null,
			V = 'Firefox Opera Safari Chrome IE N/A'.split (S),
			NA = navigator,
			UA = NA.userAgent,
			Y = -1,
			LN = function (l) { return l.length; },


			/**
			 * Core
			 * @namespace lite.
			 */
				lite = {
				/**
				 * lite version (string value)
				 *
				 * @constant
				 */
				version: "1.1",

				/**
				 * Internal build number
				 * @static
				 */
				build: "20140716",


// * EXTENSIONS ********************************************************************************************************
				/**
				 * Extensions space holder
				 * @namespace
				 */
				ex:    {
					/**
					 * Adds (and replace if exists !) methods in lite.ex namespace. The scope is set to the functions themselves.
					 * Alloys hosting of simple functions without polluting the global namespace.
					 *
					 * @param {Object}    obj                JSON object containing <b>methods</b>
					 * @param {Object}    [scope=obj]        Assign another scope to the function other that itself
					 * @return {void}
					 * @example
					 lite.ex.add ({ chgInnerEl: function (txt) { this.innerText = txt; } }, document.getElementById ('someElement'));
					 lite.ex.chgInnerEl ("some text");
					 */
					add: function (obj, scope)
						{
							_a (L.ex, _I (obj, function (v, k) { obj[k] = v.bind (scope || v); }), true);
						},

					/**
					 * Extends lite with new functions.
					 *
					 * @param {Object}    obj                JSON object containing what should be added
					 * @param {Object}    [what=lite]        Specify a different namespace (default is <code>lite</code>)
					 * @return {void}
					 */
					extend: function (obj, what)
						{
							_a (what || L, obj, true);
						}
				},


// * PRIVATE ***********************************************************************************************************
				/**
				 * Backups any previous "lite" object. You may access it with <code>lite.lite</code>
				 */
				lite:  W.lite,

				/**
				 * Few browser informations.
				 * @namespace
				 */
				browser: {},

				/**
				 * @private
				 * all functions are here
				 */
				_methods: {
// * FUNCTION **********************************************************************************************************
					/**
					 * @name lite._methods.Function
					 */
					Function: {
						/**
						 * Calls the current function every <b>interval</b> milliseconds.
						 *
						 * @param {Number}    interval        Interval (ms) between each calls
						 * @param {Object}    [scope=null]    Scope
						 * @param {Array}    [args=[]]        Array of parameters
						 * @name cyclic
						 * @return {Number}                    To be used with native method <code>clearInterval ()</code>
						 * @member Function.prototype
						 * @function
						 */
						cyclic: function (interval, scope, args)
							{
								var ptr = this;
								return setInterval (ptr.bind (scope, args || []), interval);
							},

						/**
						 * Waits for <b>delay</b> milliseconds before calling the current function.
						 *
						 * @param {Object}    delay            Delay (ms)
						 * @param {Object}    [scope=null]    Scope
						 * @param {Array}    [args=[]]        Array of parameters
						 * @return {Number}                    To be used with native method <code>clearTimeout ()</code>
						 * @member Function.prototype
						 * @name defer
						 * @function
						 */
						defer: function (delay, scope, args)
							{
								var f = this.bind (scope);
								return setTimeout (function () { return f.apply (f, args || []); }, delay);
							},

						/**
						 * Creates a callback function.<br/>
						 * Arguments may be supplied at creation and at execution.
						 *
						 * @param {Mixed}        [args]    Any optional arguments
						 * @return {Function}
						 * @member Function.prototype
						 * @name callback
						 * @function
						 * @example
						 var fn = function (text) { alert (text); };
						 var callback = fn.callback ("Lorem ipsum");
						 window.onload = callback;           // shows "Lorem ipsum"
						 var fn = function () { alert (arguments.length); };
						 window.onload = fn2.callback ();    // shows "1", because the event object was added by the JS engine !
						 */
						callback: function ()
							{
								var
									ptr = this,
									a = _A (arguments);

								return function ()
									{
										return ptr.apply (N, a.concat (_A (arguments)));
									};
							},

						/**
						 * JS 1.8.5 Function.prototype.bind implementation
						 *
						 * @param {Object}    [scope=this]    Scope
						 * @param {Mixed}    [args]            Parameters..
						 * @return {Function}
						 * @member Function.prototype
						 * @name bind
						 * @function
						 * @example
						 var someObject = { name: "Bird", color: "blue" };
						 var fn = function () { alert (this.name); };
						 var bind = fn.bind (someObject);    // fn.bind (somObject)
						 window.onload = bind;    // shows "Bird"
						 */
						bind: function (scope)
							{
								var
									ptr = this,
									a = _A (arguments).epop (0);

								return function ()
									{
										return ptr.apply (scope || ptr, a.concat (_A (arguments)));
									};
							},

						/**
						 * Calls the current function <b>n</b> times.<br/>
						 * The current iteration number (begins at 0) and the array containing returned values are automaticly passed to the function (see example).
						 *
						 * @param {Number}    n                Number of calls
						 * @param {Object}    [scope=null]    Scope
						 * @param {Array}    [args=[]]        Array of parameters
						 * @return {Array}                    Contains all the returned values from the successive calls
						 * @member Function.prototype
						 * @name Function.prototype.repeat
						 * @function
						 * @example
						 var f = function (mul, i, r) { return i * mul; };  // i is the current iteration number (0 to 4), r the array containing all the previously returned values
						 alert (f.repeat (5, null, 2));                     // shows [0,2,4,6,8]
						 */
						repeat: function (n, scope, args)
							{
								for (var i = 0, r = []; i < n; r[i] = this.apply (scope, (args || []).concat ([ i++, r ])))
									{}
								return r;
							},

						/**
						 * Embeds specified functions in a function.
						 *
						 * @param {Object}        scope=null        Scope
						 * @param {Function}    f                List of functions (or callbacks). Automatically receives as arguments the current list order (begins at 0) and the previous return value if available.
						 * @return {Function}                    This function will return an array
						 * @member Function.prototype
						 * @name chain
						 * @function
						 * @example
						 var f = Function.chain (null,
						 function () { alert ('My function #1'); return '#1'; },
						 function () { alert ('My function #2'); return '#2'; },
						 function () { alert ('My function #3'); return '#3'; }
						 );
						 var r = f ();   // execute embedded functions and shows 'My function #1', 'My function #2', 'My function #3'
						 alert (r);      // returns [anonymous(), "#1", "#2", "#3"]. You may use <code>r.epop (0)</code> to remove the anonymous function string, which is useless here.

						 // alternative :
						 var f1 = function (i) { alert ("I'm function #" + i); return 'A'; };
						 var f = f1.chain (null,
						 function (i, r) { alert ("I'm function #" + i + " and the last function returned " + r); return 'B'; },
						 function () { alert ("I'm function #" + arguments[0] + " and the last function returned " + arguments[1]); return 'C'; }
						 );
						 var r = f ();   // "I'm function #0", "I'm function #1 and the last function returned A", "I'm function #2 and the last function returned B"
						 alert (r);      // shows ["A", "B", "C"]
						 */
						chain: function (scope)
							{
								var
									a = [this].concat (_A (arguments).epop (0)),
									r;

								return function ()
									{
										return a.map (function (v, i)
										{
											r = v.call (scope, i, r);
											return r;
										});
									};
							}
					},


// * ARRAY *************************************************************************************************************
					/** @name lite._methods.Array */
					Array:    {
						/**
						 * Return the current array sliced in smaller sub-arrays
						 *
						 * @param {Int}        nb            Amount of sub-arrays
						 * @param {Boolean}    [fit=false]    <code>true</code> to prevent returning the last sub-array if its smaller than previous ones
						 * @return {Array}
						 * @member Array.prototype
						 * @name Array.prototype.chop
						 * @see chunk
						 * @function
						 * @example
						 [10, 20, 30, 40, 50, 60, 70].chop (2);           // [[10, 20, 30], [40, 50, 60], [70]]  note the last sub-array !
						 [10, 20, 30, 40, 50, 60, 70].chop (2, true);     // [[10, 20, 30], [40, 50, 60]]
						 */
						chop: function (len, fit)
							{
								return this.chunk ((LN (this) / len).fix (), fit);
							},


						/**
						 * Breaks up the current array in smaller ones.
						 *
						 * @param {Number}    size        Size of chunks
						 * @param {Boolean}    [fit=false]    Set to <code>true</code> to remove sub-arrays that do not fit the chunk size
						 * @param {Number}    [limit=all]    Maximum number of chunks that must be returned
						 * @return {Array}
						 * @member Array.prototype
						 * @name Array.prototype.chunk
						 * @see chop
						 * @function
						 * @example
						 [10, 20, 30, 40, 50, 60, 70, 80, 90].chunk (3);           // [[10, 20, 30], [40, 50, 60], [70, 80, 90]]
						 [10, 20, 30, 40, 50, 60, 70, 80, 90].chunk (4);           // [[10, 20, 30, 40], [50, 60, 70, 80], [90]]
						 [10, 20, 30, 40, 50, 60, 70, 80, 90].chunk (4, true);     // [[10, 20, 30, 40], [50, 60, 70, 80]]
						 [10, 20, 30, 40, 50, 60, 70, 80, 90].chunk (3, true);     // [[10, 20, 30], [40, 50, 60], [70, 80, 90]]
						 [10, 20, 30, 40, 50, 60, 70, 80, 90].chunk (3, false, 2); // [[10, 20, 30], [40, 50, 60]]
						 */
						chunk: function (size, fit, limit)
							{
								for (var v, i = 0, p = Y, l = LN (this), l = (fit ? l - l % size : l), r = []; i < l; (v = i % size) ? r[p][v] = this[i++] : r[++p] = [this[i++]])
									{}
								return limit ? r.first (limit) : r;
							},

						/**
						 * Cleans up the current array by removing all undefined or null elements. If <b>strict</b> is set, all falsy elements (0, empty strings, <code>false</code>, ...) are removed too.
						 *
						 * @param {Boolean} strict    Set to true to also remove falsy elements
						 * @return {Array}
						 * @member Array.prototype
						 * @name clean
						 * @see unique
						 * @see isEmpty
						 * @function
						 * @example
						 ['dog', , "", 'gerbil', undefined, 'bird', 0, null].clean ();      // ['dog', '', 'gerbil', 'bird', 0]
						 ['dog', , "", 'gerbil', undefined, 'bird', 0, null].clean (true);  // ['dog', 'gerbil', 'bird']
						 */
						clean: function (strict)
							{
								return this.filter (function (v)
								{
									return (strict ? !!v : v !== U && v !== N);
								});
							},

						/**
						 * Returns a copy of the current array.
						 *
						 * @return {Array}
						 * @member Array.prototype
						 * @name clone
						 * @function
						 * @example
						 var a = [1, 2, 3];
						 var b = a;
						 var c = a.clone ();
						 a[1] = 999;
						 b[1] == 999;     // true ! changing array values change b too !
						 c[1] == 999;     // false ! c is an independant array
						 */
						clone: function ()
							{
								return this.slice ();
							},

						/**
						 * Compare the current array with another.
						 *
						 * @param {Array} a        The array to compare
						 * @return {Boolean}    <code>true</code> if both arrays are strictly identical (same size, same content)
						 * @member Array.prototype
						 * @name compare
						 * @function
						 * @example
						 var a = [66, 65, 66, 69];
						 [66, 65, 66, 69].compare (a);      // true
						 ["66", 65, 66, 69].compare (a);    // false
						 "BABE".toIntArray ().compare (a);  // true
						 */
						compare: function (a)
							{
								var
									l = LN (a),
									cont = (LN (this) === l);

								while (cont && l-- && (cont = (this[l] === a[l])))
									{}
								return cont;
							},

						/**
						 * Returns <code>true</code> if <b>value</b> exists in the current array.
						 *
						 * @param {Mixed} value            Value to be found
						 * @return {Boolean}
						 * @member Array.prototype
						 * @name contains
						 * @function
						 * @example
						 var a = ["bird", "dog", "cat"];
						 a.contains ("bird");  // true
						 a.contains ("pig");   // false
						 */
						contains: function (value)
							{
								return this.indexOf (value) >= 0;
							},

						/**
						 * Initialize an array.
						 *
						 * @param {Integer}    [len]        Desired length
						 * @param {Mixed}    [value=0]    Repeated value. May be any kind of data.
						 * @return {Array}
						 * @member Array.prototype
						 * @name dim
						 * @function
						 * @example
						 [].dim (10);                    // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
						 [].dim (10, 123);               // [123, 123, 123, 123, 123, 123, 123, 123, 123, 123]
						 ["Cat", "Dog"].dim (2, "Fish"); // ["Cat", "Dog", "Fish", "Fish"]
						 a = ["dog", "fish"];
						 a.dim (5, a);                // ["dog", "fish", ["dog", "fish"], ["dog", "fish"], ["dog", "fish"], ["dog", "fish"], ["dog", "fish"]]
						 a.dim (5, a).flat ();        // ["dog", "fish", "dog", "fish", "dog", "fish", "dog", "fish", "dog", "fish", "dog", "fish"]
						 */
						dim: function (len, value)
							{
								return this.concat ([].range (len).map (function () { return value || 0; }));
							},

						/**
						 * Functionnal version of the native <code>pop</code> function. Removes the last element of the current array (if no <b>index</b> is specified) and returns it.
						 *
						 * @param {Number} [index=last]    Index of the element to be removed.
						 * @return {Array}
						 * @member Array.prototype
						 * @name epop
						 * @function
						 * @example
						 ['dog', 'cat', 'plane', 'bird'].epop ();            // ['dog', 'cat', 'plane']
						 ['dog', 'cat', 'plane', 'bird'].epop (2);           // ['dog', 'cat', 'bird']
						 ['dog', 'cat', 'plane', 'bird'].epop (1).epop (1);  // ['dog', 'bird'] (indexes have changed after the first epop !)
						 */
						epop: function (index)
							{
								index >= 0 ? this.splice (index, 1) : this.pop ();
								return this;
							},

						/**
						 * Returns <code>true</code> if every elements in the current array returns <code>true</code> one applied to the <b>f</b> callback function.
						 *
						 * @param {Function}    f                Callback function. Receives as parameters the current value, the index and the current array. Must return a Boolean.
						 * @param {Mixed}        [scope=null]    callback function scope
						 * @return {Boolean}
						 * @member Array.prototype
						 * @name every
						 * @see some
						 * @function
						 * @example
						 var f = function (v) { return v > 10; };
						 [2, 5, 9].every (f);     // true
						 [2, 5, 19].every (f);    // false
						 */
						every: function (f, scope)
							{
								for (var i = 0, l = LN (this); i < l; i++)
									{
										if (!f.call (scope, this[i], i, this))
											{
												return false;
											}
									}
								return true;
							},

						/**
						 * Removes from the current array all elements passed in parameters.
						 *
						 * @param {Array}    excl    Array containing a list of values to be removed
						 * @return {Array}
						 * @member Array.prototype
						 * @name exclude
						 * @see extract
						 * @function
						 * @example
						 var a = ['plane', 'dog', 'cat', 'bird', 'dog', 'fish'];
						 a.exclude (['plane', 'dog']);     // ['cat', 'bird', 'fish']
						 */
						exclude: function (excl)
							{
								excl = [ excl ].flat ();
								return this.filter (function (v)
								{
									return !excl.contains (v);
								});
							},

						/**
						 * Calls a function for each elements in the array.
						 *
						 * @alias each
						 * @param {Function}    f                The function to call. Receives as arguments the current array value, the current index and the entire array
						 * @param {Mixed}        [scope=null]    Scope
						 * @return {void}
						 * @member Array.prototype
						 * @name forEach
						 * @see map
						 * @see each
						 * @function
						 * @example
						 ["A", "B", "C", "D"].forEach (function (v) { alert (v); });  // show successivelly "A", "B", "C" and "D"
						 ["A", "B", "C", "D"].forEach (alert);                        // same result
						 ["A", "B", "C", "D"].each (alert);                           // same result again
						 */
						forEach: function (f, scope)
							{
								return _I (this, f, scope);
							},


						/**
						 * Converts an array containing numbers in a string based on each unicode values.
						 *
						 * @return {String}
						 * @member Array.prototype
						 * @name stringify
						 * @function
						 * @example
						 [66, 65, 66, 69].stringify ();  // "BABE"
						 */
						stringify: function ()
							{
								return String.fromCharCode.apply (N, this);
							},

						/**
						 * Applies a function to each elements in the current array.
						 *
						 * @param {Function}    f                The function to apply. Receives as arguments the current array value, the current index and the entire array
						 * @param {Mixed}        [scope=null]    Scope
						 * @return {Array}
						 * @member Array.prototype
						 * @name map
						 * @see forEach
						 * @function
						 * @example
						 [11, 22, 33, 44].map (function (v) { return v * 2; });                      // [22, 44, 66, 88]
						 [2, 4, 6, 8].map (function (v, i) { return v + i; });                       // [2, 5, 8, 11]
						 [2, 4].map (function (v, i, curArr) { return curArr; });                    // [ [2, 4], [2, 4] ]

						 var someObject = { randomNumber: 33 };
						 [1, 2, 3].map (function (v) { return this.randomNumber * v; }, someObject); // [33, 66, 99]
						 */
						map: function (f, scope)
							{
								return _I (this, f, scope, true);
							},

						/**
						 * Returns an array containing only the elements of the current array who passed the filtering function. The function must return either <code>true</code> or <code>false</code>.
						 *
						 * @param {Function}    f                The filtering function. Receives as arguments the current array value, the current index and the entire array. Must return a boolean.
						 * @param {Mixed}        [scope=null]    Scope
						 * @return {Array}
						 * @member Array.prototype
						 * @name filter
						 * @see isEmpty
						 * @see clean
						 * @function
						 * @example
						 [15, 5, 11, 10].filter (function (v) { return (v > 10); });                   // [15, 11]
						 ['dog', 'cat', 'fish'].filter (function (v) { return (v.length <= 3); });     // ['dog', 'cat']
						 ['dog', 'cat', 'fish'].filter (function (v, i) { return (i > 1); });          // ['fish']
						 */
						filter: function (f, scope)
							{
								for (var i = 0, r = [], l = LN (this), v; i < l; i++)
									{
										v = this[i];
										f.call (scope, v, i, this) && r.push (v);
									}
								return r;
							},

						/**
						 * In an object, extracts all the values by its name.
						 *
						 * @param {String|Array}    keys    The key name or an array of keys
						 * @return {Array}
						 * @member Array.prototype
						 * @name extract
						 * @see exclude
						 * @function
						 * @example
						 var pets = [ { name: "Quake", type: "cat", age: 9 }, { name: "UT", type: "undead", age: 12 }, { name: "Doom", type: "cat", age: 2 } ];
						 pets.extract ('name');                    // ["Quake", "UT", "Doom"]
						 pets.extract (['name', 'age']);           // ["Quake", 9, "UT", 12, "Doom", 2]
						 pets.extract ('age').max ();              // gets the oldest pet -> 12
						 pets.extract ('type').contains ('fish');  // is there any fish in this list ? -> false
						 */
						extract: function (keys)
							{
								keys = [keys].flat ();
								return this.map (function (v)
								{
									return keys.map (function (vv)
									{
										if (v[vv])
											{
												return v[vv];
											}
									})
								}).flat ();
							},

						/**
						 * Returns the index of the first occurence of <b>v</b>. If nothing was found, returns -1. First index is 0.
						 *
						 * @see lastIndexOf
						 * @see indexAll
						 * @param {Mixed}    v                Value to be found
						 * @param {Number} [startIndex=0]    Index where search must begins
						 * @return {Number}
						 * @member Array.prototype
						 * @name indexOf
						 * @function
						 * @example
						 var a = ["plane", "dog", "cat", "bird", "dog", "fish"];
						 a.indexOf ("plane");    // 0
						 a.indexOf ("dog", 2);   // 4
						 a.indexOf ("dog", 20);  // -1
						 a.indexOf ("dawg");     // -1
						 */
						indexOf: function (v, startIndex)
							{
								for (var i = (startIndex || 0), l = LN (this); i < l; i++)
									{
										if (this[i] == v)
											{
												return i;
											}
									}
								return Y;
							},

						/**
						 * Returns the index of the last occurence of <b>v</b>. If nothing was found, returns -1. Default <b>startIndex</b> is the last element.
						 *
						 * @see indexOf
						 * @see indexAll
						 * @param {Mixed}    v                    Value to be found
						 * @param {Number}    [startIndex=last]    Index where search must begins
						 * @member Array.prototype
						 * @name lastIndexOf
						 * @function
						 * @return {Number}
						 */
						lastIndexOf: function (v, startIndex, _i)
							{
								_i = (startIndex || LN (this));
								while (_i--)
									{
										if (this[_i] == v)
											{
												return _i;
											}
									}
								return Y;
							},

						/**
						 * Returns an array containing the indexes of all occurence of <b>v</b>. Returns an empty array if nothing was found.
						 *
						 * @see indexOf
						 * @see lastIndexOf
						 * @param {Mixed}    v    Value to be found
						 * @return {Array}
						 * @member Array.prototype
						 * @name indexAll
						 * @function
						 * @example
						 ['dog', 'cat', 'plane', 'cat', 'cat', 'plane', 'car'].indexAll ('cat');  // [1, 3, 4]
						 */
						indexAll: function (v)
							{
								return this.map (function (z, i)
								{
									return (z === v ? i : N);
								}).clean ();
							},

						/**
						 * Returns the value of a random element in the current array.
						 *
						 * @return {Mixed}
						 * @member Array.prototype
						 * @name randomValue
						 * @function
						 * @example
						 ['dog', 'cat', 'gerbil'].randomValue ();  // cat
						 ['dog', 'cat', 'gerbil'].randomValue ();  // dog
						 */
						randomValue: function ()
							{
								return this[M.intRandom (LN (this) - 1)];
							},

						/**
						 * Shuffles the content of the current array.
						 *
						 * @return {Array}
						 * @member Array.prototype
						 * @name shuffle
						 * @function
						 * @example
						 ['dog', 'cat', 'bird'].shuffle (); // ['cat', 'dog', 'bird']
						 ['dog', 'cat', 'bird'].shuffle (); // ['bird', 'dog', 'cat' ]
						 */
						shuffle: function ()
							{
								for (var i = LN (this), rnd, tmp; i; tmp = this[--i], this[i] = this[(rnd = M.intRandom (i))], this[rnd] = tmp)
									{}
								return this;
							},

						/**
						 * Returns the first element of the current array, or the <b>nb-th</b> firsts if defined.
						 *
						 * @param {Int} [nb=1]    Number of elements to return
						 * @return {Mixed}        The first element or an array containing the <b>nb</b> first elements
						 * @member Array.prototype
						 * @name first
						 * @see last
						 * @function
						 */
						first: function (nb)
							{
								return nb ? this.slice (0, nb) : this[0];
							},

						/**
						 * Returns the last element of the current array.
						 *
						 * @return {Mixed}
						 * @member Array.prototype
						 * @name last
						 * @see first
						 * @function
						 */
						last: function ()
							{
								return this[LN (this) - 1];
							},

						/**
						 * Erase the current array. This is a inline operation !
						 *
						 * @param {Boolean} [copy=false]    If <code>true</code>, the returned value is a copy of the current array before erasing it. If <code>false</code> or <code>undefined</code>, returns an empty array
						 * @return {Array}
						 * @member Array.prototype
						 * @name nuke
						 * @function
						 * @example
						 var a = ['dog', 'bird', 'cat'];
						 a.nuke ();             // a = []
						 var a = ['dog', 'bird', 'cat'];
						 var b = a.nuke (true); // a = [], b = ['dog', 'bird', 'cat']
						 */
						nuke: function (copy, _t)
							{
								_t = (copy ? this.clone () : this);
								this.length = 0;
								return _t;
							},

						/**
						 * Sorts the current array in a numeric way (the native <code>sort</code> function considers each values as a string). This is a inline operation !
						 *
						 * @return {Array}
						 * @member Array.prototype
						 * @name sortNum
						 * @see sortBy
						 * @function
						 * @example
						 var a = [10, 33, 4 , 8, 5, 100];
						 a.sortNum ();    // [4, 5, 8, 10, 33, 100]
						 */
						sortNum: function ()
							{
								return this.sort (function (a, b)
								{
									return a - b;
								});
							},

						/**
						 * Sorts the current array by
						 *
						 * @return {Array}
						 * @member Array.prototype
						 * @name sortBy
						 * @see sortNum
						 * @function
						 * @example
						 var pets = [ { name: "Quake", type: "cat", age: 9 }, { name: "UT", type: "undead", age: 12 }, { name: "Doom", type: "cat", age: 2 } ];
						 pets.sortBy ('age');              // [ { name: "Doom", type: "cat", age: 2 }, { name: "Quake", type: "cat", age: 9 }, { name: "UT", type: "undead", age: 12 } ]
						 pets.sortBy ('name').reverse ();  // [ { name: "UT", type: "undead", age: 12 }, { name: "Quake", type: "cat", age: 9 }, { name: "Doom", type: "cat", age: 2 } ]
						 */
						sortBy: function (key)
							{
								return this.sort (function (a, b)
								{
									return a[key] > b[key];
								});
							},

						/**
						 * Return <code>true</code> if the current array is empty. <b>DO NOT WORK FOR "ASSOCIATIVES ARRAYS" (don't use them by the way, use classic objects for that) !</b>
						 *
						 * @param {Boolean} [strict=false]    If set to <code>true</code>, the array is first cleaned before checking the emptiness
						 * @return {Array}
						 * @member Array.prototype
						 * @name isEmpty
						 * @see clean
						 * @function
						 * @example
						 var a = [];
						 a.isEmpty ();             // true

						 a[0] = "some value";
						 a.isEmpty ();             // false

						 a[0] = "";
						 a.isEmpty (true);         // true

						 a["somekey"] = "some value";
						 a.isEmpty ();             // true !!!
						 */
						isEmpty: function (strict)
							{
								return LN (strict ? this.clean (strict) : this) === 0;
							},

						/**
						 * Removes duplicate entries in the current array.
						 *
						 * @param {Boolean} [isSorted=false]    To make the operation faster, and if the current array is sorted, set this to <code>true</code>
						 * @return {Array}
						 * @member Array.prototype
						 * @name unique
						 * @see clean
						 * @see isEmpty
						 * @function
						 * @example
						 ['dog', 'cat', 'plane', 'cat', 'cat', 'plane', 'car'].unique ();  // ['dog', 'cat', 'plane', 'car']
						 */
						unique: function (isSorted)
							{
								return this.reduce (function (acc, v, i)
								{
									(i === 0 || (isSorted ? acc.last () != v : !acc.contains (v))) && acc.push (v);
									return acc;
								}, []);
							},

						/**
						 * Converts the current array into an object.
						 *
						 * @param {Array} [keys=null]    Array containing optional keys to assign to each elements of the current array. If not enough keys are provided, indexes will be used as keys.
						 * @return {Object}
						 * @member Array.prototype
						 * @name toObject
						 * @function
						 * @example
						 ['dog', 'cat', 'fish'].toObject ();                    // { 0: 'dog, 1: 'cat', 2: 'fish' }
						 ['dog', 'cat', 'fish'].toObject (['k1', 'k2', 'k3']);  // { k1: 'dog, k2: 'cat', k3: 'fish' }
						 */
						toObject: function (keys, _)
							{
								_ = {};
								keys = keys || [];
								this.each (function (v, i)
								{
									_[keys[i] || i] = v;
								});
								return _;
							},

						/**
						 * Returns the biggest numeric value in the current array, which must contains only numbers.
						 *
						 * @return {Number}    Returns <code>NaN</code> if the current array contains non numeric values.
						 * @member Array.prototype
						 * @name Array.prototype.max
						 * @see min
						 * @function
						 */
						max: function ()
							{
								return M.max.apply (N, this);
							},

						/**
						 * Returns the smallest numeric value in the current array, which must contains only numbers.
						 *
						 * @return {Number}    Returns <code>NaN</code> if the current array contains non numeric values.
						 * @member Array.prototype
						 * @name Array.prototype.min
						 * @see max
						 * @function
						 */
						min: function ()
							{
								return M.min.apply (N, this);
							},

						/**
						 * Returns the sum of the current array, which obviously must contains only numbers. If the array is empty, returns 0.
						 *
						 * @return {Number} Returns <code>NaN</code> if the current array contains non numeric values.
						 * @member Array.prototype
						 * @name sum
						 * @function
						 */
						sum: function ()
							{
								return (LN (this) ?
									this.reduce (function (p, v)
									{
										return (+p) + (+v);
									}, 0)
									: 0);
							},

						/**
						 * Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value.
						 *
						 * @param {Function}    f                Callback function. Receives as parameters the current accumulator value, the current array value, the index and the complete current array.
						 * @param {Mixed}        acc                Initial accumulator value
						 * @param {Object}        [scope=null]    Scope
						 * @return {Mixed}
						 * @member Array.prototype
						 * @name reduce
						 * @see reduceRight
						 * @function
						 * @example
						 [10, 20, 30].reduce (function (acc, v) { return acc + v; }, 0);  // sums up all values in the array => 60
						 */
						reduce: function (f, acc, scope)
							{
								this.each (function (v, i, l)
								{
									acc = f.call (scope, acc, v, i, l);
								});
								return acc;
							},

						/**
						 * Apply a function against an accumulator and each value of the array (from right-to-left) as to reduce it to a single value.
						 *
						 * @param {Function}    f                Callback function. Receives as parameters the current accumulator value, the current array value, the index and the complete current array.
						 * @param {Mixed}        acc                Initial accumulator value
						 * @param {Object}        [scope=null]    Scope
						 * @return {Mixed}
						 * @member Array.prototype
						 * @name reduceRight
						 * @see reduce
						 * @function
						 * @example
						 var a = ["A", "B", "C"];
						 a.reduce (function (acc, v) { return acc + v; }, "");       // "ABC"
						 a.reduceRight (function (acc, v) { return acc + v; }, "");  // "CBA"
						 */
						reduceRight: function (f, acc, scope)
							{
								this.clone ().reverse ().each (function (v, i, l)
								{
									acc = f.call (scope, acc, v, i, l);
								});
								return acc;
							},

						/**
						 * Returns <code>true</code> if at least one element in the current array matches the condition defined in the callback function.
						 *
						 * @param {Function}    f                Callback function. Receives as parameters the current value, the index and the current array. Must return a Boolean.
						 * @param {Mixed}        [scope=null]    Scope
						 * @return {Boolean}
						 * @member Array.prototype
						 * @name some
						 * @see every
						 * @function
						 * @example
						 var a = [10, 20, 30];
						 a.some (function (v) { return v >= 40; });       // false
						 a.some (function (v) { return v >= 30; });       // true
						 */
						some: function (f, scope)
							{
								for (var i = 0, l = LN (this); i < l; i++)
									{
										if (f.call (scope, this[i], i, this))
											{
												return true;
											}
									}
								return false;
							},


						/**
						 * Flatten the content of the current array.
						 *
						 * @see chunk
						 * @param {Boolean} [deep=false]    If set to <code>true</code> and sub-arrays are found, flatten them too.
						 * @return {Array}
						 * @member Array.prototype
						 * @name flat
						 * @function
						 * @example
						 [10, 20, [ 'A', 'B', 'C'], 'Z', [ [50, 55], 60]].flat ();     // [10, 20, "A", "B", "C", "Z", [50, 55], 60]
						 [10, 20, [ 'A', 'B', 'C'], 'Z', [ [50, 55], 60]].flat (true); // [10, 20, "A", "B", "C", "Z", 50, 55, 60]
						 */
						flat: function (deep)
							{
								return this.reduce (function (a, b)
								{
									return a.concat (deep && L.isArray (b) ? b.flat (deep) : b);
								}, []);
							},

						/**
						 * Appends to the current array the arithmetic progression between <b>start</b> and <b>stop</b>.<br/>
						 * This is a port of a native Python function.
						 *
						 * @param {Integer}    [start=0]    Start of the range (INCLUSIVE)
						 * @param {Integer}    stop        End (EXCLUSIVE)
						 * @param {Integer}    [step=1]    Increment value
						 * @return {Array}
						 * @member Array.prototype
						 * @name range
						 * @function
						 * @example
						 [].range (10, 20, 1);           // [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
						 [].range (10, 20);              // [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
						 [].range (10);                  // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
						 [33, 66, 99].range (10);        // [33, 66, 99, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
						 [].range (65, 71).stringify (); // "ABCDEF"
						 */
						range: function (start, stop, step)
							{
								for (var a = _A (arguments), as = (LN (a) <= 1), s = a[2] || 1, e = a[as ? 0 : 1] - s, i = (as ? 0 : a[0]) - s; i < e; this.push (i += s))
									{}
								return this;
							},

						/**
						 * Insert a value or an array of values at a specified index in the current array.
						 *
						 * @param {integer}        where    The index where the insertion should begin. Set to 0 to insert at the beginning, or a negative value to insert from the last index
						 * @param {Mixed|Array}    what    The value or array of values that should be inserted
						 * @return {Array}
						 * @member Array.prototype
						 * @name insert
						 * @function
						 * @example
						 [10, 20, 50, 60].insert (2, 30);               // [10, 20, 30, 50, 60]
						 [10, 20, 50, 60].insert (2, [30, 40]);         // [10, 20, 30, 40, 50, 60]
						 "Quake".toArray ().insert (4, "*").join ('');  // "Qua*ke"
						 [10, 20, 50, 60].insert (20, "X");             // [10, 20, 50, 60, "X"]
						 [10, 20, 50, 60].insert (-1, 30);              // [10, 20, 50, "X", 60]
						 */
						insert: function (where, what)
							{
								this.splice.apply (this, [where, 0].concat ([what].flat ()));
								return this;
							},

						/**
						 * Returns the current array repeated <b>n</b> times.
						 *
						 * @param {integer}    n    How many times should the current array be repeated.
						 * @return {Array}
						 * @member Array.prototype
						 * @name Array.prototype.repeat
						 * @function
						 * @example
						 [10, 20, 50, 60].repeat (2);               // [10, 20, 50, 60, 10, 20, 50, 60]
						 */
						repeat: function (n)
							{
								//for (var i = 0, r = []; i < n; r[i++] = this) {};
								return [].dim (n, this);
							},

						/**
						 * Rotate the current array.
						 *
						 * @param {integer}    n    INTEGER positive or negative value.
						 * @return {Array}
						 * @member Array.prototype
						 * @name rotate
						 * @function
						 * @example
						 "Quake".toArray ().rotate (2).join ('');    // "akeQu"
						 [10, 20, 30].rotate (-1);                   // [30, 10, 20]
						 */
						rotate: function (n)
							{
								for (var i = 0, l = LN (this), d = []; i < l; d[i] = this[(i++ + n).mod (l)])
									{}
								return d;
							},

						/**
						 * Returns the <code>i</code> index of the current array. If this value is undefined, an optionnal value may be provided in order to return it instead.
						 *
						 * @param {integer}    i                Array index.
						 * @param {mixed}    [def=undefined]  Default value to be returned.
						 * @return {Mixed}
						 * @member Array.prototype
						 * @name get
						 * @function
						 * @example
						 var a = [ 10, 20, 30 ];
						 a.get (1);        // 20
						 a.get (999);      // undefined
						 a.get (999, -1);  // -1
						 */
						get: function (i, def)
							{
								return this[i] === U ? def : this[i];
							}
					},


// * NUMBER ************************************************************************************************************
					/**
					 * @name lite._methods.Number
					 */
					Number:   {
						/**
						 * Defines a maximum value for the current number.
						 *
						 * @param {Number} v    Maximum value
						 * @return {Number}
						 * @member Number.prototype
						 * @function
						 * @name Number.prototype.max
						 * @see min
						 * @example
						 var n = 10;
						 n.max (5);  // 5
						 n.max (15); // 10
						 */
						max: function (v)
							{
								return M.min (this, v);
							},

						/**
						 * Defines a minimum value for the current number.
						 *
						 * @param {Number} v    Minimum value
						 * @return {Number}
						 * @member Number.prototype
						 * @function
						 * @name Number.prototype.min
						 * @see max
						 */
						min: function (v)
							{
								return M.max (v, this);
							},

						/**
						 * Restrict the current value between a minimum and a maximum value.
						 *
						 * @param {Number} min    Minimum
						 * @param {Number} max    Maximum
						 * @return {Number}
						 * @member Number.prototype
						 * @function
						 * @name clamp
						 * @example
						 var n = 10;
						 n.clamp (10, 15); // 10
						 n.clamp (11, 15); // 11
						 */
						clamp: function (min, max)
							{
								return this.max (max).min (min);
							},

						/**
						 * Defines the precision for the current number.
						 *
						 * @param {Number} [p=0]    Number of digits. Returns the nearest integer by default.
						 * @return {Number}
						 * @member Number.prototype
						 * @function
						 * @name fix
						 * @see integer
						 * @example
						 var n = 10.26;
						 n.fix ();      // 10
						 n.fix (1);     // 10.3
						 n.fix (3);     // 10.26
						 (10.8).fix (); // 11
						 */
						fix: function (p)
							{
								return +this.toFixed (p);
							},

						/**
						 * Keeps only the integer part of the current number. No rounding !
						 *
						 * @return {Number}
						 * @member Number.prototype
						 * @function
						 * @name integer
						 * @see fix
						 * @example
						 (10.7).integer ();      // 10
						 (-123.999).integer ();  // -123
						 */
						integer: function ()
							{
								return ~~this;
							},

						/**
						 * Workaround for the modulo bug. Always returns a positive number.
						 *
						 * @param {Number} m    Modulo.
						 * @return {Number}
						 * @member Number.prototype
						 * @function
						 * @name mod
						 * @example
						 5 % 3;          // 2
						 (5).mod(3);     // 2
						 -5 % 3;         // -2 -> BUG, should return 2 !
						 (-5).mod (3);   // 2
						 */
						mod: function (m)
							{
								return ((this % m) + m) % m;
							}
					},


// * STRING ************************************************************************************************************
					/**
					 * @name lite._methods.String
					 */
					String:   {
						/**
						 * Escapes all characters that could interfer with RegExp.
						 *
						 * @return {String}
						 * @member String.prototype
						 * @name escRe
						 * @function
						 * @example
						 "$ = 2 * (11.23 + 10)".escRe ();    // "\$ = 2 \* \(11\.23 \+ 10\)"
						 */
						escRe: function ()
							{
								return this.replace (/([{}\(\)\^$&.\*\?\/\+\|\[\\\\]|\]|\-)/g, "\\$1");
							},

						/**
						 * Right fill the current string with another.
						 *
						 * @param {String} str    Padding source
						 * @return {String}        The returned string have the same length that <b>str</b>, except if the current string is longer.
						 * @member String.prototype
						 * @name rPad
						 * @name lPad
						 * @function
						 * @example
						 var s = "abc";
						 s.rPad ("00000");   // "00abc"
						 s.rPad ("     ");   // "  abc"
						 */
						rPad: function (str)
							{
								return str.replace (RegExp (".{" + LN (this).max (LN (str)) + "}$"), this);
							},

						/**
						 * Left fill the current string with another.
						 *
						 * @param {String} str    Padding source
						 * @return {String}        The returned string have the same length that <b>str</b>, except if the current string is longer.
						 * @member String.prototype
						 * @name lPad
						 * @see rPad
						 * @function
						 * @example
						 var s = "abc";
						 s.rPad ("00000")    // "abc00"
						 s.rPad ("     ")    // "abc  "
						 */
						lPad: function (str)
							{
								return str.replace (RegExp ("^.{" + LN (this).max (LN (str)) + "}"), this);
							},

						/**
						 * Replaces all occurences of <b>search</b> by <b>repl</b>.
						 *
						 * @param {String|Array}    search                    Source string or array of source strings
						 * @param {String|Array}    repl                    Replace string or array of replace strings
						 * @param {Boolean}            [caseSensitive=false]    If set, the search/replace is case sensitive
						 * @return {String}
						 * @member String.prototype
						 * @name strReplace
						 * @function
						 * @example
						 var s = 'dog,plane,fish,car';
						 s.strReplace ('dog', 'wolf');             // "wolf,plane,fish,car"
						 s.strReplace ('Dog', 'wolf', true);       // "dog,plane,fish,car" (current string remains untouched)

						 s.strReplace (['dog', 'plane'], 'wolf');            // "wolf,wolf,fish,car"
						 s.strReplace (['dog', 'plane'], ['wolf', 'bird']);    // "wolf,bird,fish,car"
						 */
						strReplace: function (search, repl, caseSensitive)
							{
								var
									re = [ repl ].flat (),
									s = this,
									gi = (caseSensitive ? "g" : "gi");

								[ search ].flat ().each (function (v, i)
								{
									s = s.replace (RegExp ((v + "").escRe (), gi), re[i] || re.last ());
								});
								return s;
							},

						/**
						 * Returns <code>true</code> if the current string ends with <b>search</b>.
						 *
						 * @param {String}    search                    String to test
						 * @param {Boolean} [caseSensitive=false]    If set, the test is case sensitive
						 * @member String.prototype
						 * @name endsWith
						 * @see beginsWith
						 * @function
						 * @return {Boolean}
						 * @example
						 "This is a password".endsWith ('word');       // true
						 "This is a password".endsWith ('word   ');    // false
						 "This is a password".endsWith ('WORD', true); // false
						 */
						endsWith: function (search, caseSensitive)
							{
								return !!this.match (search.escRe () + (caseSensitive ? "$/i" : "$"));
							},

						/**
						 * Returns <code>true</code> if the current string begins with <b>search</b>.
						 *
						 * @param {String}    search                    String to test
						 * @param {Boolean} [caseSensitive=false]    If set, the test is case sensitive
						 * @member String.prototype
						 * @name beginsWith
						 * @see endsWith
						 * @function
						 * @return {Boolean}
						 */
						beginsWith: function (search, caseSensitive)
							{
								return !!this.match ('^' + search.escRe () + (caseSensitive ? "/i" : ""));
							},

						/**
						 * Reverses tu current string.
						 *
						 * @return {String}
						 * @member String.prototype
						 * @name reverse
						 * @function
						 * @example
						 "abcdef".reverse ();  // "fedcba"
						 */
						reverse: function ()
							{
								return _A (this).reverse ().join (Q);
							},

						/**
						 * Removes all white characters at the beginning and the end of the current string.
						 *
						 * @return {String}
						 * @member String.prototype
						 * @name trim
						 * @function
						 */
						trim: function ()
							{
								return this.replace (/(^\s+)|(\s+$)/g, Q);
							},

						/**
						 * Converts the current string in a array containing the char code of each characters.
						 *
						 * @return {Array}
						 * @member String.prototype
						 * @name toIntArray
						 * @see toInt
						 * @see toArray
						 * @function
						 * @example
						 "javascript".toIntArray ();    // [106, 97, 118, 97, 115, 99, 114, 105, 112, 116]
						 */
						toIntArray: function ()
							{
								return _A (this).map (function (v)
								{
									return v.charCodeAt (0);
								});
							},

						/**
						 * Converts the current string in a array of characters.
						 *
						 * @see lite.A
						 * @return {Array}
						 * @member String.prototype
						 * @name toArray
						 * @see toIntArray
						 * @function
						 */
						toArray: function ()
							{
								return _A (this);
							},

						/**
						 * Removes all HTML tags in the current string.
						 *
						 * @member String.prototype
						 * @name stripTags
						 * @see htmlEntities
						 * @function
						 * @return {String}
						 */
						stripTags: function ()
							{
								return this.replace (/<\/?[^>]*>/gi, Q);
							},

						/**
						 * Converts some special HTML characters (&, <, >, ', ").
						 *
						 * @member String.prototype
						 * @name htmlEntities
						 * @see stripTags
						 * @function
						 * @return {String}
						 */
						htmlEntities: function ()
							{
								return this.strReplace (['&', '<', '>', '"', "'"], ['&amp;', '&lt;', '&gt;', '&quot;', '&#39;']);
							},

						/**
						 * Returns <b>n</b> characters from the left of the current string. If <b>n</b> is negative, returns from <b>n</b>-th character.
						 *
						 * @param {Number} n    If positive : number of characters to return. If negative : number of characters to NOT return
						 * @return {String}
						 * @member String.prototype
						 * @name left
						 * @see right
						 * @function
						 * @example
						 var s = "javascript is cool";
						 s.left (10);   // "javascript"
						 s.left (-10);  // " is cool"
						 */
						left: function (n)
							{
								return (n < 0 ? this.slice (-n) : this.slice (0, n));
							},

						/**
						 * Returns <b>n</b> characters from the right of the current string. If <b>n</b> is negative, returns from <b>n</b>-th character.
						 *
						 * @param {Number} n    If positive : nimber of characters to return. If negative : number of characters to NOT return
						 * @return {String}
						 * @member String.prototype
						 * @name right
						 * @see left
						 * @function
						 * @example
						 var s = "javascript is cool";
						 s.right (7);    // => "is cool"
						 s.right (-7);    // => "javascript "
						 */
						right: function (n)
							{
								return (n < 0 ? this.slice (0, n) : this.slice (-n));
							},

						/**
						 * Repeats the current string <b>n</b> times.
						 *
						 * @param {Number} n    Number of repetitions
						 * @return {String}
						 * @member String.prototype
						 * @name String.prototype.repeat
						 * @function
						 * @example
						 "a string ".repeat (3);    // "a string a string a string "
						 */
						repeat: function (n)
							{
								return Array ((n || 1) + 1).join (this);
							},

						/**
						 * Returns the current string camelized. Valid separators are "-", "_" or ".".
						 *
						 * @return {String}
						 * @member String.prototype
						 * @name camelize
						 * @see uncamelize
						 * @see capitalize
						 * @function
						 * @example
						 var s = "background-color";
						 s.camelize ();             // "backgroundColor"
						 "mon.texte".camelize ();   // "monTexte"
						 */
						camelize: function ()
							{
								return this.replace (/[-_.]([a-z])/gi, function (m, b)
								{
									return b.upper ();
								});
							},

						/**
						 * Uncamelize the current string.
						 *
						 * @param {String} [sep='-']    Separator to be used.
						 * @return {String}
						 * @member String.prototype
						 * @name uncamelize
						 * @see camelize
						 * @see capitalize
						 * @function
						 * @example
						 "backgroundColor".uncamelize ();  // "background-color"
						 "someText".uncamelize ("_");      // "some_text"
						 */
						uncamelize: function (sep)
							{
								return this.replace (/([A-Z])/g, (sep || '-') + "$+").lower ();
							},

						/**
						 * Returns the current string wrapped by <b>str</b>. An object can be supplied as a attributes list (useful for HTML tags).
						 *
						 * @param {String}    str        The string to wrap
						 * @param {Object}    [attr]    Attributes list
						 * @return {String}
						 * @member String.prototype
						 * @name strWrap
						 * @function
						 * @example
						 "my string".strWrap ("div");                                     // <div>my string</div>
						 "my string".strWrap ("div", { id: "myID", "class": "myClass" }); // <div id="myID" class="myClass">my string</div>
						 */
						strWrap: function (str, attr)
							{
								return "<{0}{2}>{1}</{0}>".template (str, this, (attr ? S + _I (attr,function (v, k)
								{
									return (k + "=\"" + v + "\"");
								}, N, true).join (S) : Q));
							},

						/**
						 * Uppercase the first non white character of the current string.
						 *
						 * @member String.prototype
						 * @name capitalize
						 * @see camelize
						 * @see uncamelize
						 * @see invertCase
						 * @function
						 * @return {String}
						 * @example
						 "my cAT is BLACK".capitalize ();    // "My cat is black"
						 "   my Cat is BLACK".capitalize (); // "   My cat is black"
						 */
						capitalize: function ()
							{
								return this.lower ().replace (/[^\s]|\D]/, function (m)
								{
									return m.upper ();
								});
							},

						/**
						 * Returns <code>true</code> if the current string is in uppercase.
						 *
						 * @see isLowerCase
						 * @see invertCase
						 * @return {Boolean}
						 * @member String.prototype
						 * @name isUpperCase
						 * @function
						 * @example
						 "MY DOG".isUpperCase ();  // true;
						 "MY DoG".isUpperCase ();  // false;
						 */
						isUpperCase: function ()
							{
								return (this == this.upper ());
							},

						/**
						 * Returns <code>true</code> if the current string is in lowercase.
						 *
						 * @see isUpperCase
						 * @see invertCase
						 * @member String.prototype
						 * @name isLowerCase
						 * @function
						 * @return {Boolean}
						 */
						isLowerCase: function ()
							{
								return (this == this.lower ());
							},

						/**
						 * Inverts the current string case.
						 *
						 * @return {String}
						 * @member String.prototype
						 * @name invertCase
						 * @see isLowerCase
						 * @see isUpperCase
						 * @see camelize
						 * @see uncamelize
						 * @function
						 * @example
						 "MY DoG".invertCase ();    // "my dOg";
						 */
						invertCase: function ()
							{
								//return this.replace (/([^\d\s])/g, function (m)
								return _A (this).map (function (m)
								{
									return m[m.isUpperCase () ? 'lower' : 'upper'] ();
								}).join (Q);
							},

						/**
						 * Returns <code>true</code> if the current string is empty (white characters are not considered).
						 *
						 * @return {Boolean}
						 * @member String.prototype
						 * @name String.prototype.isEmpty
						 * @function
						 * @example
						 "  dog  ".isEmpty ();  // false
						 "  ".isEmpty ();       // true
						 "".isEmpty ();         // true
						 */
						isEmpty: function ()
							{
								return !!!this.trim ();
							},

						/**
						 * Returns alternatively <b>str1</b> or <b>str2</b> depending of the current string.
						 *
						 * @param {String} str1    First string.
						 * @param {String} str2 Second string.
						 * @return {String}
						 * @member String.prototype
						 * @name toggle
						 * @function
						 * @example
						 var s = "dog";
						 s = s.toggle ("dog", "cat");  // "cat"
						 s = s.toggle ("dog", "cat");  // "dog"
						 */
						toggle: function (str1, str2)
							{
								return (!(str1 && str2) ? this + Q : this == str1 ? str2 : str1);
							},

						/**
						 * Use the current string as a template for replacement. Keywords are defined as {0}, {1}, etc...
						 * Please see the template plugin which offers more possibilities and formatting.
						 *
						 * @param {Mixed} values    List or an array of values
						 * @return {String}
						 * @member String.prototype
						 * @name template
						 * @function
						 * @example
						 var s = "{0}, your {1} is {2}";
						 s.template ("Hello", "browser".capitalize (), lite.browser.name);  // "Hello, your Browser is Firefox"

						 "{0} {1} and {0} {2}".template ("the", "cat", "dog");              // "the cat and the dog"
						 "{0} {1} and {0} {2}".template (["the", "cat", "dog"]);            // "the cat and the dog"
						 */
						template: function ()
							{
								var a = _A (arguments).flat ();
								return this.replace (/\{(\d+)\}/g, function (m, b)
								{
									return a[b];
								});
							},

						/**
						 * Returns <code>true</code> if the current string is a well formed email address.
						 *
						 * @return {Boolean}
						 * @member String.prototype
						 * @name isValidEmail
						 * @function
						 */
						isValidEmail: function ()
							{
								return (/^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,4}$/i).test (this);
							},

						/**
						 * Limits the length of the current string, and appends to it <b>endStr</b>. The returned string length is <b>limit</b> minus <b>endStr</b> length !
						 *
						 * @param {Number} [limit=30]            Maximum number of characters
						 * @param {String} [endStr='&#8230;']    String to append
						 * @return {String}
						 * @member String.prototype
						 * @name ellipsis
						 * @function
						 * @example
						 "123456".ellipsis (5);        // 1234&#8230;
						 "123456".ellipsis (5, '..');  // 123..
						 "123456".ellipsis (5, '');    // 12345
						 "123456".ellipsis (10);       // 123456
						 */
						ellipsis: function (limit, endStr)
							{
								var
									l = limit || 30,
									t = endStr || '\u2026';

								return (LN (this) > l ? this.left (l - LN (t)) + t : this + Q);
							},

						/**
						 * Chops the current string in smaller strings and put it in an array.
						 *
						 * @param {Number}    size        Size of chunks
						 * @param {Boolean}    [fit=false]    If set to <code>true</code>, sub-arrays that do not fit to the chunk size are removed
						 * @param {Number}    [limit=all]    Maximum number of chunks that must be returned
						 * @return {Array}
						 * @member String.prototype
						 * @name chunk
						 * @function
						 * @example
						 var s = "this is a dummy string";
						 s.chunk (4);                        // ["this", " is ", "a du", "mmy ", "stri", "ng"]
						 s.chunk (4, true);                  // ["this", " is ", "a du", "mmy ", "stri"]
						 s.chunk (4, true, 2);               // ["this", " is "]
						 */
						chunk: function (size, fit, limit)
							{
								return _A (this).chunk (size, fit, limit).map (function (v)
								{
									return v.join (Q);
								});
							},

						/**
						 * For a string containing binary datas, returns its decimal value.
						 *
						 * @return {Number}
						 * @member String.prototype
						 * @name bin2dec
						 * @function
						 * @example
						 "101".bin2dec ();  // 5
						 "201".bin2dec ();  // NaN
						 */
						bin2dec: function ()
							{
								//return lite.A (this).reverse ().reduce (function (p, v, i) { return p | (v << i); });
								return this.toInt (2);
							},

						/**
						 * Encodes the current string in base64.
						 *
						 * @return {String}
						 * @member String.prototype
						 * @name base64encode
						 * @see base64decode
						 * @function
						 */
						base64encode: function (z)
							{
								z = "000000";
								return typeof btoa === F ?
									btoa (this)
									: this.toIntArray ().map (function (v)
								{
									return v.toString (2).rPad (z + "00");
								})
									.join (Q)
									.toString ()
									.chunk (6)
									.map (function (v)
								{
									return _64[v.lPad (z).toInt (2)];
								}).join (Q) + [Q, '==', '='][LN (this) % 3];
							},

						/**
						 * Decodes the current string from base64.
						 *
						 * @return {String}
						 * @member String.prototype
						 * @name base64decode
						 * @see base64encode
						 * @function
						 */
						base64decode: function ()
							{
								if (typeof atob === F)
									{
										return atob (this);
									}
								var a = _A (this.strReplace ('=', Q))
									.map (function (v)
								{
									return _64.indexOf (v).toString (2).rPad ("000000");
								})
									.join (Q)
									.chunk (8);
								return (this.endsWith ('=') ? a.epop () : a).map (function (v) { return v.toInt (2); }).stringify ();
							},

						/**
						 * Converts the current string into a floating number if possible.
						 *
						 * @return {Number}    Returns NaN if an errors has occured
						 * @member String.prototype
						 * @name String.prototype.toFloat
						 * @see toInt
						 * @function
						 */
						toFloat: function ()
							{
								return parseFloat (this);
							},

						/**
						 * Converts the current string into an integer if possible.
						 *
						 * @param {Number}    [radix=10]    The radix to be used
						 * @return {Number}    Returns NaN if an errors has occured
						 * @member String.prototype
						 * @name String.prototype.toInt
						 * @see toIntArray
						 * @see toFloat
						 * @function
						 */
						toInt: function (radix)
							{
								return radix ? parseInt (this, radix) : this | 0;
							},

						/**
						 * Alias to <code>toLowerCase</code>.
						 *
						 * @member String.prototype
						 * @name lower
						 * @return {String}
						 * @see isLowerCase
						 * @see invertCase
						 * @function
						 */
						lower: SP.toLowerCase,

						/**
						 * Alias to <code>toUpperCase</code>.
						 *
						 * @member String.prototype
						 * @name upper
						 * @return {String}
						 * @see isUpperCase
						 * @see invertCase
						 * @function
						 */
						upper: SP.toUpperCase
					},


// * MATH **************************************************************************************************************
					/** @name lite._methods.Math */
					Math:     {
						/**
						 * Returns an random number value between <b>min</b> and <b>max</b> (inclusive).<br/>
						 * If only one argument is provided, lower limit is 0
						 *
						 * @param {Number} [min=0]    Lower limit
						 * @param {Number} max    Higher limit
						 * @return {Number}
						 * @member Math
						 * @function
						 * @name getRandom
						 * @see Math.intRandom
						 * @example
						 Math.getRandom (10, 20);    // returns a random integer value between 10 and 20
						 Math.getRandom (0, 5);      // returns a random integer value between 0 and 5
						 Math.getRandom (5);         // returns a random integer value between 0 and 5 (shortcut)
						 */
						getRandom: function (min, max, _1, _2)
							{
								_1 = max || min;
								_2 = max ? min : 0;
								return ((M.random () * (_2 - _1)) + _1);
							},

						/**
						 * Returns an random integer value between <b>min</b> and <b>max</b> (inclusive).<br/>
						 * If only one argument is provided, lower limit is 0
						 *
						 * @param {Number} [min=0]    Lower limit
						 * @param {Number} max    Higher limit
						 * @return {Integer}
						 * @member Math
						 * @function
						 * @name intRandom
						 * @see Math.getRandom
						 * @example
						 Math.intRandom (10, 20);    // returns a random integer value between 10 and 20
						 Math.intRandom (0, 5);      // returns a random integer value between 0 and 5
						 Math.intRandom (5);         // returns a random integer value between 0 and 5 (shortcut)
						 */
						intRandom: function (min, max)
							{
								return M.getRandom (min, max) | 0;
							},

						/**
						 * Returns the signs of <b>v</b>. Possible returned value are 1, -1 or 0.
						 *
						 * @param {Number} v    Value to be tested
						 * @return {Number}
						 * @member Math
						 * @function
						 * @name Math.sgn
						 */
						sgn: function (v)
							{
								return (v > 0) - (v < 0);
							}
					}
				},


// * LITE **************************************************************************************************************
				/**
				 * Makes an object inherits from another (prototypal inheritance)
				 *
				 * @param {Object}    o    Source object
				 * @return {Object}
				 * @example
				 var o = { name: "Quake", type: "cat", age: 9 };
				 var n = lite.inherit (o);    // n == { name: "Quake", type: "cat", age: 9 }
				 o.color = "black";           // n == { name: "Quake", type: "cat", age: 9, color: "black" }
				 */
				inherit:  function (o, _f)
					{
						_f = function () {};
						_f[P] = o;
						return new _f;
					},

				/**
				 * Simple object cloning. No deep cloning !
				 *
				 * @param {Object}    obj    Source object
				 * @return {Object}
				 */
				clone: function (obj)
					{
						return _a ({}, obj);
					},

				/**
				 * Create easily complex object structures, aka namespaces.
				 *
				 * @param {String}    tree            Namespace name specified width JS object notation. New structure is eventually added to existing.
				 * @param {Object}    [root=window]    Root for the structure. Default is the global object (window).
				 * @return {Object}                    Returns last created branch.
				 * @example
				 // Create in global object the following structure :
				 // my: { complex: { structure: { name: "some name" }}}
				 var r = lite.namespace ('my.complex.structure');
				 r.name = "some name";
				 lite.namespace ('one.more', r);        // my: { complex: { structure: { name: "some name", one: { more: {} }}}
 */
				namespace: function (tree, root)
					{
						root = root || W;
						tree.split ('.').each (function (v)
						{
							root = root[v] = root[v] || {};
						});
						return root;
					},

				/**
				 * Applies a function to each entries of an object.
				 *
				 * @param {Object}            obj                The object to be itered
				 * @param {Function}        fn                Callback function. Receives as arguments the value, the key and the complete object
				 * @param {Mixed}            [scope=null]    Scope to apply to the callback
				 * @param {Mixed}            [retA=false]    Set it to true to return an array containing all the returned values from the callback
				 * @return {Object|Array}    Returns <b>obj</b> or an Array if <b>retA</b> is true
				 * @example
				 var o = { name: "Quake", type: "cat", age: 9 };
				 lite.I (o, function (v, k)
				 {
					alert ("the {1} is {0}".template (v, k));
				});
				 */
				I: function (obj, fn, scope, retA, a, k)
					{
						a = [];
						for (k in obj)
							{
								obj.hasOwnProperty (k) && a.push (fn.call (scope, obj[k], (isNaN (k) ? k : +k), obj));
							}
						;
						return retA ? a : obj;
					},

				/**
				 * Return all keys in the specified object as an array
				 *
				 * @param {Object} obj    Any object
				 * @return {Array}
				 */
				keys: function (obj)
					{
						return O.keys ? O.keys (obj) : _I (obj, function (v, k) { return k; }, N, true);
					},

				/**
				 * Returns the native class (String, Number, Array, ...).
				 *
				 * @param {Object} obj    Any object or variable
				 * @return {String}
				 */
				getClass: function (obj)
					{
						return OP.call (obj).split (S)[1].right (Y);
					},

				/**
				 * Returns <code>true</code> if <b>val</b> may be converted to a numeric value. <b>An infinite value (<code>Infinity</code>) IS a numeric !</b>
				 *
				 * @param {Object} val    Value to be tested
				 * @return {Boolean}
				 * @see isNumber
				 * @example
				 lite.isNumeric (10);      // true
				 lite.isNumber (10);       // true

				 lite.isNumeric ("10");    // true
				 lite.isNumber ("10");     // false

				 lite.isNumeric ("  10  ");// true
				 lite.isNumeric ("");      // false, even if ("" * 1) === 0
				 */
				isNumeric: function (val)
					{
						return !isNaN (val + Q);
					},

				/**
				 * Returns <code>true</code> if <b>obj</b> is a number.
				 *
				 * @see isNumeric
				 * @param {Object} obj    Object to be tested
				 * @return {Boolean}
				 */
				isNumber: function (obj)
					{
						return /Numb/.test (_C (obj));
					},

				/**
				 * Returns <code>true</code> if <b>obj</b> is an array.
				 *
				 * @param {Mixed} obj    Object to be tested
				 * @return {Boolean}
				 */
				isArray: function (obj)
					{
						return Array.isArray ? Array.isArray (obj) : /Array/.test (_C (obj));
					},

				/**
				 * Returns <code>true</code> if <b>obj</b> is a string.
				 *
				 * @param {Mixed} obj    Object to be tested
				 * @return {Boolean}
				 */
				isString: function (obj)
					{
						return /Stri/.test (_C (obj));
					},

				/**
				 * Returns <code>true</code> if <b>obj</b> is a boolean.
				 *
				 * @param {Mixed} obj    Object to be tested
				 * @return {Boolean}
				 */
				isBoolean: function (obj)
					{
						return /Bool/.test (_C (obj));
					},

				/**
				 * Converts anything into an array. If <b>obj</b> is an object, key/value association are obviously lost !<br/>
				 *
				 * @param {Mixed} obj Any type of object
				 * @return {Array}
				 * @example
				 lite.A ([1, 2, 3, 4]);      // [1,2,3,4]
				 lite.A (arguments);         // converts the pseudo-array 'arguments' into a real array
				 lite.A ("my string");       // ["m", "y", " ", "s", "t", "r", "i", "n", "g"]
				 lite.A (true);              // [ true ]
				 lite.A (123);               // [ 123 ]
				 lite.A ({
  x: 123,
  y: 456,
  z: "string",
  f: function () { return "hello world" }
});                         // [ 123, 456, "string", function () { return "hello world" } ]*/
				A: function (obj)
					{
						try
							{
								return L.isArray (obj) ? obj
									: L.isString (obj) ? obj.split (Q)
									: LN (obj) ? AP.slice.call (obj)
									: L.isNumber (obj) || L.isBoolean (obj) ? [obj]
									: _I (obj, function (v) { return v; }, N, true);
							}
						catch (e)
							{
								return [].dim (LN (obj)).map (function (v, i) { return obj[i]; });
							}
					},

				/**
				 * Modifies methods that return a <code>undefined</code> value in a class, in order to make them chainable. To apply the modification to native methods, their name must be specified in the <b>list</b> parameter.
				 *
				 * @param {Object}    obj                The source class or object, containing methods.
				 * @param {Boolean}    [force=false]    By default, only methods that return undefined are modified. Set this parameter to force the modification to all methods.
				 * @param {Array}    [list=[]]        String list of methods name allowing the restriction (or the definition !) of what should be modified
				 * @return {Object}
				 * @example
				 function Classe ()
				 {
				  this.f1 = function (a) { alert ("f1 a=" + a); return 123; };
				  this.f2 = function (a) { alert ("f2 a=" + a); };
				  this.f3 = function (a) { alert ("f3 a=" + a); return 789; };
				};

				 var f = lite.chainable (new Classe ());
				 var r = f.f1 ("dog").f2 ("cat").f3 ("fish");    // ERROR ! f1 returns a value and not itself

				 var f = lite.chainable (new Classe (), true);
				 var r = f.f1 ("dog").f2 ("cat").f3 ("fish");    // modifications are applied on all methods, each returning themselves

				 var f = lite.chainable (new Classe (), false, ['f1', 'f2']);   // ERROR ! f2 modified but not f1, f3 remains untouched
				 var f = lite.chainable (new Classe (), true, ['f1', 'f2']);    // the modification was done for f2 and force for f1
				 var r = f.f1 ("dog").f2 ("cat").f3 ("fish");
				 */
				chainable: function (obj, force, list)
					{
						var fn = function (f, k)
							{
								var
									a = (L.isNumber (k) ? f : k),
									c = function (fn, force)
										{
											var ptr = fn;
											return function ()
												{
													var r = fn.apply (this, arguments);
													return (r == N || force ? this : r);
												};
										};

								if (typeof (this[f] || f) == F)
									{
										this[a] = c (this[a], force);
									}
							};
						list ? list.each (fn, obj) : _I (obj, fn, obj);
						return obj;
					},

				/**
				 * Converts a HTML color into an array of base 10 values (0 to 255).
				 *
				 * @see RGBtoColor
				 * @param {String} color    HTML hexadecimal color format
				 * @return {Array}            Returned as [r, g, b ]
				 * @example
				 lite.colorToRGB ('#45B');    // [ 68, 85, 187 ]
				 lite.colorToRGB ('#4455BB'); // [ 68, 85, 187 ]
				 lite.colorToRGB ('45B');     // [ 68, 85, 187 ]
				 lite.colorToRGB ('4455BB');  // [ 68, 85, 187 ]
				 lite.colorToRGB ('7F7F7F');  // [ 127, 127, 127 ]
				 */
				colorToRGB: function (color)
					{
						color = (color || '000').replace (/#/, Q);
						return (LN (color) === 3 ? color.replace (/([\dA-F])/gi, '$&$1') : color).match (/^([\dA-F]{2})([\dA-F]{2})([\dA-F]{2})$/i).map (function (v)
						{
							return v.toInt (16);
						}).slice (1);
					},

				/**
				 * Converts values into a HTML color format.
				 *
				 * @see colorToRGB
				 * @param {Array} rgb    Array containing values (base 10) formatted as [ r, g, b ]
				 * @return {String}        Returned string are prefixed by a <b>#</b>
				 */
				RGBtoColor: function (rgb)
					{
						return '#' + rgb.map (function (v)
						{
							return v.clamp (0, 255).toString (16).lPad ("00");
						}).join (Q);
					},

				/**
				 * Applies (extend) the object <b>obj</b> with the content of object <b>list</b> if it doesn't already exists or if <b>force</b> is set to <code>true</code>.
				 *
				 * @param {Object}    obj                Obect to be extended
				 * @param {Object}    list            Object to be applied
				 * @param {Boolean}    [force=false]    Force replacement of already defined keys
				 * @return {Object}
				 * @example
				 var o = { name: "Quake", age: 9 };
				 lite.applyIf (o, { type: "cat" });          // { name: "Quake", type: "cat", age: 9 }
				 lite.applyIf (o, { name: "Doom" });         // There's no modifications as "name" is already defined
				 lite.applyIf (o, { name: "Doom" }, true);   // { name: "Doom", type: "cat", age: 9 }
				 */
				applyIf: function (obj, list, force)
					{
						_I (list, function (v, k)
						{
							(!obj[k] || force) && (obj[k] = v);
						});
						return obj;
					},

				/**
				 * Loads an external JavaScript file into the current document.
				 *
				 * @param {String}        url                Script URL (if the script is not found, no errors are returned !)
				 * @param {Function}    [onLoad]        Function to be executed as soon as the external file is loaded
				 * @param {Boolean}        [force=false]    If the script was previously loaded, set it to true to force its reload
				 * @return {DOM|Boolean} Returns the <code>script</code> tag or <code>false</code> if it was already loaded.
				 */
				includeJS: function (url, onLoad, force)
					{
						var
							s = "script",
							d = document,
							g = 'getElementsByTagName',
							scr = _a (d.createElement (s), { src: url, type: "text/javascript", onload: onLoad }, true),
							allScr = d[g] (s),
							fnd = false,
							i = 0;

						while (!force && !fnd && i < LN (allScr))
							{
								fnd = (scr.src == allScr[i++].src);
							}
						;
						return (!fnd || force ? (d[g] ('head').item (0) || d.body).appendChild (scr) : false);
					},

				/**
				 * Serialize <b>obj</b> (use <code>lite.unserialize</code> to get the reverse operation).
				 *
				 * @param {Object} obj    Object to be serialized
				 * @see unserialize
				 * @return {String}
				 */
				serialize: function (obj)
					{
						return _I (obj,function (v, k)
						{
							return (k + "=" + encodeURIComponent (v) );
						}, N, true).join ('&');
					},

				/**
				 * Unserialize <b>str</b> (which was serialized with <code>lite.serialize</code>).
				 *
				 * @param {String} str    Object to be unserialized.
				 * @see serialize
				 * @return {Object}
				 */
				unserialize: function (str, _o)
					{
						_o = {};
						str.split (/&|=/).chunk (2).each (function (v)
						{
							var b = v[1];
							_o[v[0]] = (isNaN (b) ? decodeURIComponent (unescape (b)) : +b);
						});
						return _o;
					},

				/**
				 * Provides a cross-browser "DOMContentLoaded" event.<br/>
				 * This event fires as soon as DOM is ready for action, as window.onload only gets triggered when everything is loaded (images, sounds, ...).
				 *
				 * @param {Function} fn Callback function
				 * @return {Mixed}
				 */
				onReady: function (fn)
					{
						var
							d = document,
							b = L.browser,
							n = b.name,
							v = b.version,
							o9 = (n == V[1] && v >= 9),
							e = 'addEventListener';

						return (d[e] ? d[e] ("DOMContentLoaded", fn, false)
							: n == V[2] && !o9 ? (function () { (/loaded|complete/.test (d.readyState)) ? fn () : arguments.callee.defer (1); }) ()
							: b.isIE || o9 ? (function ()
							{
								L._IEodr = function ()
									{
										fn ();
										delete L._IEodr;
									};
								d.write ("<script defer src='//:' onreadystatechange='if(this.readyState==\"complete\") lite._IEodr();'><\/script>");
							}) ()
							: N);
					},

				/**
				 * Returns the <code>k</code> value of the <code>o</code> object. If this value is undefined, an optionnal value may be provided in order to return it instead.
				 *
				 * @param {Object}    o                Object.
				 * @param {String}    k                The key to be retrieved.
				 * @param {mixed}    [def=undefined]  Default value to be returned.
				 * @return {Mixed}
				 * @member Array.prototype
				 * @name lite.get
				 * @function
				 * @example
				 var o = { name: "Quake", type: "cat", age: 9 };
				 lite.get (o, 'name');             // Quake
				 lite.get (o, 'color');            // undefined
				 lite.get (o, 'color', 'black');   // 'black'
				 */
				get: function (o, k, def)
					{
						return AP.get.call (o, k, def);
					},

				/**
				 * Returns the current timestamp.
				 *
				 * @member lite
				 * @name lite.getTS
				 * @function
				 * @return {Number}
				 */
				getTS: function ()
					{
						return +new Date;
					},

				/**
				 * Returns an incremental unique number. Of course, each time the script is reloaded, the counter is reseted.
				 *
				 * @param {Number} [seed=0] Starting number
				 * @return {Number}
				 * @member lite
				 * @name lite.genID
				 * @function
				 * @example
				 lite.genID ();      // 0
				 lite.genID ();      // 1
				 lite.genID (123);   // 123
				 lite.genID ();      // 124
				 */
				genID: (function (u)
					{
						return function (seed)
							{
								return (L.isNumber (seed) ? u = seed++ : ++u);
							};
					}) (Y)
			},


// * INTERNAL ALIASES **************************************************************************************************
			L = lite,
			_m = L._methods,
			_b = L.browser,
			_e = L.ex,
			_a = L.applyIf,
			_I = L.I,
			_A = L.A,
			_C = L.getClass;

		/**
		 * Alias of <a href='#Array_forEach/' class='_smoothscroll' rel='Array_forEach'>forEach</a>.
		 *
		 * @member Array.prototype
		 * @name each
		 * @function
		 * @see forEach
		 * @see map
		 */
		_m.Array.each = AP.forEach || _m.Array.forEach;


// * APPLICATIONS ******************************************************************************************************
		/**
		 * @class
		 * Extends native class Function
		 */
		_a (Function[P], _m.Function);

		/**
		 * @class
		 * Extends native class Array
		 */
		_a (AP, _m.Array);

		/**
		 * @class
		 * Extends native class Number
		 */
		_a (Number[P], _m.Number);

		/**
		 * @class
		 * Extends native class String
		 */
		_a (SP, _m.String);

		/**
		 * @class
		 * Extends Math
		 */
		_a (M, _m.Math);


// * BROWSER ***********************************************************************************************************
		/**
		 * <b>EXPERIMENTAL</b><br/>
		 * Browser name (or family) : 'Firefox', 'IE', 'Safari', 'Chrome', 'Opera' or 'N/A'.<br/>
		 * 'Firefox' stands for Gecko based browsers, 'Chrome' should be valid for Google Chrome and Chromium.<br/><br/>
		 * <b>WARNING ! Do not trust this information since the source is the User-Agent !</b>
		 *
		 * @member lite.browser
		 * @name name
		 * @return {String}
		 * @function
		 */
		_b.name = (function ()
			{
				return (/MSIE/.test (UA) ? V[4]		// IE + IE9
					: /chrom/i.test (UA) ? V[3]
					: /a/.__proto__ == '//' ? V[2]
					: (W.opera + Q).match (/Opera/) ? V[1]
					: NA.product == 'Gecko' && NA.vendor === Q ? V[0]
					: V.last ());
			}) ();


		/**
		 * <b>EXPERIMENTAL</b><br/>
		 * Returns <code>true</code> if the detected browser is MS Internet Explorer.
		 *
		 * @member lite.browser
		 * @return {Boolean}
		 * @name isIE

		 */
		_b.isIE = (_b.name == V[4]);


		/**
		 * <b>EXPERIMENTAL</b><br/>
		 * Current browser version. IE returns different version number depending on doctype...<br/><br/>
		 * <b>WARNING ! Do not trust this information since the source is the User-Agent !</b>
		 *
		 * @member lite.browser
		 * @return {String}
		 * @name version
		 */
		_b.version = (function (n, u)
			{
				if (_b.isIE)
					{
						return UA.match (/MSIE ([0-9.]*)/).last ();
					}
				u = UA.replace (/\((.*?)\)/g, Q).trim ().split (S);
				return ([V[3], V[2]].contains (n) ? u.epop () : u).last ().split ('/').last ();
			}) (_b.name);


		/**
		 * <b>EXPERIMENTAL</b><br/>
		 * Returns <code>true</code> if the Chrome Frame is detected.
		 *
		 * @member lite.browser
		 * @return {Boolean}
		 * @name useChromeFrame

		 */
		_b.useChromeFrame = !!W.externalHost;


// * FINAL *************************************************************************************************************

		/**
		 * @private
		 * base64 dict
		 */
		var _64 = _A ([].range (65, 91).range (97, 123).stringify () + "0123456789+/");

		// Assign lite to the global object
		W.lite = L;

// END
	}) (window);