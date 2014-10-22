/*
	Source:
	van Creij, Maurice (2012). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.polyfills = {

		// enabled the use of HTML5 elements in Internet Explorer
		html5 : function () {
			var a, b, elementsList;
			elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
			if (navigator.userAgent.match(/msie/gi)) {
				for (a = 0 , b = elementsList.length; a < b; a += 1) {
					document.createElement(elementsList[a]);
				}
			}
		},

		// allow array.indexOf in older browsers
		arrayIndexOf : function () {
			if (!Array.prototype.indexOf) {
				Array.prototype.indexOf = function (obj, start) {
					for (var i = (start || 0), j = this.length; i < j; i += 1) {
						if (this[i] === obj) { return i; }
					}
					return -1;
				};
			}
		},

		// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
		querySelectorAll : function () {
			if (!document.querySelectorAll) {
				document.querySelectorAll = function (a) {
					var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
					return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
				};
			}
		},

		// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
		addEventListener : function () {
			!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
				WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
					var target = this;
					registry.unshift([target, type, listener, function (event) {
						event.currentTarget = target;
						event.preventDefault = function () { event.returnValue = false; };
						event.stopPropagation = function () { event.cancelBubble = true; };
						event.target = event.srcElement || target;
						listener.call(target, event);
					}]);
					this.attachEvent("on" + type, registry[0][3]);
				};
				WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
					for (var index = 0, register; register = registry[index]; ++index) {
						if (register[0] == this && register[1] == type && register[2] == listener) {
							return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
						}
					}
				};
				WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
					return this.fireEvent("on" + eventObject.type, eventObject);
				};
			})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
		},

		// allow console.log
		consoleLog : function () {
			var overrideTest = new RegExp('console-log', 'i');
			if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
				window.console = {};
				window.console.log = function () {
					// if the reporting panel doesn't exist
					var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
					if (!reportPanel) {
						// create the panel
						reportPanel = document.createElement('DIV');
						reportPanel.id = 'reportPanel';
						reportPanel.style.background = '#fff none';
						reportPanel.style.border = 'solid 1px #000';
						reportPanel.style.color = '#000';
						reportPanel.style.fontSize = '12px';
						reportPanel.style.padding = '10px';
						reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
						reportPanel.style.right = '10px';
						reportPanel.style.bottom = '10px';
						reportPanel.style.width = '180px';
						reportPanel.style.height = '320px';
						reportPanel.style.overflow = 'auto';
						reportPanel.style.zIndex = '100000';
						reportPanel.innerHTML = '&nbsp;';
						// store a copy of this node in the move buffer
						document.body.appendChild(reportPanel);
					}
					// truncate the queue
					var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
					// process the arguments
					for (a = 0, b = arguments.length; a < b; a += 1) {
						messages += arguments[a] + '<br/>';
					}
					// add a break after the message
					messages += '<hr/>';
					// output the queue to the panel
					reportPanel.innerHTML = messages + reportString;
				};
			}
		},

		// allows Object.create (https://gist.github.com/rxgx/1597825)
		objectCreate : function () {
			if (typeof Object.create !== "function") {
				Object.create = function (original) {
					function Clone() {}
					Clone.prototype = original;
					return new Clone();
				};
			}
		},

		// allows String.trim (https://gist.github.com/eliperelman/1035982)
		stringTrim : function () {
			if (!String.prototype.trim) {
				String.prototype.trim = function () { return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''); };
			}
			if (!String.prototype.ltrim) {
				String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
			}
			if (!String.prototype.rtrim) {
				String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
			}
			if (!String.prototype.fulltrim) {
				String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
			}
		},

		// allows localStorage support
		localStorage : function () {
			if (!window.localStorage) {
				if (/MSIE 8|MSIE 7|MSIE 6/i.test(navigator.userAgent)){
					window.localStorage = {
						getItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return null;
							}
							return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
						},
						key: function(nKeyId) {
							return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
						},
						setItem: function(sKey, sValue) {
							if (!sKey) {
								return;
							}
							document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
							this.length = document.cookie.match(/\=/g).length;
						},
						length: 0,
						removeItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return;
							}
							document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
							this.length--;
						},
						hasOwnProperty: function(sKey) {
							return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
						}
					};
					window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
				} else {
				    Object.defineProperty(window, "localStorage", new(function() {
				        var aKeys = [],
				            oStorage = {};
				        Object.defineProperty(oStorage, "getItem", {
				            value: function(sKey) {
				                return sKey ? this[sKey] : null;
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "key", {
				            value: function(nKeyId) {
				                return aKeys[nKeyId];
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "setItem", {
				            value: function(sKey, sValue) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "length", {
				            get: function() {
				                return aKeys.length;
				            },
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "removeItem", {
				            value: function(sKey) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        this.get = function() {
				            var iThisIndx;
				            for (var sKey in oStorage) {
				                iThisIndx = aKeys.indexOf(sKey);
				                if (iThisIndx === -1) {
				                    oStorage.setItem(sKey, oStorage[sKey]);
				                } else {
				                    aKeys.splice(iThisIndx, 1);
				                }
				                delete oStorage[sKey];
				            }
				            for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
				                oStorage.removeItem(aKeys[0]);
				            }
				            for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
				                aCouple = aCouples[nIdx].split(/\s*=\s*/);
				                if (aCouple.length > 1) {
				                    oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
				                    aKeys.push(iKey);
				                }
				            }
				            return oStorage;
				        };
				        this.configurable = false;
				        this.enumerable = true;
				    })());
				}
			}
		}

	};

	// startup
	useful.polyfills.html5();
	useful.polyfills.arrayIndexOf();
	useful.polyfills.querySelectorAll();
	useful.polyfills.addEventListener();
	useful.polyfills.consoleLog();
	useful.polyfills.objectCreate();
	useful.polyfills.stringTrim();
	useful.polyfills.localStorage();

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.polyfills;
	}

})();

/*
	Source:
	van Creij, Maurice (2014). "useful.tiers.js: Tiered Filtering", version 20141022, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	"use strict";

	useful.Tiers = function (model) {

		// PROPERTIES

		this.model = model;

		// METHODS

		this.start = function () {
			// create the interface
			var form = this.model.form;
			form.addEventListener('submit', this.onFormSubmitted());
			// add the fieldset
			this.fieldset = document.createElement('fieldset');
			form.appendChild(this.fieldset);
			// add the fields to the fieldset
			this.updateFieldset();
			// disable the start function so it can't be started twice
			this.start = function () {};
		};

		this.applyFilter = function () {
			// get the keyword to go with the active filter
			var element, result,
				active = this.model.active,
				keyword = (active !== 'none') ? this.model.filters[active].regex : new RegExp('');
			// filter all elements based on the keyword
			for (var a = 0, b = this.model.elements.length; a < b; a += 1) {
				element = this.model.elements[a];
				console.log(keyword, element.getAttribute('data-key'));
				result = keyword.test(element.getAttribute('data-key'));
				console.log(result);
				element.className = (result) ?
					element.className.replace(/-hide/, '-show'):
					element.className.replace(/-show/, '-hide');
			}
		};

		this.updateFieldset = function () {
			// empty the fieldser
			this.fieldset.innerHTML = '';
			// add the legend
			var legend = document.createElement('legend');
			legend.innerHTML = this.model.title;
			this.fieldset.appendChild(legend);
			// add the filter tiers to the fieldset
			var tiers = this.addSelectors(this.model.active, []);
			tiers = tiers.reverse();
			for (var a = 0, b = tiers.length; a < b; a += 1) {
				this.fieldset.appendChild(tiers[a]);
			}
		};

		this.addSelectors = function (active, selectors, previous) {
			// construct the label of the fiter tier
			var label = document.createElement('label');
			label.innerHTML = (active === 'none') ?
				this.model.labels.prefix + this.model.labels.first:
				this.model.labels.prefix + this.model.filters[active].title;
			// construct the selector of the filter tier
			var select = document.createElement('select');
			select.setAttribute('name', 'tier_' + selectors.length);
			select.addEventListener('change', this.onSelectChanged(select, active));
			// add the matching options to the selector
			var name, count = 0, option = this.addOption('none');
			select.appendChild(option);
			for (name in this.model.filters) {
				// if this is a child of the active item
				if (active === this.model.filters[name].parent) {
					// count and add the option
					count += 1;
					option = this.addOption(name, previous);
					select.appendChild(option);
				}
			}
			// if there were results
			if (count > 0) {
				// add the tier filter to the collection
				label.appendChild(select);
				selectors.push(label);
			}
			// if the parent isn't null
			if (this.model.filters[active]) {
				// recurse
				return this.addSelectors(this.model.filters[active].parent, selectors, active);
			}
			// else return the tiers
			else { return selectors; }
		};

		this.addOption = function (name, active) {
			// create the option
			var option = document.createElement('option');
			option.setAttribute('value', name);
			option.innerHTML = (name !== 'none') ? this.model.filters[name].title : this.model.labels.empty;
			option.selected = (active === name);
			return option;
		};

		// EVENTS

		this.onFormSubmitted = function () {
			var _this = this;
			return function (evt) {
				// cancel the click
				evt.preventDefault();
				// apply the filter
				_this.applyFilter();
			};
		};

		this.onSelectChanged = function (select, parent) {
			var _this = this;
			return function (evt) {
				// use the value of the section or the fallback
				_this.model.active = (select.value === _this.model.labels.empty) ? parent : select.value;
				// update the form
				_this.updateFieldset();
				// apply the filter
				_this.applyFilter();
			};
		};

		// PUBLIC

		this.reset = function () {
			// update empty
			this.update('none');
		};

		this.update = function (active) {
			// add the new active keyword
			this.model.active = active;
			// update the form
			this.updateFieldset();
			// apply the filter
			this.applyFilter();
		};

		// STARTUP

		this.start();

	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.Tiers;
	}

})();

/*
	Tiered Filtering
*/

(function (wq) {

	wq.Tiers = function (id) {

		/*
			properties
		*/

		this.id = id;
		this.active = 'none';
		this.title = 'Filter folios by:';

		this.labels = {
			'empty' : '---',
			'opener' : 'Filter',
			'closer' : 'Apply',
			'resetter' : 'Reset',
			'none' : 'Category ',

			'Research' : 'Pick from research',
			'Global' : 'Pick from global',
			'Law' : 'Pick from Law',
			'Markets' : 'Pick from markets',
			'Indexes' : 'Pick from indexes',
			'Trends' : 'Pick from trends',
			'Retail' : 'Pick from retail',
			'Investment' : 'Pick from investment',
			'Corporate' : 'Pick from corporate',
			'News' : 'Pick from news',
			'Recent' : 'Pick from recent',
			'Archive' : 'Pick from archive',

			'Demo' : 'Pick from demo',
			'Animal' : 'Pick from animal',
			'Vegetable' : 'Pick from vegetable',
			'Mineral' : 'Pick from mineral',
			'Mammal' : 'Pick from mammal',
			'Reptile' : 'Pick from reptile',
			'Bird' : 'Pick from bird',
			'Tree' : 'Pick from tree',
			'Herb' : 'Pick from herb',
			'Igneous' : 'Pick from igneous rock',
			'Sedimentary' : 'Pick from sedimentary rock',
			'Metamorphic' : 'Pick from metamorphic rock'
		};

		this.filters = {
			'Research' : { 'regex' : /.research./i, 'parent' : 'none' },
				'Global' : { 'regex' : /.global./i, 'parent' : 'Research' },
					'Investment' : { 'regex' : /.global.investment./i, 'parent' : 'Global' },
					'Retail' : { 'regex' : /.global.retail./i, 'parent' : 'Global' },
					'Indexes' : { 'regex' : /.global.indexes./i, 'parent' : 'Global' },
					'Trends' : { 'regex' : /.global.trends./i, 'parent' : 'Global' },
					'Corporate' : { 'regex' : /.corporate./i, 'parent' : 'Research' },
					'Law' : { 'regex' : /.global.law./i, 'parent' : 'Global' },
					'Markets' : { 'regex' : /.global.markets./i, 'parent' : 'Global' },
				'Cities' : { 'regex' : /.cities./i, 'parent' : 'Research' },
			'News' : { 'regex' : /.animal./i, 'parent' : 'none' },
				'Recent' : { 'regex' : /.odd./i, 'parent' : 'News' },
				'Archive' : { 'regex' : /.even./i, 'parent' : 'News' },
			'Demo' : { 'regex' : /.animal|vegetable|mineral./i, 'parent' : 'none' },
				'Animal' : { 'regex' : /.animal./i, 'parent' : 'Demo' },
					'Mammal' : { 'regex' : /.mammal./i, 'parent' : 'Animal' },
						'Mouse' : { 'regex' : /.mouse./i, 'parent' : 'Mammal' },
						'Horse' : { 'regex' : /.horse./i, 'parent' : 'Mammal' },
						'Dog' : { 'regex' : /.dog./i, 'parent' : 'Mammal' },
					'Reptile' : { 'regex' : /.reptile./i, 'parent' : 'Animal' },
						'Snake' : { 'regex' : /.snake./i, 'parent' : 'Reptile' },
						'Lizard' : { 'regex' : /.lizard./i, 'parent' : 'Reptile' },
						'Crocodile' : { 'regex' : /.crocodile./i, 'parent' : 'Reptile' },
					'Bird' : { 'regex' : /.bird./i, 'parent' : 'Animal' },
						'Emu' : { 'regex' : /.emu./i, 'parent' : 'Bird' },
						'Kookabura' : { 'regex' : /.kookabura./i, 'parent' : 'Bird' },
						'Magpie' : { 'regex' : /.magpie./i, 'parent' : 'Bird' },
				'Vegetable' : { 'regex' : /.vegetable./i, 'parent' : 'Demo' },
					'Tree' : { 'regex' : /.tree./i, 'parent' : 'Vegetable' },
						'Oak' : { 'regex' : /.oak./i, 'parent' : 'Tree' },
						'Birch' : { 'regex' : /.birch./i, 'parent' : 'Tree' },
						'Eucalypt' : { 'regex' : /.eucalypt./i, 'parent' : 'Tree' },
					'Herb' : { 'regex' : /.herb./i, 'parent' : 'Vegetable' },
						'Parsley' : { 'regex' : /.parsley./i, 'parent' : 'Herb' },
						'Sage' : { 'regex' : /.sage./i, 'parent' : 'Herb' },
						'Rosemary' : { 'regex' : /.rosemary./i, 'parent' : 'Herb' },
					'Algae' : { 'regex' : /.algae./i, 'parent' : 'Vegetable' },
						'Red' : { 'regex' : /.red./i, 'parent' : 'Algae' },
						'Green' : { 'regex' : /.green./i, 'parent' : 'Algae' },
						'Cyano' : { 'regex' : /.cyano./i, 'parent' : 'Algae' },
				'Mineral' : { 'regex' : /.mineral./i, 'parent' : 'Demo' },
					'Igneous' : { 'regex' : /.igneous./i, 'parent' : 'Mineral' },
						'Intrusive' : { 'regex' : /.intrusive./i, 'parent' : 'Igneous' },
						'Extrusive' : { 'regex' : /.extrusive./i, 'parent' : 'Igneous' },
						'Hypabyssal' : { 'regex' : /.hypabyssal./i, 'parent' : 'Igneous' },
					'Sedimentary' : { 'regex' : /.sedimentary./i, 'parent' : 'Mineral' },
						'Conglomerates' : { 'regex' : /.conglomerates./i, 'parent' : 'Sedimentary' },
						'Sandstones' : { 'regex' : /.sandstones./i, 'parent' : 'Sedimentary' },
						'Mudrocks' : { 'regex' : /.mudrocks./i, 'parent' : 'Sedimentary' },
					'Metamorphic' : { 'regex' : /.metamorphic./i, 'parent' : 'Mineral' },
						'Slaty' : { 'regex' : /.slaty./i, 'parent' : 'Metamorphic' },
						'Schistose' : { 'regex' : /.schistose./i, 'parent' : 'Metamorphic' },
						'Gneissose' : { 'regex' : /.gneissose./i, 'parent' : 'Metamorphic' }
		};

		/*
			methods
		*/

		this.init = function () {
			// create the filter icon into the header
			this.button = document.createElement('button');
			this.button.innerHTML = this.labels.opener;
			this.button.className = 'tiers-opener';
			document.getElementById('header').appendChild(this.button);
			this.button.addEventListener('click', this.onButtonClicked());
		};

		this.applyFilter = function () {
			// create regexps for the filter keywords
			var folioId, folioError, folioVisibility, hasKeyword, visibleCount = 0, thumbnails,
				visibilityTest = new RegExp(' folio-item-tiers-visible| folio-item-tiers-hidden', 'g'),
				stateError = new RegExp('state-error', ''),
				folios = document.querySelectorAll('#grid .folio-item-view, #examples .folio-item-view');
			// construct a keyword test for deepest tier
			var keywordTest = (this.active !== 'none') ?
				this.filters[this.active].regex:
				new RegExp('');
			// for all folios
			for (var a = 0, b = folios.length; a < b; a += 1) {
				// get the folio id
				folioId = folios[a].querySelectorAll('.product-id')[0].innerHTML;
				// get the folio error state
				folioError = folios[a].className;
				// test for the keyword
				hasKeyword = keywordTest.test(folioId) && !stateError.test(folioError);
				// reveal or hide the folio based on the match
				folioVisibility = (hasKeyword) ? ' folio-item-tiers-visible' : ' folio-item-tiers-hidden';
				folios[a].className = folios[a].className.replace(visibilityTest, '') + folioVisibility;
				// load the thumbnail if it wasn't
				this.showThumbnails(folios[a].getElementsByTagName('img'), hasKeyword);
				// count the visible ones
				visibleCount += (hasKeyword) ? 1 : 0;
			}
			// highlight the active filter option
			this.redrawOptions(visibleCount);
		};

		this.showThumbnails = function (images, show) {
			var image;
			// for all thumbnails
			for (var a = 0, b = images.length; a < b; a += 1) {
				image = images[a];
				if (!image.getAttribute('src') && image.getAttribute('data-src') && show) {
					image.src = image.getAttribute('data-src');
				}
			}
		};

		this.redrawOptions = function (count) {
			// TODO: notifify the user of the amount of results, if any
		};

		this.hideDialog = function () {
			var _this = this;
			this.modal.className = 'tiers-closed';
			setTimeout(function () {
				_this.modal.parentNode.removeChild(_this.modal);
			}, 500);
		};

		this.showDialog = function () {
			var _this = this;
			// create the modal container
			this.modal = document.createElement('div');
			this.modal.setAttribute('id', this.id);
			this.modal.addEventListener('click', this.onBackgroundClicked(this.modal));
			this.modal.className = 'tiers-closed';
			// create the form
			var form = document.createElement('form');
			form.addEventListener('submit', this.onFormSubmitted());
			this.modal.appendChild(form);
			// add the title
			var title = document.createElement('h2');
			title.innerHTML = this.title;
			form.appendChild(title);
			// add the fields
			this.fieldset = document.createElement('fieldset');
			form.appendChild(this.fieldset);
			this.updateFieldset();
			// add the reset button
			var resetter = document.createElement('button');
			resetter.setAttribute('type', 'reset');
			resetter.className = 'tiers-reset button blue-button';
			resetter.innerHTML = this.labels.resetter;
			resetter.addEventListener('click', this.onFormReset());
			form.appendChild(resetter);
			// add the apply button
			var closer = document.createElement('button');
			closer.setAttribute('type', 'submit');
			closer.className = 'tiers-apply button blue-button';
			closer.innerHTML = this.labels.closer;
			form.appendChild(closer);
			// add the modal to the page
			document.body.appendChild(this.modal);
			setTimeout(function () {
				_this.modal.className = 'tiers-open';
			}, 10);
		};

		this.updateFieldset = function () {
			// empty the fieldser
			this.fieldset.innerHTML = '';
			// add the filter tiers to the fieldset
			var tiers = this.addSelectors(this.active, []);
			tiers = tiers.reverse();
			for (var a = 0, b = tiers.length; a < b; a += 1) {
				this.fieldset.appendChild(tiers[a]);
			}
		};

		this.addSelectors = function (active, selectors, previous) {
			// construct the label of the fiter tier
			var label = document.createElement('label');
			label.innerHTML = this.labels[active];
			// construct the selector of the filter tier
			var select = document.createElement('select');
			select.setAttribute('name', 'tier_' + selectors.length);
			select.addEventListener('change', this.onSelectChanged(select, active));
			// add the matching options to the selector
			var name, count = 0, option = this.addOption(this.labels.empty);
			select.appendChild(option);
			for (name in this.filters) {
				// if this is a child of the active item
				if (active === this.filters[name].parent) {
					// count and add the option
					count += 1;
					option = this.addOption(name, previous);
					select.appendChild(option);
				}
			}
			// if there were results
			if (count > 0) {
				// add the tier filter to the collection
				label.appendChild(select);
				selectors.push(label);
			}
			// if the parent isn't null
			if (this.filters[active]) {
				// recurse
				return this.addSelectors(this.filters[active].parent, selectors, active);
			}
			// else return the tiers
			else { return selectors; }
		};

		this.addOption = function (name, active) {
			var option = document.createElement('option');
			option.setAttribute('value', name);
			option.innerHTML = name;
			option.selected = (active === name);
			return option;
		};

		/*
			events
		*/

		this.onBackgroundClicked = function (background) {
			var _this = this;
			return function (evt) {
				// if the background was clicked
				if (evt.target === background) {
					// close the modal window
					_this.hideDialog();
				}
			};
		};

		this.onFormSubmitted = function () {
			var _this = this;
			return function (evt) {
				// cancel the click
				evt.preventDefault();
				// apply the filter
				_this.applyFilter();
				// close the modal window
				_this.hideDialog();
			};
		};

		this.onSelectChanged = function (select, parent) {
			var _this = this;
			return function (evt) {
				// use the value of the section or the fallback
				_this.active = (select.value === _this.labels.empty) ? parent : select.value;
				// update the form
				_this.updateFieldset();
			};
		};

		this.onFormReset = function () {
			var _this = this;
			return function (evt) {
				// cancel the click
				evt.preventDefault();
				// reset the filters
				_this.active = 'none';
				// apply the filter
				_this.applyFilter();
				// close the modal window
				_this.hideDialog();
			};
		};

		this.onButtonClicked = function () {
			var _this = this;
			return function (evt) {
				// cancel the click
				evt.preventDefault();
				// open the modal window
				_this.showDialog();
			};
		};

		/*
			startup sequence
		*/

		this.init();

	};

}(window.wq = window.wq || {}));
