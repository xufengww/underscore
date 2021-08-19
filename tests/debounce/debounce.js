import restArguments from '../../modules/restArguments.js';
import now from './now.js';

// when a sequence of calls of the returned function ends,the arguments
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is pased,the argument function will be triggered
// at the beginning of the sequence instead of at the end.

export default function debounce(func, wait, immediate) {
    var context, args, previous, timeout, result;

    var later = function () {
        var usetime = now() - previous;
        if (wait > usetime) {
            // 等待过程中有再次被触发，需再次进入等待
            timeout = setTimeout(later, wait - usetime);
        } else {
            timeout = null;
            if (!immediate) result = func.call(context, args);
            if (timeout) {
                context = args = null;
            }
        }
    }

    var debounced = restArguments(function (_args) {
        context = this;
        args = _args;
        previous = now();
        if (!timeout) {
            timeout = setTimeout(later, wait);
            if (immediate) result = func.call(context, args);
        }

        return result;

    });

    var clear = function () {
        clearTimeout(timeout);
        timeout = context = args = null;
    }

    return debounced;

}

