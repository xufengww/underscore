import resArguments from '../../modules/restArguments.js';
import isFunction from '../../modules/isFunction.js';
import executeBound from '../../modules/_executeBound.js';

export default bind = resArguments(function(func,context,args){
    if(!isFunction(func)) throw new TypeError('Bind must be called on a function');
    
    var bound = resArguments(function(callingArgs){
        return executeBound(func,bound,context,this,args.concat(callingArgs));    
    });

    return bound;
});