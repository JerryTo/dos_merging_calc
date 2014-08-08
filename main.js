/* 
	Destiny of Spirits - Merging Calculator
	Created by: Jerry To
	
	TODO:
	 - Add LVs to Enhancer Spirits
	 - Cleanup of code
	 
*/

var error = false;

function calculate() {
	$(".alert").alert('close'); // Closes any existing alerts
	error = false;
	
    var baseLevel = parseInt($("#baselv").val());
	var basePercent = $("#basePercent").val();
    var baseEXP = 0;
	
	/* Error Handling */
	if ($.isNumeric(baseLevel) === false) {
		$("<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button><strong>Warning!</strong> Please enter a numeric value in the Level field.</div>").insertAfter("#header");
		error = true;
		return;
	}
	
    /* Pre-merge EXP */
    for (i = 1; i <= baseLevel; i++) {
        if (i === 1) { baseEXP = 0; }
        else { baseEXP = baseEXP + (100 + (40*(i-2))); }
    }
	
    /* EXP needed for 1 LV up */
    var expNeeded = (100 + (40*(baseLevel-1)));
	
    baseEXP = Math.round(baseEXP + (expNeeded * (basePercent/100)));
    
    /* Total EXP gained from Enhancer Spirits */
    var exp = [];
    for (i = 1; i < 6; i++) {
        var str1 = "#e" + i + "_cost";
        var str2 = "#e" + i + "_rarity";
        exp[i - 1] = expGain($(str1).val(), $(str2).val(), i);
    }
    
    /* Same Element Bonus (110%) */
    for (i = 1; i < 6; i++) { 
        var str = "#same" + i;
        if ($(str).is(':checked')) {
            exp[i - 1] = exp[i - 1] * 1.1;
        }
    }
    
    var gainedEXP = Math.round(exp[0] + exp[1] + exp[2] + exp[3] + exp[4]);
    
    /* Daily Element Bonus (110%) */
    if ($("#daily").is(':checked')) {
        gainedEXP = Math.round(gainedEXP * 1.1);
    }
    
    /* Random Merge Bonus (150%) */
    if ($("#special").is(':checked')) {
        gainedEXP = Math.round(gainedEXP * 1.5);
    } 
    
    /* New Level */
    var totalEXP =  baseEXP + gainedEXP;
    var expRequired = 0;
    var newLevel = 1;
    while (totalEXP >= expRequired) {
        expRequired = expRequired + (100 + (40*(newLevel-1)));
        newLevel++;
    }
    newLevel--;
    $("#newLevel").text(newLevel);
    
    var newLVPercent = Math.floor(100 * ((100 + (40*(newLevel - 1))) - (expRequired - totalEXP))/(100 + (40*(newLevel - 1))));
    $("#leftoverEXP").text("(" + newLVPercent + "%)");
	
	/* EXP Bar */
    $("#expBar").text(newLVPercent + "%");
	$('#expBar').attr('aria-valuenow',newLVPercent);
	$('#expBar').attr('style',"width: " + newLVPercent + "%;");
	
	var str = (newLevel - baseLevel) * 100;
    $("#totalEXPGain").text((str + newLVPercent - basePercent) + "%");
    //$("#totalEXPGain").text((str + newLVPercent - basePercent) + "% [" + gainedEXP + "]"); // For research purposes
	
}

/* Creates events on click */
$(function() {
    $('#calc').click(calculate);
    $('#clear').click(clear);
});

function expGain(cost, rarity, enhancerIndex) {
	if (rarity != "NA" && isNaN(cost) && error === false) { 
		cost = 0;
		$("<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button><strong>Warning!</strong> Please enter the missing cost for the enhancer spirit.</div>").insertAfter("#header");
		error = true;
		return cost;
	}
	if (rarity === "NA" && !isNaN(cost) && error === false) { 
		cost = 0;
		$("<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button><strong>Warning!</strong> Please enter the missing rarity for the enhancer spirit.</div>").insertAfter("#header");
		error = true;
		return cost;
	}
    switch (rarity) {
		case "C":
			return lvMultiplier(cost*100, enhancerIndex);
		case "UC":
			return lvMultiplier(cost*200, enhancerIndex);
		case "R":
			return lvMultiplier(cost*300, enhancerIndex);
		case "SR":
			return lvMultiplier(cost*400, enhancerIndex);
		case "Prince":
			return 1500;
		case "Queen":
			return 3500;
		default:
			return 0;
	}
}

/* Work in progress */
function lvMultiplier(exp, enhancerIndex) {
	var str3 = "#e" + enhancerIndex + "_lv";
	var enhancerLevel = $(str3).val();
	if (enhancerLevel === "") { enhancerLevel = 1; } // If enhancer level is empty, assume it's LV 1
	for (j = 1; j < enhancerLevel; j++) {
		exp = exp * 1.3;
	}
	return exp;
}

function clear() {
	$('input').val('');
	$('select').val('NA');
	$(".alert").alert('close');
	error = false;
    $("#totalEXPGain").text("");
    $("#newLevel").text("");
    $("#leftoverEXP").text("");
	$("#sPoint").text("");
	for (k = 1; k < 6; k++) {
		restoreAll("#e" + k, "", true);
	}
}

/* When option is selected, remove inapplicable fields */
$("select").change(function() {
	var coID = "#" + $(this).attr('id').substr(0,3) + "cost";
	var raID = "#" + $(this).attr('id').substr(0,3) + "rarity";
	var selectedOption = $(this).val();
	
	if ($(coID).val() != "NA" && $(raID).val() != "NA") {
		var tempValue1 = $(coID).val();
		var tempValue2 = $(raID).val();
		mergeCost();
		restoreAll(coID, selectedOption, true);
		var tempValue3 = coID + ' option[value="' + tempValue1 +'"]';
		$(tempValue3).prop("selected", true);
		tempValue3 = raID + ' option[value="' + tempValue2 +'"]';
		$(tempValue3).prop("selected", true);
		return;
	}
	if ($(this).attr('id').substr(-4,4) === "cost") {
		if ($(raID).val() === "NA") {
			var costId = "#" + $(this).attr('id');
			restoreAll(costId, selectedOption);
			rarityRemoval(costId);
		}
	}
	else {
		var rarityId = "#" + $(this).attr('id');
		restoreAll(rarityId, selectedOption);
		costRemoval(rarityId);
	}
	mergeCost();
});

$("input").change(function() {
	mergeCost();
});

function costRemoval(rarityID) {
	var costValues = ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0"];
	var saveArray = [];
	if ($(rarityID).val() == "C") { saveArray = [0,1]; }
	if ($(rarityID).val() == "UC") { saveArray = [1,2,3]; }
	if ($(rarityID).val() == "R") { saveArray = [3,4,5]; }
	if ($(rarityID).val() == "SR") { saveArray = [6,7,8]; }
	if ($(rarityID).val() == "Prince") { saveArray = [2]; }
	if ($(rarityID).val() == "Queen") { saveArray = [4]; }
	for (i = 0; i < costValues.length; i++) {
		if (jQuery.inArray( i, saveArray ) != -1) { continue; } 
		var tempStr = rarityID.substr(0,3) + "_cost option[value='" + costValues[i] + "']";
		$(tempStr).remove();
	}
}

function restoreAll(id, selectedOption, all) {
	var costValues = ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0"];
	var rarityValues = ["C", "UC", "R", "SR", "Prince", "Queen"];
	if (id.substr(-4,4) === "cost") {
		var remove = rarityValues;
	}
	else { var remove = costValues; }
	var removeID = id.substr(0,3) + "_cost";
	
	/* If all, removes and restores all options */
	if (all === true) {
		removeID = id.substr(0,3) + "_cost";
		remove = costValues;
		for (i = 0; i < remove.length; i++) {
			var tempStr = removeID + " option[value='" + remove[i] + "']";
			$(tempStr).remove();
		}
		
		for (j = 0; j < remove.length; j++) {
			var tempStr = '<option value="' + remove[j] + '">' + remove[j] + '</option> ';
			$(removeID).append(tempStr);
		}
		
		removeID = id.substr(0,3) + "_rarity";
		remove = rarityValues;
		for (i = 0; i < remove.length; i++) {
			var tempStr = removeID + " option[value='" + remove[i] + "']";
			$(tempStr).remove();
		}
		
		for (j = 0; j < remove.length; j++) {
			var tempStr = '<option value="' + remove[j] + '">' + remove[j] + '</option> ';
			$(removeID).append(tempStr);
		}
		return true;
	}
	
	if (jQuery.inArray( selectedOption, costValues ) != -1) {
		remove = rarityValues;
		removeID = id.substr(0,3) + "_rarity";
	}
	
	/* Removes all select options of enhancer (Except NA) */
	for (i = 0; i < remove.length; i++) {
	
		/* Removes costs or rarities */
		var tempStr = removeID + " option[value='" + remove[i] + "']";
		$(tempStr).remove();
		
	}
	
	/* Restores all select options of enhancer */
	for (j = 0; j < remove.length; j++) {
	
		/* Restores costs or rarities */
		var tempStr = '<option value="' + remove[j] + '">' + remove[j] + '</option> ';
		$(removeID).append(tempStr);
		
	}
}

function rarityRemoval(costID) {

	var rarityValues = ["C", "UC", "R", "SR", "Prince", "Queen"];
	var saveArray = [];
	
	switch ($(costID).val()) {
		case "1.0":
			saveArray = [0];
			break;
		case "1.5":
			saveArray = [0,1];
			break;
		case "2.0":
			saveArray = [1,4];
			break;
		case "2.5":
			saveArray = [1,2];
			break;
		case "3.0":
			saveArray = [2,5];
			break;
		case "3.5":
			saveArray = [2];
			break;
		case "4.0":
			saveArray = [3];
			break;
		case "4.5":
			saveArray = [3];
			break;
		case "5.0":
			saveArray = [3];
			break;
		default:
			return;
	}
	
	for (i = 0; i < rarityValues.length; i++) {
		if (jQuery.inArray( i, saveArray ) != -1) { continue; } 
		var tempStr = costID.substr(0,3) + "_rarity option[value='" + rarityValues[i] + "']";
		$(tempStr).remove();
	}
}

/* Calculates the amount of Spirit Points needed for merging */
function mergeCost() {
	var str = "";
	var j = 0;
	for (i = 1; i < 6; i++) {
		str = "#e" + i + "_rarity";
		if ($(str).val() != "NA") { j++; }
	}
	var cost = ((10 * parseInt($("#baselv").val()) + 90) * j);
	if (isNaN(cost)) { cost = 0; }
	$("#sPoint").text(cost);
}