# geojson-gmap

Rendering geojson in google map. This repository is original from https://github.com/JasonSanford/geojson-google-maps, but with much more better api.

also support:

- rendering topojson to gmap
- auto calculate center point (API: `center()`)

## Install

via bower

```
bower install geojson-gmap
```

## Usage

for using this repository you will have to include Google map first

```html
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
<script type="text/javascript" src="../lib/geojson-gmap.js"></script>
```

Sample usage:

```javascript

var geojson_MultiPoint = {
    "type": "MultiPoint",
    "coordinates": [
        [-80.66252, 35.04267],
        [-80.66240, 35.04255]
    ]
};
// new a gmap ob
var geo_gmap = new GeojsonGmap();
// init the map
geo_gmap.init(document.getElementById('map'), 17, new google.maps.LatLng(35.042248, -80.662319), google.maps.MapTypeId.ROADMAP)
// rendering a raw geojson to map
geo_gmap.rawGeojson(geojson_MultiPoint)
```

## API 

#### geo_gmap.init(id, zoom, center, mapId)

Initialize the google map

- id: the target div id.
- zoom: the zoom value.
- center: center point. (example: new google.maps.LatLng(35.042248, -80.662319))
- mapId: google.maps.MapTypeId.ROADMAP.

#### geo_gmap.clearMap() 

Clear the map.

#### geo_gmap.center() 

Auto calculate map center point and setCenter to map. This will also fix zoom level.

#### geo_gmap.rawGeojson(geojson object)

Render a geojson object to the google map.

- geojson object
- style (optional) : the style you want to use in the geojson object. Default to null.

#### goe_gmap.rawTopojson(topojson object)

Render a topojson object to gmap.

- topojson object
- style (optional) : the style you want to use in the geojson object. Default to null.

## License

MIT [@chilijung](http://github.com/chilijung)
