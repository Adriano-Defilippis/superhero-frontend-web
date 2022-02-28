/******
	this file is original from : https://raw2.github.com/JasonSanford/geojson-google-maps/master/GeoJSON.js
	Modified by : chilijung <http://github.com/chilijung>
******/

;(function() {

	var root = this;


	var GeojsonGmap = function(){
		this.currentFeature = null;
		this.infoWindow = new google.maps.InfoWindow();
	};

	root.GeojsonGmap = GeojsonGmap;

	// init gmap
	GeojsonGmap.prototype.init = function(id, zoom, center, mapId) {
		map = new google.maps.Map(id,{
			zoom: zoom,
			center: center,
			mapTypeId: mapId
		});

		this.coords_arr = [];
	}


	// clear the map
	GeojsonGmap.prototype.clearMap = function() {
		var that = this;
		this.coords_arr = [];
		if (!that.currentFeature)
			return;
		if (that.currentFeature.length){
			for (var i = 0; i < that.currentFeature.length; i++){
				if(that.currentFeature[i].length){
					for(var j = 0; j < that.currentFeature[i].length; j++){
						that.currentFeature[i][j].setMap(null);
					}
				}
				else{
					that.currentFeature[i].setMap(null);
				}
			}
		}else{
			that.currentFeature.setMap(null);
		}
		if (that.infoWindow.getMap()){
			that.infoWindow.close();
		}
	}

	// center point
	GeojsonGmap.prototype.center = function() {
		var bounds = new google.maps.LatLngBounds();
		var i;
		coords_arr = this.coords_arr;
        this.bounds = bounds;

		for (i = 0; i < coords_arr.length; i++) {
		  bounds.extend(coords_arr[i]);
		}

		map.setCenter(bounds.getCenter());
		map.fitBounds(bounds);
	}


	// render raw geojson
	GeojsonGmap.prototype.rawGeojson = function(val, style) {
		var that = this;
		try {
			  that.currentFeature = that.toMap(JSON.parse(val), style || null);
		} catch (e) {
			  that.currentFeature = that.toMap(val, style || null);
		}
		
		if (that.currentFeature.length){
			for (var i = 0; i < that.currentFeature.length; i++){
				if(that.currentFeature[i].length){
					for(var j = 0; j < that.currentFeature[i].length; j++){
						that.currentFeature[i][j].setMap(map);
						if(that.currentFeature[i][j].geojsonProperties) {
							that._setInfoWindow(that.currentFeature[i][j]);
						}
					}
				}
				else{
					that.currentFeature[i].setMap(map);
				}
				if (that.currentFeature[i].geojsonProperties) {
					that._setInfoWindow(that.currentFeature[i]);
				}
			}
		}else{
			that.currentFeature.setMap(map);
			if (that.currentFeature.geojsonProperties) {
				that._setInfoWindow(that.currentFeature);
			}
		}
	}

	GeojsonGmap.prototype.rawTopojson = function(obj, style) {

		for(key in obj.objects) {
            this.rawGeojson(topojson.feature(obj, obj.objects[key]), style)
        }
	}

	// set info
	GeojsonGmap.prototype._setInfoWindow = function(feature) {
		var that = this;
		google.maps.event.addListener(feature, "click", function(event) {
			var content = "<div id='infoBox'><strong>GeoJSON Feature Properties</strong><br />";
			for (var j in this.geojsonProperties) {
				content += j + ": " + this.geojsonProperties[j] + "<br />";
			}
			content += "</div>";
			that.infoWindow.setContent(content);
			that.infoWindow.setPosition(event.latLng);
			that.infoWindow.open(map);
		});
	}

	// convert geojson to google map format
	GeojsonGmap.prototype._geo2gmap = function( geojsonGeometry, options, geojsonProperties ){
		var that = this;
			
		var googleObj, opts = this._copy(options);
		
		switch ( geojsonGeometry.type ){
			case "Point":
				opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[1], geojsonGeometry.coordinates[0]);
				that.coords_arr.push(opts.position)
				googleObj = new google.maps.Marker(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiPoint":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[i][1], geojsonGeometry.coordinates[i][0]);
					that.coords_arr.push(opts.position)
					googleObj.push(new google.maps.Marker(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "LineString":
				var path = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var coord = geojsonGeometry.coordinates[i];
					var ll = new google.maps.LatLng(coord[1], coord[0]);
					that.coords_arr.push(ll);
					path.push(ll);
				}
				opts.path = path;
				googleObj = new google.maps.Polyline(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiLineString":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var path = [];
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var coord = geojsonGeometry.coordinates[i][j];
						var ll = new google.maps.LatLng(coord[1], coord[0]);
						that.coords_arr.push(ll);
						path.push(ll);
					}
					opts.path = path;
					googleObj.push(new google.maps.Polyline(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "Polygon":
				var paths = [];
				var exteriorDirection;
				var interiorDirection;
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var path = [];
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][1], geojsonGeometry.coordinates[i][j][0]);
						that.coords_arr.push(ll);
						path.push(ll);
					}
					if(!i){
						exteriorDirection = that._ccw(path);
						paths.push(path);
					}else if(i == 1){
						interiorDirection = that._ccw(path);
						if(exteriorDirection == interiorDirection){
							paths.push(path.reverse());
						}else{
							paths.push(path);
						}
					}else{
						if(exteriorDirection == interiorDirection){
							paths.push(path.reverse());
						}else{
							paths.push(path);
						}
					}
				}
				opts.paths = paths;
				googleObj = new google.maps.Polygon(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiPolygon":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var paths = [];
					var exteriorDirection;
					var interiorDirection;
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var path = [];
						for (var k = 0; k < geojsonGeometry.coordinates[i][j].length; k++){
							var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][k][1], geojsonGeometry.coordinates[i][j][k][0]);
							that.coords_arr.push(ll);
							path.push(ll);
						}
						if(!j){
							exteriorDirection = that._ccw(path);
							paths.push(path);
						}else if(j == 1){
							interiorDirection = that._ccw(path);
							if(exteriorDirection == interiorDirection){
								paths.push(path.reverse());
							}else{
								paths.push(path);
							}
						}else{
							if(exteriorDirection == interiorDirection){
								paths.push(path.reverse());
							}else{
								paths.push(path);
							}
						}
					}
					opts.paths = paths;
					googleObj.push(new google.maps.Polygon(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "GeometryCollection":
				googleObj = [];
				if (!geojsonGeometry.geometries){
					googleObj = that._error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
				}else{
					for (var i = 0; i < geojsonGeometry.geometries.length; i++){
						googleObj.push(that._geo2gmap(geojsonGeometry.geometries[i], opts, geojsonProperties || null));
					}
				}
				break;
				
			default:
				googleObj = this._error("Invalid GeoJSON object: Geometry object must be one of \"Point\", \"LineString\", \"Polygon\" or \"MultiPolygon\".");
		}
		
		return googleObj;
		
	};


	GeojsonGmap.prototype._error = function( message ){
		
		return {
			type: "Error",
			message: message
		};

	};

	GeojsonGmap.prototype._ccw = function( path ){
		
		var isCCW;
		var a = 0;
		for (var i = 0; i < path.length-2; i++){
			a += ((path[i+1].lat() - path[i].lat()) * (path[i+2].lng() - path[i].lng()) - (path[i+2].lat() - path[i].lat()) * (path[i+1].lng() - path[i].lng()));
		}
		if(a > 0){
			isCCW = true;
		}
		else{
			isCCW = false;
		}
		return isCCW;
	};

	GeojsonGmap.prototype._copy = function(obj){
		
		var newObj = {};
		for(var i in obj){
			if(obj.hasOwnProperty(i)){
				newObj[i] = obj[i];
			}
		}
		return newObj;
	};

	GeojsonGmap.prototype.toMap = function( geojson, options ) {

		var that = this;
		var obj;
		
		var opts = options || {};
		
		switch ( geojson.type ){
		
			case "FeatureCollection":
				if (!geojson.features){
					obj = that._error("Invalid GeoJSON object: FeatureCollection object missing \"features\" member.");
				}else{
					obj = [];
					for (var i = 0; i < geojson.features.length; i++){
						obj.push(that._geo2gmap(geojson.features[i].geometry, opts, geojson.features[i].properties));
					}
				}
				break;
			
			case "GeometryCollection":
				if (!geojson.geometries){
					obj = that._error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
				}else{
					obj = [];
					for (var i = 0; i < geojson.geometries.length; i++){
						obj.push(that._geo2gmap(geojson.geometries[i], opts));
					}
				}
				break;
			
			case "Feature":
				if (!( geojson.properties && geojson.geometry )){
					obj = that._error("Invalid GeoJSON object: Feature object missing \"properties\" or \"geometry\" member.");
				}else{
					obj = that._geo2gmap(geojson.geometry, opts, geojson.properties);
				}
				break;
			
			case "Point": case "MultiPoint": case "LineString": case "MultiLineString": case "Polygon": case "MultiPolygon":
				obj = geojson.coordinates
					? obj = that._geo2gmap(geojson, opts)
					: that._error("Invalid GeoJSON object: Geometry object missing \"coordinates\" member.");
				break;
			
			default:
				obj = that._error("Invalid GeoJSON object: GeoJSON object must be one of \"Point\", \"LineString\", \"Polygon\", \"MultiPolygon\", \"Feature\", \"FeatureCollection\" or \"GeometryCollection\".");
		
		}
		
		return obj;
	}
}).call(this);
