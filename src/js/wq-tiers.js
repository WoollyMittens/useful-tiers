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
