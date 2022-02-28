/* globals moment: true, _: true */
/*eslint-env es6 */

'use strict';

export function AgeFilter () {
    return (birthday) => {
        let bday = new Date(birthday);
        let ageDifMs = Date.now() - bday.getTime();
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}

export function RegistrationDateFilter () {
    return (date) => {
        return moment(date).format('DD/MM[<br>]HH:mm');
    }
}

export function DataOraFilter () {
    return (date) => {
        return moment(date).format('DD/MM - HH:mm');
    }
}

export function DataOraSecondiFilter () {
    return (date) => {
        return moment(date).format('DD/MM - HH:mm:ss');
    }
}

export function LimitToNewFilter () {
    return (input, limit, begin) => {
        if (Math.abs(Number(limit)) === Infinity) {
            limit = Number(limit);
        } else {
            limit = parseInt(limit);
        }
        if (isNaN(limit)) return input;

        if (_.isNumber(input)) input = input.toString();
        if (!_.isArray(input) && !_.isString(input)) return input;

        begin = (!begin || isNaN(begin)) ? 0 : parseInt(begin);
        begin = (begin < 0 && begin >= -input.length) ? input.length + begin : begin;

        if (limit >= 0) {
            return input.slice(begin, begin + limit);
        } else {
            if (begin === 0) {
                return input.slice(limit, input.length);
            } else {
                return input.slice(Math.max(0, begin + limit), begin);
            }
        }
    }
}

export function  Comma2DecimalFilter () {
    return (input) => {
        let ret=(input)?input.toString().trim().replace(",","."):null;
		return parseFloat(ret);
    }
}

export function  Decimal2CommaFilter () {
    return (input) => {
        let ret=(input)?input.toString().replace(".",","):null;
        if(ret){
            var decArr=ret.split(",");
            if(decArr.length>1){
                var dec=decArr[1].length;
                if(dec===1){ret+="0";}
            }
        }
        return ret;
    }
}
