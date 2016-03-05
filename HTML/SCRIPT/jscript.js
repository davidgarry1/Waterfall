	var nofloorbound;
	var generalbound;
	var bound0to3;
	var bound3halfto7;
	var bound7halfto10;
	var bound10half;

	function hover() {
	    var x = document.getElementById("john");
	    x.style.background = "#666699";
	}

	function unhover() {
	    var x = document.getElementById("john");
	    x.style.background = "white";
	}

	function spin() {
	    var x = document.getElementById("a1");
	    x.style.backgroundImage = "url('CSS/IMG/spin.gif')";
	}

	function submission(id) {
	    $("#ff").show();
	    var x = document.getElementById("a1");
	    x.style.background = "white";
	    var output = "";
	    var input_symbols = cleanArray(document.getElementById("w1").value.toString().split("\n"));
	    var input_prices = removeD(cleanArray(document.getElementById("w2").value.toString().split("\n")));
	    var input_sources = cleanArray(document.getElementById("w3").value.toString().split("\n"));
	    var input_range = cleanArray(document.getElementById("s5").value.toString().split("-"));
	    var perc = parseInt(clean(document.getElementById("fop").value.toString()));
	    var perrow = parseInt(clean(document.getElementById("kk1").value.toString()));
	    var input_low, input_high;
	    if (input_range.length == 0) {
	        input_low = 0;
	        input_high = 50;
	    } else if (input_range.length == 1) {
	        input_low = parseFloat(clean(input_range[0]));
	        input_high = input_low;
	    } else {
	        input_low = parseFloat(clean(input_range[0]));
	        input_high = parseFloat(clean(input_range[1]));
	    }
	    var increment = parseFloat(clean(document.getElementById("2s5").value.toString()));
	    var input_1percent = cleanArray(document.getElementById("s6").value.toString().split("\n"));
	    var input_0percent = cleanArray(document.getElementById("s7").value.toString().split("\n"));
	    var input_choice = get_input_choice();
	    nofloorbound = parseFloat(clean(document.getElementById("n1").value.toString()));
	    generalbound = parseFloat(clean(document.getElementById("n2").value.toString()));
	    bound0to3 = parseFloat(clean(document.getElementById("n3").value.toString()));
	    bound3halfto7 = parseFloat(clean(document.getElementById("n4").value.toString()));
	    bound7halfto10 = parseFloat(clean(document.getElementById("n5").value.toString()));
	    bound10half = parseFloat(clean(document.getElementById("n6").value.toString()));
	    if (isNaN(perc)) {
	        id.innerHTML = "Error: % Sources is not a valid entry";
	    } else if (isNaN(nofloorbound)) {
	        id.innerHTML = "Error: No Floor Min &#x394 is not a valid entry";
	    } else if (isNaN(generalbound)) {
	        id.innerHTML = "Error: General Min &#x394 is not a valid entry";
	    } else if (isNaN(bound0to3)) {
	        id.innerHTML = "Error: $0.00-$3.50 Bound is not a valid entry";
	    } else if (isNaN(bound3halfto7)) {
	        id.innerHTML = "Error: $3.50-$7.00 Bound is not a valid entry";
	    } else if (isNaN(bound7halfto10)) {
	        id.innerHTML = "Error: $7.50-$10.00 Bound is not a valid entry";
	    } else if (isNaN(bound10half)) {
	        id.innerHTML = "Error: $10.00+ Bound is not a valid entry";
	    } else if (isNaN(input_low)) {
	        id.innerHTML = "Error: Range is not a valid entry";
	    } else if (isNaN(input_high)) {
	        id.innerHTML = "Error: Range is not a valid entry";
	    } else if (perrow < 1 || !(perrow === parseInt(perrow, 10))) {
	        id.innerHTML = "Error: Max tags per row is not a valid entry";
	    } else if (input_prices == null) {
	        id.innerHTML = "Error: Input price list has a non-numeric value";
	    } else if ((input_symbols.length != input_prices.length) || (input_prices.length != input_sources.length)) {
	        id.innerHTML = "Error: Input lists are not equal in length";
	    } else if ((input_symbols.length == 0)) {
	        id.innerHTML = "Error: Input lists are empty";
	    } else {
	        //store lists into tag objects
	        var l = input_symbols.length;
	        var input_objects = new Array(l);
	        for (var i = 0; i < l; i++) {
	            var temp = {
	                order: -1,
	                symbol: input_symbols[i].toString(),
	                price: input_prices[i].toString(),
	                sourcen: input_sources[i].toString()
	            };
	            input_objects[i] = temp;
	        }
	        input_objects = sortD(input_objects);
	        var fir = false;
	        //iterate through each floor bound waterfall to create
	        for (var i = input_low; i <= input_high; i += increment) {
	            var releventTags = [];
	            var releventSmallTags = [];
	            var omitTags = [];
	            if (!fir) {
	                fir = true;
	                output = output + "Floor Price: $" + strip(i) + "\n";
	            } else {
	                output = output + "\n" + "Floor Price: $" + strip(i) + "\n";
	            }
	            for (var j = 0; j < l; j++) {
	                if (isInRange(i, input_objects[j]) && (!omit(input_objects[j], input_0percent))) {
	                    if (!omit(input_objects[j], input_1percent)) {
	                        releventTags.push(input_objects[j]);
	                    } else {
	                        releventSmallTags.push(input_objects[j]);
	                    }
	                } else {
	                    omitTags.push(input_objects[j]);
	                }
	            }
	            if (input_objects.length != (releventTags.length + releventSmallTags.length + omitTags.length)) {
	                console.log("Error");
	            }

	            var orderTotalLarge = (Math.ceil((parseFloat(releventTags.length)) / (perrow)));
	            var orderTotalSmall = (Math.ceil((parseFloat(releventSmallTags.length)) / (perrow)));

	            var counter = 1;
	            for (var dg = 0; dg < releventTags.length; dg++) {
	                if (counter > orderTotalLarge) {
	                    counter = 1;
	                }
	                releventTags[dg].order = counter;
	                counter++;
	            }

	            var counter2 = 1;
	            for (var dg = 0; dg < releventSmallTags.length; dg++) {
	                if (counter2 > orderTotalSmall) {
	                    counter2 = 1;
	                }
	                releventSmallTags[dg].order = counter2;
	                counter2++;
	            }

	            var holder1;
	            if (orderTotalLarge != 0) {
	                holder1 = ((100 - orderTotalSmall * perc) % orderTotalLarge);
	            } else {
	                holder1 = 0;
	            }

	            for (var hq = 1; hq <= orderTotalLarge; hq++) {
	                var temp = "";
	                for (var q = 0; q < releventTags.length; q++) {
	                    if (releventTags[q].order == hq) {
	                        if (input_choice == "symbol") {
	                            temp += releventTags[q].symbol + ",";
	                        }
	                        if (input_choice == "price") {
	                            temp += "$" + releventTags[q].price + "," + "";
	                        }
	                        if (input_choice == "source") {
	                            temp += releventTags[q].sourcen + ",";
	                        }
	                    }
	                }
	                if (holder1 == 0) {
	                    temp = "" + parseInt((100.0 - orderTotalSmall * perc) / orderTotalLarge) + ": " + temp;
	                    temp = temp.substring(0, temp.length - 1);
	                    output += temp + "\n";
	                } else {
	                    temp = "" + parseInt((100.0 - orderTotalSmall * perc) / orderTotalLarge + 1) + ": " + temp;
	                    temp = temp.substring(0, temp.length - 1);
	                    output += temp + "\n";
	                    holder1--;
	                }
	            }

	            var holder2;
	            if (orderTotalSmall != 0) {
	                holder2 = 100 % orderTotalSmall;
	            } else {
	                holder2 = 0;
	            }

	            for (var y = 1; y <= orderTotalSmall; y++) {
	                var frog = "";
	                for (var q = 0; q < releventSmallTags.length; q++) {
	                    if (releventSmallTags[q].order == y) {
	                        if (input_choice == "symbol") {
	                            frog += releventSmallTags[q].symbol + ",";
	                        }
	                        if (input_choice == "price") {
	                            frog += "$" + releventSmallTags[q].price + "," + "";
	                        }
	                        if (input_choice == "source") {
	                            frog += releventSmallTags[q].sourcen + ",";
	                        }
	                    }
	                }
	                if (orderTotalLarge == 0) {
	                    var t1 = parseInt((100) / orderTotalSmall);
	                    if (holder2 == 0) {
	                        frog = "" + t1 + ": " + frog;
	                        frog = frog.substring(0, frog.length - 1);
	                        output += frog + "\n";

	                    } else {
	                        frog = "" + parseInt(t1 + 1) + ": " + frog;
	                        frog = frog.substring(0, frog.length - 1);
	                        holder2--;
	                        output += frog + "\n";
	                    }
	                } else {
	                    frog = "" + perc + ": " + frog.substring(0, frog.length - 1);
	                    output += frog + "\n";
	                }
	            }

	            output = output + "\n";
	            if (increment == 0.0) {
	                i = input_high + 1;
	            }
	        }

	        $("#ff").hide();
	        id.innerHTML = output;
	    }
	}

	function sortD(releventTags) {
		//Note: This has been implemented instead with a default MergeSort
		//for better effeciency on large data inputs
		//Runtime should regress from O(n^2) to O(nlogn)
		return releventTags.sort(function (a,b){return a.price - b.price});
		/*
	    var l2 = releventTags.length;
	    for (p = 0; p < l2; p++) {
	        for (k = 1; k < l2; k++) {
	            if (comp(releventTags[k - 1], releventTags[k])) {
	                var temp2 = jQuery.extend(true, {}, releventTags[k]);
	                releventTags[k] = releventTags[k - 1];
	                releventTags[k - 1] = temp2;
	            }
	        }
	    }
	    return releventTags;
	    */
	}

	function omit(taginput, slist) {
	    if (taginput != undefined) {
	        var tem = taginput.sourcen.toLowerCase();
	        for (var i = 0; i < slist.length; i++) {
	            if (tem == slist[i].toLowerCase()) {
	                return true;
	            }
	        }
	        return false;
	    }
	    return true;
	}

	function isInRange(floorOfPlacement, taginput) {
	    var floorOfTag = parseFloat(taginput.price);
	    if (floorOfTag < floorOfPlacement) {
	        return false;
	    }
	    if (floorOfTag < lowRange(floorOfPlacement)) {
	        return false;
	    }
	    if (floorOfTag > highRange(floorOfPlacement)) {
	        return false;
	    }
	    return true;
	}

	function clean(ring) {
	    while (ring.substring(0, 1) == "$") {
	        ring = ring.substring(1, ring.length);
	    }
	    while (ring.substring(ring.length - 1, ring.length) == " ") {
	        ring = ring.substring(0, ring.length - 1);
	    }
	    return ring;
	}

	function lowRange(price) {
	    if (price == 0.0) {
	        return nofloorbound;
	    } else {
	        return price + generalbound;
	    }
	}

	function highRange(price) {
	    if (price == 0.0) {
	        return bound0to3;
	    }
	    if (price < 3.5) {
	        return price + bound0to3;
	    }
	    if (price < 7.5) {
	        return price + bound3halfto7;
	    }
	    if (price < 10.5) {
	        return price + bound7halfto10;
	    }
	    return price + bound10half;
	}

	function strip(number) {
	    return (parseFloat(number).toFixed(2));
	}

	function comp(obj1, obj2) {
	    if (parseFloat(obj1.price) >= parseFloat(obj2.price)) {
	        return false;
	    }
	    return true;
	}

	function removeD(actual) {
	    var newArray = new Array();
	    for (var i = 0; i < actual.length; i++) {
	        while (actual[i].substring(0, 1) == "$") {
	            actual[i] = actual[i].substring(1, actual[i].length);
	        }
	        while (actual[i].substring(actual[i].length - 1, actual[i].length) == " ") {
	            actual[i] = actual[i].substring(0, actual[i].length - 1);
	        }
	        if (parseFloat(actual[i])) {
	            newArray.push(actual[i]);
	        } else {
	            return null;
	        }
	    }
	    return newArray;
	}

	function cleanArray(actual) {
	    var newArray = new Array();
	    for (var i = 0; i < actual.length; i++) {
	        if (actual[i]) {
	            newArray.push(actual[i]);
	        }
	    }
	    return newArray;
	}

	function get_input_choice() {
	    var inp = "";
	    if (document.getElementById("isymbol").checked) {
	        inp = "symbol";
	    } else if (document.getElementById("iprice").checked) {
	        inp = "price";
	    } else if (document.getElementById("isource").checked) {
	        inp = "source";
	    }
	    return inp;
	}