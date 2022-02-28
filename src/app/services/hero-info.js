/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function HeroInfoService () {
  	var self = this,
  		heroInfo = {};

  		self.setInfo = function(info){
  			if(info !== undefined && _.isObject(info))
  				heroInfo = info;
  		}

  		self.getInfo = function(){
  			return _.cloneDeep(heroInfo);
  		}
}
