/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function UserInfoService () {
  	var self = this,
  		userInfo = {};

  		self.setInfo = function(info){
  			if(info !== undefined && _.isObject(info))
  				userInfo = _.cloneDeep(info);
  		}

  		self.getInfo = function(){
        if(!_.isEmpty(userInfo)){
          return _.cloneDeep(userInfo);
        } else {
          return null;
        }
  		}

}
