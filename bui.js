'use strict';
//    ____     ____                _   _     ____          ____      ____                   
//  /\  __\  /\  __\    /'\_/`\  /\ \/\ \  /\  __`\      /\  __`\  /\  __`\    /'\_/`\      
//  \ \ \_/_ \ \ \_/_  /\      \ \ \ \ \ \ \ \ \ \_\     \ \ \ \_\ \ \ \ \ \  /\      \     
//   \ \  __\ \ \  __\ \ \ \_/\_\ \ \ \ \ \ \ \ \  __     \ \ \  __ \ \ \ \ \ \ \ \_/\_\    
//    \ \ \_/  \ \ \_/_ \ \ \\ \ \ \ \ \_/ \ \ \ \_\ \  __ \ \ \_\ \ \ \ \_\ \ \ \ \\ \ \   
//     \ \_\    \ \____/ \ \_\\ \_\ \ `\___/  \ \____/ /\_\ \ \____/  \ \_____\ \ \_\\ \_\  
//      \/_/     \/___/   \/_/ \/_/  `\/__/    \/___/  \/_/  \/___/    \/_____/  \/_/ \/_/  
//                                                                                          
//                                                                                          
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    bui.js
 * desc:    BUI是一个富客户端应用的前端MVC框架[源于ER框架]
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */
 /**
 * 
 * 使用window.bui定义可能会导致速度下降约7倍
 */
var bui = {};

bui.lang = {};


bui.g = function(id, main) {
    if (!main || main == document || main == document.body) {
        return document.getElementById(id);
    }
    else {
        var i, len, k, v,
            childNode,
            elements,
            list,
            childlist,
            node;
        elements=[],list=[main];
        
        while(list.length){
            childNode= list.pop();
            if(!childNode) continue;
            if (childNode.id == id) {
                break;
            }
            elements.push(childNode);
            childlist = childNode.childNodes;
            if(!childlist||childlist.length<1) continue;
            for(i=0,len=childlist.length;i<len;i++){
                node = childlist[i];
                list.push(node);
            }
        }
        return (childNode.id == id ? childNode : null);
    }
};
/** 
 *事件绑定与解绑 
 */ 
bui.on = function(elem, eventName, handler) { 
    if (elem.addEventListener) { 
        elem.addEventListener(eventName, handler, false); 
    } else if (elem.attachEvent) { 
        elem.attachEvent('on' + eventName, function(){handler.call(elem)}); 
       //此处使用回调函数call()，让 this指向elem 
    } 
};
bui.un = function(elem, eventName, handler) { 
    if (elem.removeEventListener) { 
         elem.removeEventListener(eventName, handler, false); 
    } 
    if (elem.detachEvent) { 
        elem.detachEvent('on' + eventName, handler); 
    } 
};

/** 
 * 为对象绑定方法和作用域
 * @param {Function|String} handler 要绑定的函数，或者一个在作用域下可用的函
数名
 * @param {Object} obj 执行运行时this，如果不传入则运行时this为函数本身
 * @param {args* 0..n} args 函数执行时附加到执行时函数前面的参数
 *
 * @returns {Function} 封装后的函数
 */
bui.fn = function(func, scope){
    if(Object.prototype.toString.call(func)==='[object String]'){func=scope[func];}
    if(Object.prototype.toString.call(func)!=='[object Function]'){ throw 'Error "bui.fn()": "func" is null';}
    var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : null;
    return function () {
        var fn = '[object String]' == Object.prototype.toString.call(func) ? scope[func] : func,
            args = (xargs) ? xargs.concat([].slice.call(arguments, 0)) : arguments;
        return fn.apply(scope || fn, args);
    };
};

/**
 * 原型继承
 *
 * @param {Class} child 子类
 * @param {Class} parent 父类
 * @public
 */
bui.inherits = function (child, parent) {
    var key, 
        childProperty = child.prototype, 
        clazz = new Function();
    
    clazz.prototype = parent.prototype;
    child.prototype = new clazz();
    for (key in childProperty) {
        child.prototype[key] = childProperty[key];
    }
    child.prototype.constructor = child;
    //使用super在IE下会报错!!!
    child.superClass = parent;
};
/**
 * 对象扩展
 *
 * @param {Class} child 子类
 * @param {Class} parent 父类
 * @public
 */
bui.extend = function (child, parent) {
    for (var key in parent) {
        child[key] = parent[key];
    }
};
/**
 * 对象派生(不推荐!!!)
 *
 * @param {Object} obj 派生对象
 * @param {Class} clazz 派生父类
 * @public
 */
bui.derive = function(obj, clazz){    
    var i,
        me = new clazz();
    
    for(i in me){
        if(obj[i] == undefined) obj[i] = me[i];
    }
};

/**
 * 根据字符串查找对象
 *
 * @param {String} name 对象对应的字符串
 * @param {Object} opt_obj 父对象
 * @public
 */
bui.getObjectByName = function(name, opt_obj) {
    var parts = name.split('.'),
        part,
        cur = opt_obj || window;
    for ( ; part = parts.shift(); ) {
        if (cur[part] != null) {
            cur = cur[part];
        } 
        else {
            cur = null;
            break;
        }
    }
    return cur;
};

/**
 * 对一个object进行深度拷贝
 *
 * @param {Any} source 需要进行拷贝的对象.
 * @param {Array} oldArr 源对象树索引.
 * @param {Array} newArr 目标对象树索引.
 * 
 * @return {Any} 拷贝后的新对象.
 */
bui.clone = function(source, oldArr, newArr) {
    var result = source, 
        i, 
        len,
        j,
        len2,
        exist = -1;
    oldArr = oldArr || [];
    newArr = newArr || [];
    
    if (!source
        || source instanceof Number
        || source instanceof String
        || source instanceof Boolean) {
        return result;
    } 
    else if (source instanceof Date) {
        result = new Date(source.getTime());
    } 
    else if ((source instanceof Array) || ('object' == typeof source)) {
        for (j=0,len2=oldArr.length; j<len2; j++) {
            if (oldArr[j] == source) {
                exist = j;
                break;
            }
        }
        if (exist != -1) {
            result = newArr[exist];
            exist = -1;
        }
        else {
            if (source instanceof Array) {
                result = [];
                oldArr.push(source);
                newArr.push(result);
                var resultLen = 0;
                for (i = 0, len = source.length; i < len; i++) {
                    result[resultLen++] = bui.clone(source[i], oldArr, newArr);
                }
            }
            if ('object' == typeof source) {
                result = {};
                oldArr.push(source);
                newArr.push(result);
                for (i in source) {
                    if (source.hasOwnProperty(i)) {
                        result[i] = bui.clone(source[i], oldArr, newArr);
                    }
                }
            }
        }
    } 

    return result;
};

// link from Undercore.js 
// Internal recursive comparison function for `isEqual`.
bui.isEqual = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b){return a !== 0 || 1 / a == 1 / b;}
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) {return a === b;}
    if (aStack == undefined || bStack == undefined ) {
        aStack = [];
        bStack = [];
    }
    // Compare `[[Class]]` names.
    var className = Object.prototype.toString.call(a);
    if (className != Object.prototype.toString.call(b)){return false;}
    switch (className) {
        // Strings, numbers, dates, and booleans are compared by value.
        case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
        case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
        // RegExps are compared by their source patterns and flags.
        case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    
    var size = 0, 
        result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
        // Compare array lengths to determine if a deep comparison is necessary.
        size = a.length;
        result = size == b.length;
        if (result) {
            // Deep compare the contents, ignoring non-numeric properties.
            while (size--) {
                if (!(result = bui.isEqual(a[size], b[size], aStack, bStack))) break;
            }
        }
    } 
    else {
        // Objects with different constructors are not equivalent, but `Object`s
        // from different frames are.
        var aCtor = a.constructor, 
            bCtor = b.constructor;
        if (aCtor !== bCtor && !(Object.prototype.toString.call(aCtor) == '[object Function]' && (aCtor instanceof aCtor) &&
                               Object.prototype.toString.call(bCtor) == '[object Function]' && (bCtor instanceof bCtor))) {
            return false;
        }
        // Deep compare objects.
        for (var key in a) {
            if (Object.prototype.hasOwnProperty.call(a, key)) {
                // Count the expected number of properties.
                size++;
                // Deep compare each member.
                if (!(result = Object.prototype.hasOwnProperty.call(b, key) && bui.isEqual(a[key], b[key], aStack, bStack))) break;
            }
        }
        // Ensure that both objects contain the same number of properties.
        if (result) {
            for (key in b) {
                if (Object.prototype.hasOwnProperty.call(b, key) && !(size--)) break;
            }
            result = !size;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    
    return result;
};