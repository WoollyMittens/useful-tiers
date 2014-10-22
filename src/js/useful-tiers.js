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
