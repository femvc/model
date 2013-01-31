'use strict';
/*
 * cb-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    base/basemodel.js
 * desc:    数据模型基类
 * author:  wanghaiyang
 * date:    $Date: 2013-02-01 00:36:03 +0800 (Fri, 18 Feb 2011) $
 */

/**
 * 所有数据模型的基类
 */
base.BaseModel = function(data) {
    base.EventDispatcher.call(this);
    
    var _model = {};
    /**
     * 设置新的值，如果两个值不同，就会触发PropertyChangedEvent.
     * @param {string|object} propertyName 需要设置的属性或数据对象.
     * @param {*} value 属性的值.
     * @comment 接受`"key", value` 和 `{key: value}`两种的方式赋值.
     */
    this.set = function(propertyName, newValue) {
        var attr,
            attrs,
            changes = [],
            oldValue, 
            newValue,
            id,
            ids,
            className = Object.prototype.toString.call(propertyName);
        
        if (className == '[object Object]' && className == '[object String]') {
            return this.trigger('SET_ERROR', propertyName, newValue);
        }
        
        if (className == '[object String]') {
            attrs = {};
            attrs[propertyName] = newValue;
        }
        
        for (attr in attrs) {
            if (!Object.prototype.hasOwnProperty.call(attrs, attr)) {
                changes.push([attr, undefined, newValue]);
            }
            else if (!bui.isEqual(_model[attr], attrs[attr])){
                changes.push([attr, _model[attr], attrs[attr]]);
            }
        }
        
        // Trigger all relevant attribute changes.
        for (var i = 0, len = changes.length; i < len; i++) {
            this.trigger('change:' + changes[i][0], changes[i][1], changes[i][2]);
        }
        if (changes.length) {
            this.trigger('change');
        }
    };

    /**
     * @param {string} propertyName 属性名.
     * @return {*} 属性的值.
     */
    this.get = function(propertyName) {
        return bui.clone(_model[propertyName]);
    };
    
    bui.extend(_model, data);
};

bui.inherits(base.BaseModel, base.EventDispatcher);