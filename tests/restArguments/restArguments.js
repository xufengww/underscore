function restArguments(func,startIndex){
    startIndex = startIndex ==null?func.length - 1 : +startIndex;
    return function(){
        var length = Math.max(arguments.length - startIndex,0),
            rest = Array(length);
            index = 0;
        for(;index<length;index++){
            rest[index] = arguments[startIndex+index];
        }

        switch(startIndex){
            case 0:return func.call(this,rest);
            case 1:return func.call(this,arguments[0],rest);
            case 2: return func.call(this,arguments[0],arguments[1],rest);
        }

         var args = Array(startIndex + 1);

         for(index=0;index<args.length-1;index++){
             args[index] = arguments[index]
         }

         args[index] = rest;

         return func.apply(this,args);
    };
}