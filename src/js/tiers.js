/*
	Source:
	van Creij, Maurice (2018). "tiers.js: Tiered Filtering", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Tiers = function (config) {

	// PROPERTIES

	// METHODS

	this.init = function (config) {
		// store the configuration
		this.config = config;
		// create the interface
		var form = this.config.form;
		form.addEventListener('submit', this.onFormSubmitted.bind(this));
		// add the fieldset
		this.fieldset = document.createElement('fieldset');
		form.appendChild(this.fieldset);
		// add the fields to the fieldset
		this.updateFieldset();
		// return the object
		return this;
	};

	this.applyFilter = function () {
		// get the keyword to go with the active filter
		var element, result,
			active = this.config.active,
			keyword = (active !== 'none') ? this.config.filters[active].regex : new RegExp('');
		// filter all elements based on the keyword
		for (var a = 0, b = this.config.elements.length; a < b; a += 1) {
			element = this.config.elements[a];
			result = keyword.test(element.getAttribute('data-key'));
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
		legend.innerHTML = this.config.title;
		this.fieldset.appendChild(legend);
		// add the filter tiers to the fieldset
		var tiers = this.addSelectors(this.config.active, []);
		tiers = tiers.reverse();
		for (var a = 0, b = tiers.length; a < b; a += 1) {
			this.fieldset.appendChild(tiers[a]);
		}
	};

	this.addSelectors = function (active, selectors, previous) {
		// construct the label of the fiter tier
		var label = document.createElement('label');
		label.innerHTML = (active === 'none') ?
			this.config.labels.prefix + this.config.labels.first:
			this.config.labels.prefix + this.config.filters[active].title;
		// construct the selector of the filter tier
		var select = document.createElement('select');
		select.setAttribute('name', 'tier_' + selectors.length);
		select.addEventListener('change', this.onSelectChanged.bind(this, select, active));
		// add the matching options to the selector
		var name, count = 0, option = this.addOption('none');
		select.appendChild(option);
		for (name in this.config.filters) {
			// if this is a child of the active item
			if (active === this.config.filters[name].parent) {
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
		if (this.config.filters[active]) {
			// recurse
			return this.addSelectors(this.config.filters[active].parent, selectors, active);
		}
		// else return the tiers
		else { return selectors; }
	};

	this.addOption = function (name, active) {
		// create the option
		var option = document.createElement('option');
		option.setAttribute('value', name);
		option.innerHTML = (name !== 'none') ? this.config.filters[name].title : this.config.labels.empty;
		option.selected = (active === name);
		return option;
	};

	// EVENTS

	this.onFormSubmitted = function (evt) {
		// cancel the click
		evt.preventDefault();
		// apply the filter
		this.applyFilter();
	};

	this.onSelectChanged = function (select, parent, evt) {
		// use the value of the section or the fallback
		this.config.active = (select.value === this.config.labels.empty) ? parent : select.value;
		// update the form
		this.updateFieldset();
		// apply the filter
		this.applyFilter();
	};

	// EXTERNAL

	this.reset = function () {
		// update empty
		this.update('none');
	};

	this.update = function (active) {
		// add the new active keyword
		this.config.active = active;
		// update the form
		this.updateFieldset();
		// apply the filter
		this.applyFilter();
	};

	this.init(config);
};

// return as a require.js module
if (typeof define != 'undefined') define([], function () { return Tiers });
if (typeof module != 'undefined') module.exports = Tiers;
