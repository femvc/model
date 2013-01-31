/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: events.js 3142 2011-03-11 03:39:12Z liyubei $
 *
 **************************************************************************/



/**
 * src/ui/events.js ~ 2011/03/02 21:06:08
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 3142 $
 * @description
 * 事件类型的定义
 **/

goog.require('ui');

goog.provide('ui.events');


/**
 * @enum {string}
 */
ui.events = {
  // 浏览器事件
  LOAD: 'load',
  CLICK: 'click',
  DBCLICK: 'dbclick',
  MOUSE_OVER: 'mouseover',
  MOUSE_OUT: 'mouseout',
  ENTER: 'enter',
  OPEN: 'open',

  // 自定义的事件
  ITEM_CLICK: 'itemclick',
  VIEWAREA_CHANGE: 'viewareachange',
  BEFORE_CHANGE: 'beforechange',
  BEFORE_QUEUE: 'beforequeue',
  AFTER_QUEUE: 'afterqueue',
  BEFORE_UPLOAD: 'beforeupload',
  AFTER_UPLOAD: 'afterupload',
  UPLOAD_SUCCESS: 'uploadsuccess',
  UPLOAD_FAILURE: 'uploadfailure',
  AFTER_DELETE: 'afterdelete',
  AFTER_RENDER: 'afterrender',
  AFTER_COLUMN_RESIZE: 'aftercolumnresize',
  AFTER_SELECT: 'afterselect',
  AFTER_SHOW: 'aftershow',
  AFTER_HIDE: 'afterhide'
};




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
