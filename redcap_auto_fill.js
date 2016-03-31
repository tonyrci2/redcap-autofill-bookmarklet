/**
 * This is intended to be included via a scriptlet and helps auto-complete forms in REDCap for testing
 *
 * To use, open your browser's boorkmarks and create one that looks like the below.  You can replace the location of hte script
 * with your own location.  Or, if you push updates to the github repository at:
 *   https://github.com/123andy/redcap-autofill-bookmarklet
 * I will periodically update the location below with the new version
 *
 * javascript: (function () { 
 *	var jsCode = document.createElement('script'); 
 *	jsCode.setAttribute('src', 'https://med.stanford.edu/webtools/redcap/redcap_auto_fill.js');
 *	document.body.appendChild(jsCode); 
 * }());
 * 
 * Andrew Martin / Stanford University
*/


// Autocomplete a single REDCap TR
function fillRow(tr) {
	
	var date_types = Array('date_ymd', 'date_mdy', 'datetime_ymd', 'datetime_mdy', 'datetime_seconds_ymd', 'datetime_seconds_mdy');
	
	var random_words = ['Rock', 'Paper', 'Scissors'];
	
	// Check a random radio button
	var radios = $(tr).find("input[type=radio]").filter(":visible");
	if (radios.length > 0) {
		var randomnumber = Math.floor(Math.random() * radios.length);
		radios[randomnumber].checked = true;
		$(radios[randomnumber]).trigger('click').trigger('blur');
	}
	
	// Handle text inputs
	var inputs = $(tr).find("input[type=text]").each(function(i,e){
		//console.log('Input: ' + $(e).attr('name'));
		
		// Check for field-validation attribute
		var fv = $(e).attr('fv');
		
		if (fv == 'email') {
			$(e).val('test@noreply.com');
		} else if (fv == 'integer') {
			b = $(e).attr('onblur');
			parts = b.replace(/'/g,'').split(',');
			//console.log(parts);
			p1 = parseInt(parts[1]);
			p2 = parseInt(parts[2]);
			//console.log(b + ": " + p1 + " - " + p2);
			//redcap_validate(this,'1','111','soft_typed','integer',1)
			$(e).val('1');
		} else if ((date_types.indexOf(fv) != -1) && ($(e).parent().find("button[onclick^='set']").length > 0)) {
			$(e).parent().find("button").trigger('click');
		} else if (fv == 'number') {
			$(e).val('2');
		} else if (fv == 'zip' ) {
			$(e).val('55112');
		} else if (fv == 'phone') {
			$(e).val('(555) 867-5309');
		} else {
			//console.log("fv: " + fv);
			// Get a random word
			$(e).val(random_words[Math.floor(Math.random()*random_words.length)]);
		}
	});
	
	// Select a dropdown value
	var options = $(tr).find('option:not([value=""])');
	if (options.length > 0) {
		var randomnumber = Math.floor(Math.random() * options.length);
		$(options[randomnumber]).prop('selected', true);
	}
	
	// Set sliders
	var sliders = $(tr).find("div.slider:first").trigger('onmousedown').find('input').val(50);
	
	// Set textarea
	var textarea = $(tr).find('textarea').val(random_words[Math.floor(Math.random()*random_words.length)]);
	
	// Check checkboxes
	var checkboxes = $(tr).find("input[type=checkbox]").filter(":visible").filter(":not([id='__LOCKRECORD__'])");
	if (checkboxes.length > 0) {
		var randomnumber = Math.floor(Math.random() * checkboxes.length);
		$(checkboxes[randomnumber]).trigger('click');
	}
}

// Loop through all rows
var row = $("tr[sq_id]:visible:first");
if (row) {
	do {
		//console.log ("Processing row: " + $(row).attr('id'));
		if ( $(row).is(':visible') ) {
			$('html, body').animate({scrollTop: $(row).offset().top},1);
			fillRow(row);
		} else {
			//console.log ("Row is not visible");
		}
		doBranching();
		row= $(row).next();
	} while (row.length > 0);
}