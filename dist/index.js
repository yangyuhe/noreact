module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/MVVM.ts":
/*!*********************!*\
  !*** ./src/MVVM.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var diff_1 = __webpack_require__(/*! ./diff */ "./src/diff.ts");
var event_center_1 = __webpack_require__(/*! ./event-center */ "./src/event-center.ts");
var VNode_1 = __webpack_require__(/*! ./VNode */ "./src/VNode.ts");
var react_1 = __importDefault(__webpack_require__(/*! ./react */ "./src/react.ts"));
var refresh_1 = __webpack_require__(/*! ./refresh */ "./src/refresh.ts");
var MVVM = /** @class */ (function () {
    function MVVM($props) {
        /**组件内部的事件注册中心 */
        this.$eventRegister = {};
        /**该组件拥有的子级虚拟树 */
        this.$children = [];
        this.$isdirty = false;
        this.$refs = {};
        this.hasRenderedDom = false;
        if (toString.call($props) == '[object Object]') {
            this.$props = $props;
            this.watchObject(this.$props);
        }
    }
    /**初始化函数 */
    MVVM.prototype.onInit = function () { };
    /**渲染完成后该方法会被调用，此时elem成员变量才可以被访问到 */
    MVVM.prototype.onRendered = function () { };
    /**销毁函数 */
    MVVM.prototype.onDestroyed = function () { };
    /**向所有父级发送消息 */
    MVVM.prototype.$emitUp = function (event, data) {
        this.$root.EmitUp(event, data, this);
    };
    /**向所有子级发送消息 */
    MVVM.prototype.$emitDown = function (event, data) {
        this.$root.EmitDown(event, data, this);
    };
    /**监听事件 */
    MVVM.prototype.$on = function (event, callback) {
        if (!this.$eventRegister[event])
            this.$eventRegister[event] = [];
        this.$eventRegister[event].push(callback);
        event_center_1.RegisterEvent(event, callback);
    };
    /**发送一个全局事件 */
    MVVM.prototype.$broadcast = function (event, data) {
        event_center_1.TriggerEvent(event, this, data);
    };
    /**触发该组件的某个事件监听 */
    MVVM.prototype.$Trigger = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var cbs = this.$eventRegister[event];
        if (cbs) {
            cbs.forEach(function (cb) { return cb.apply(void 0, data); });
        }
    };
    MVVM.prototype.$ToDom = function () {
        this.hasRenderedDom = true;
        if (!this.$root)
            this.$DoRender();
        var dom = this.$root.ToDom();
        return dom;
    };
    MVVM.prototype.$ToHtml = function () {
        return this.Render().ToHtml();
    };
    MVVM.prototype.$GetRoot = function () {
        if (!this.$root)
            this.$DoRender();
        return this.$root;
    };
    /**设置该组件的子级虚拟树 */
    MVVM.prototype.$SetChildren = function (children) {
        this.$children = children;
    };
    MVVM.prototype.$Dirty = function () {
        if (!this.$isdirty) {
            this.$isdirty = true;
            refresh_1.InsertQueue(this);
        }
    };
    MVVM.prototype.$ApplyRefresh = function () {
        if (this.$isdirty) {
            react_1.default.ChangeMode('shallow');
            var old = react_1.default.target;
            react_1.default.target = this;
            var newroot = this.Render();
            react_1.default.target = old;
            react_1.default.ChangeMode('deep');
            this.$diff([this.$root], [newroot], this.$root.GetParent());
            this.$isdirty = false;
        }
    };
    MVVM.prototype.$Ref = function (name) {
        var ref = this.$refs[name];
        if (ref && !ref.IsDestroyed()) {
            if (ref.GetInstance())
                return ref.GetInstance();
            else
                return ref.GetDom() && ref.GetDom()[0];
        }
        var res = this.$root.GetRef(name);
        if (!res)
            return null;
        this.$refs[name] = res;
        if (res.GetInstance())
            return res.GetInstance();
        else
            return ref.GetDom() && res.GetDom()[0];
    };
    MVVM.prototype.$DoRender = function () {
        this.onInit();
        var keys = [];
        Object.keys(this).forEach(function (key) {
            if (!key.startsWith('$'))
                keys.push(key);
        });
        keys.length > 0 && this.watchObject(this, keys);
        var old = react_1.default.target;
        react_1.default.target = this;
        this.$root = this.Render();
        if (!this.$attachedVNode) {
            this.$attachedVNode = new VNode_1.VNode("custom");
            this.$attachedVNode.SetMvvm(this);
        }
        this.$root.SetParent(this.$attachedVNode);
        react_1.default.target = old;
        return this.$root;
    };
    MVVM.prototype.watchObject = function (obj, keys) {
        var _this = this;
        if (toString.call(obj) == '[object Object]' || toString.call(obj) == '[object Array]') {
            var watchers_1 = [];
            ((keys && keys.length > 0 && keys) || Object.keys(obj)).forEach(function (key) {
                var descriptor = Object.getOwnPropertyDescriptor(obj, key);
                if (descriptor && descriptor.configurable) {
                    var value_1 = obj[key];
                    Object.defineProperty(obj, key, {
                        get: function () {
                            if (react_1.default.target &&
                                watchers_1.indexOf(react_1.default.target)) {
                                watchers_1.push(react_1.default.target);
                            }
                            return value_1;
                        },
                        set: function (val) {
                            if (val != value_1) {
                                watchers_1.forEach(function (item) { return item.$Dirty(); });
                                value_1 = val;
                                if (toString.call(value_1) == "[object Array]")
                                    _this.watchArray(value_1, watchers_1);
                                _this.watchObject(value_1);
                            }
                        },
                        configurable: false,
                        enumerable: true
                    });
                    if (toString.call(value_1) == "[object Array]")
                        _this.watchArray(value_1, watchers_1);
                    _this.watchObject(value_1);
                }
            });
            return;
        }
    };
    MVVM.prototype.watchArray = function (arr, watchers) {
        this.overwriteArrayMethods(arr, 'pop', watchers);
        this.overwriteArrayMethods(arr, 'push', watchers);
        this.overwriteArrayMethods(arr, 'splice', watchers);
        this.overwriteArrayMethods(arr, 'unshift', watchers);
        this.overwriteArrayMethods(arr, 'shift', watchers);
    };
    MVVM.prototype.overwriteArrayMethods = function (arr, methodname, watchers) {
        var method = arr[methodname];
        if (typeof method == 'function') {
            Object.defineProperty(arr, methodname, {
                value: function () {
                    watchers.forEach(function (item) { return item.$Dirty(); });
                    return method.apply(this, arguments);
                },
                configurable: false
            });
        }
    };
    MVVM.prototype.useOld = function (oldNode, newNode) {
        if (oldNode.GetType() == 'custom') {
            var instance = oldNode.GetInstance();
            var newInstance = newNode.GetInstance();
            if (instance.$isdirty) {
                instance.$props = newInstance.$props;
                instance.watchObject(instance.$props);
                instance.$ApplyRefresh();
            }
            else {
                Object.assign(instance.$props, newInstance.$props);
            }
            return;
        }
        if (oldNode.GetType() == 'standard') {
            oldNode.ApplyAttrDiff(newNode.GetAttrs());
            this.$diff(oldNode.GetChildren(), newNode.GetChildren(), oldNode);
            return;
        }
        if (oldNode.GetType() == 'text') {
            return;
        }
    };
    MVVM.prototype.$diff = function (olds, news, parent) {
        var _this = this;
        var opers = diff_1.Diff(olds, news, MVVM.$compareVNode);
        var index = 0;
        opers.forEach(function (item) {
            if (item.state == 'old') {
                index++;
                _this.useOld(item.oldValue, item.newValue);
                return;
            }
            if (item.state == 'new') {
                if (item.newValueOrigin) {
                    _this.useOld(item.newValueOrigin, item.newValue);
                    parent.InsertVNode(item.newValueOrigin, index);
                }
                else {
                    if (_this.hasRenderedDom)
                        item.newValue.ToDom();
                    parent.InsertVNode(item.newValue, index);
                    if (_this.hasRenderedDom)
                        item.newValue.Rendered();
                }
                index++;
                return;
            }
            if (item.state == 'delete') {
                parent.RemoveVNode(item.oldValue, index, item.isdeprecated);
                if (item.isdeprecated) {
                    item.oldValue.Destroy();
                }
                return;
            }
            if (item.state == 'replace') {
                parent.RemoveVNode(item.oldValue, index, item.isdeprecated);
                if (item.isdeprecated) {
                    item.oldValue.Destroy();
                }
                if (item.newValueOrigin) {
                    _this.useOld(item.newValueOrigin, item.newValue);
                    parent.InsertVNode(item.newValueOrigin, index);
                }
                else {
                    if (_this.hasRenderedDom)
                        item.newValue.ToDom();
                    parent.InsertVNode(item.newValue, index);
                    if (_this.hasRenderedDom)
                        item.newValue.Rendered();
                }
                index++;
            }
        });
    };
    MVVM.prototype.$Rendered = function () {
        this.$root.Rendered();
        this.onRendered();
    };
    MVVM.prototype.$Destroy = function () {
        this.onDestroyed();
        this.$root.Destroy();
    };
    MVVM.prototype.$AttachVNode = function (vnode) {
        this.$attachedVNode = vnode;
    };
    MVVM.$compareVNode = function (left, right) {
        if (left.GetAttr('key') != right.GetAttr('key')) {
            return false;
        }
        if (left.GetType() != right.GetType()) {
            return false;
        }
        if (left.GetType() == 'custom') {
            if (left.GetInstance().constructor !=
                right.GetInstance().constructor) {
                return false;
            }
        }
        if (left.GetType() == 'standard') {
            if (left.GetTag() != right.GetTag())
                return false;
        }
        if (left.GetType() == 'text') {
            if (left.GetText() != right.GetText())
                return false;
        }
        return true;
    };
    return MVVM;
}());
exports.MVVM = MVVM;


/***/ }),

/***/ "./src/VNode.ts":
/*!**********************!*\
  !*** ./src/VNode.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var attribute_1 = __webpack_require__(/*! ./attribute */ "./src/attribute.ts");
var VNode = /** @class */ (function () {
    function VNode(type) {
        /**虚拟节点名称，即标准html的标签名 */
        this.tag = '';
        this.text = '';
        /**子节点 */
        this.children = [];
        /**属性集合 */
        this.attrs = {};
        /**父节点 */
        this.parent = null;
        /**是否已经被销毁 */
        this.isDestroyed = false;
        this.type = type;
    }
    VNode.prototype.SetTag = function (tag) {
        this.tag = tag;
    };
    VNode.prototype.GetTag = function () {
        return this.tag;
    };
    VNode.prototype.GetText = function () {
        return this.text;
    };
    VNode.prototype.SetText = function (text) {
        this.text = text;
    };
    VNode.prototype.SetMvvm = function (component) {
        this.mvvm = component;
    };
    VNode.prototype.GetInstance = function () {
        return this.mvvm;
    };
    VNode.prototype.GetParent = function () {
        return this.parent;
    };
    /**在索引为index位置增加一个child,index=-1表示在末尾添加，注意会引发实际的dom操作 */
    VNode.prototype.InsertVNode = function (child, index) {
        //dom操作
        var doms = child.GetDom();
        if (doms && doms.length > 0) {
            var sibling_1 = null;
            while (this.children[index]) {
                var subdoms = this.children[index].GetDom();
                if (subdoms.length > 0) {
                    sibling_1 = subdoms[0];
                    break;
                }
                else {
                    index++;
                }
            }
            if (sibling_1) {
                doms.forEach(function (dom) {
                    sibling_1.parentNode.insertBefore(dom, sibling_1);
                });
            }
            else {
                var top_1 = this.getDomUpward();
                doms.forEach(function (dom) {
                    top_1.appendChild(dom);
                });
            }
        }
        //虚拟dom操作
        this.children.splice(index, 0, child);
        child.parent = this;
    };
    VNode.prototype.getDomUpward = function () {
        if (this.type == 'standard') {
            if (this.tag == 'fragment') {
                return this.parent.getDomUpward();
            }
            else {
                return this.doms && this.doms[0];
            }
        }
        if (this.type == 'custom') {
            return this.parent.getDomUpward();
        }
        throw new Error('getDomUpward error');
    };
    /**末尾添加一个孩子节点，不包含dom操作 */
    VNode.prototype.AppendChild = function (child) {
        child.parent = this;
        this.children.push(child);
    };
    /**移除一个孩子节点，注意会引发dom操作 */
    VNode.prototype.RemoveVNode = function (child, index, domchange) {
        if (domchange === void 0) { domchange = true; }
        this.children.splice(index, 1);
        if (domchange) {
            var doms = child.GetDom();
            if (doms)
                doms.forEach(function (dom) {
                    dom.parentNode.removeChild(dom);
                });
        }
    };
    VNode.prototype.IsDestroyed = function () {
        return this.isDestroyed;
    };
    VNode.prototype.Destroy = function () {
        this.isDestroyed = true;
        if (this.type == 'custom') {
            this.mvvm.$Destroy();
        }
        this.children.forEach(function (child) {
            child.Destroy();
        });
    };
    VNode.prototype.GetChildren = function () {
        return this.children;
    };
    /**渲染完毕后的回调 */
    VNode.prototype.Rendered = function () {
        if (this.type == 'custom')
            this.mvvm.$Rendered();
        if (this.type == 'standard') {
            this.children.forEach(function (child) {
                child.Rendered();
            });
        }
    };
    VNode.prototype.GetDom = function () {
        return this.doms;
    };
    VNode.prototype.GetRef = function (name) {
        var attr = this.attrs['ref'];
        if (attr)
            return this;
        else {
            if (this.type != 'custom') {
                for (var i = 0; i < this.children.length; i++) {
                    var res = this.children[i].GetRef(name);
                    if (res) {
                        return res;
                    }
                }
            }
        }
        return null;
    };
    VNode.prototype.GetType = function () {
        return this.type;
    };
    VNode.prototype.SetAttr = function (name, value) {
        this.attrs[name] = value;
    };
    VNode.prototype.GetAttr = function (name) {
        return this.attrs[name];
    };
    VNode.prototype.GetAttrs = function () {
        return this.attrs;
    };
    VNode.prototype.SetParent = function (vnode) {
        this.parent = vnode;
    };
    VNode.prototype.ApplyAttrDiff = function (newAttrs) {
        var _this = this;
        Object.keys(this.attrs).forEach(function (key) {
            var eventName = attribute_1.GetEventAttrName(key);
            var isEvent = eventName != null;
            if (newAttrs[key] == null) {
                //删除的属性
                if (isEvent) {
                    _this.doms[0].removeEventListener(eventName, _this.attrs[key]);
                }
                else {
                    attribute_1.RemoveAttr(_this.doms[0], key, _this.attrs[key]);
                }
            }
            else {
                //已存在的属性
                if (key == 'style' &&
                    toString.call(_this.attrs.style) == '[object Object]' &&
                    toString.call(newAttrs.style) == '[object Object]') {
                    var oldStyle = _this.attrs.style;
                    var newStyle = newAttrs.style;
                    for (var key_1 in oldStyle) {
                        if (!newStyle[key_1]) {
                            _this.doms[0].style[key_1] = '';
                        }
                        else {
                            if (newStyle[key_1] != oldStyle[key_1]) {
                                _this.doms[0].style[key_1] =
                                    newStyle[key_1];
                            }
                        }
                    }
                    for (var key_2 in newStyle) {
                        if (!oldStyle[key_2]) {
                            _this.doms[0].style[key_2] =
                                newStyle[key_2];
                        }
                    }
                    return;
                }
                if (isEvent) {
                    if (_this.attrs[key] != newAttrs[key]) {
                        _this.doms[0].removeEventListener(eventName, _this.attrs[key]);
                        _this.doms[0].addEventListener(eventName, newAttrs[key]);
                    }
                }
                else {
                    if (_this.attrs[key] != newAttrs[key]) {
                        attribute_1.RemoveAttr(_this.doms[0], key, _this.attrs[key]);
                        attribute_1.ApplyAttr(_this.doms[0], key, newAttrs[key]);
                    }
                }
            }
        });
        Object.keys(newAttrs).forEach(function (key) {
            var eventName = attribute_1.GetEventAttrName(key);
            var isEvent = eventName != null;
            if (_this.attrs[key] == null) {
                //新增属性
                if (isEvent) {
                    _this.doms[0].addEventListener(eventName, newAttrs[key]);
                }
                else {
                    attribute_1.ApplyAttr(_this.doms[0], key, newAttrs[key]);
                }
            }
        });
        this.attrs = newAttrs;
    };
    VNode.prototype.ToHtml = function () {
        var _this = this;
        if (this.type == 'text')
            return this.text;
        if (this.type == 'custom') {
            var html = this.mvvm.$ToHtml();
            return html;
        }
        if (this.type == 'standard') {
            var innerhtmls_1 = [];
            if (this.tag != 'fragment') {
                innerhtmls_1.push("<" + this.tag);
                Object.keys(this.attrs).forEach(function (key) {
                    var attrStr = attribute_1.SerializeAttr(key, _this.attrs[key]);
                    if (attrStr)
                        innerhtmls_1.push(' ' + attrStr);
                });
                innerhtmls_1.push('>');
            }
            this.children.forEach(function (child) {
                var res = child.ToHtml();
                innerhtmls_1.push(res);
            });
            if (this.tag != 'fragment')
                innerhtmls_1.push("</" + this.tag + ">");
            return innerhtmls_1.join('');
        }
    };
    VNode.prototype.ToDom = function () {
        var _this = this;
        if (typeof document == 'undefined') {
            return null;
        }
        if (this.type == 'custom') {
            var doms = this.mvvm.$ToDom();
            this.doms = doms;
            return doms;
        }
        if (this.type == 'standard') {
            if (this.tag != 'fragment') {
                var elem_1 = document.createElement(this.tag);
                this.doms = [elem_1];
                Object.keys(this.attrs).forEach(function (key) {
                    var eventName = attribute_1.GetEventAttrName(key);
                    if (eventName) {
                        elem_1.addEventListener(eventName, _this.attrs[key]);
                    }
                    else
                        attribute_1.ApplyAttr(elem_1, key, _this.attrs[key]);
                });
                this.children.forEach(function (child) {
                    var doms = child.ToDom();
                    doms.forEach(function (dom) { return elem_1.appendChild(dom); });
                });
                return [elem_1];
            }
            else {
                var children_1 = [];
                this.children.forEach(function (child) {
                    var doms = child.ToDom();
                    children_1 = children_1.concat(doms);
                });
                this.doms = children_1;
                return children_1;
            }
        }
        if (this.type == 'text') {
            var text = document.createTextNode(this.text);
            this.doms = [text];
            return [text];
        }
    };
    VNode.prototype.EmitUp = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var _a, _b;
        if (this.parent) {
            if (this.parent.type == 'custom')
                (_a = this.parent.mvvm).$Trigger.apply(_a, [event].concat(data));
            (_b = this.parent).EmitUp.apply(_b, [event].concat(data));
        }
    };
    VNode.prototype.EmitDown = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        this.children.forEach(function (child) {
            var _a;
            if (child.type == 'custom') {
                (_a = child.mvvm).$Trigger.apply(_a, [event].concat(data));
            }
            child.EmitDown.apply(child, [event].concat(data));
        });
    };
    VNode.prototype.AttachDom = function (dom) {
        var _this = this;
        this.doms = [dom];
        Object.keys(this.attrs).forEach(function (key) {
            var eventName = attribute_1.GetEventAttrName(key);
            if (eventName) {
                dom.addEventListener(eventName, _this.attrs[key]);
            }
        });
    };
    return VNode;
}());
exports.VNode = VNode;


/***/ }),

/***/ "./src/attribute.ts":
/*!**************************!*\
  !*** ./src/attribute.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
exports.VNODE_ID = '__decorator__';
var $isServerRender = false;
function ServerRender(isServerRender) {
    $isServerRender = isServerRender;
}
exports.ServerRender = ServerRender;
var applyAttr = {
    style: function (elem, value) {
        if (toString.call(value) == '[object Object]') {
            for (var key in value) {
                elem.style[key] = value[key];
            }
            return true;
        }
        return false;
    },
    className: function (elem, value) {
        elem.setAttribute('class', value);
        return true;
    },
    key: function (elem, value) {
        return true;
    },
    value: function (elem, value) {
        if (elem instanceof HTMLInputElement) {
            elem.value = value;
            return true;
        }
        return false;
    }
};
var removeAttr = {
    style: function (elem, value) {
        if (toString.call(value) == '[object Object]') {
            for (var key in value) {
                elem.style[key] = '';
            }
            return true;
        }
        return false;
    },
    className: function (elem, value) {
        elem.setAttribute('class', '');
        return true;
    },
    key: function (elem, value) {
        return true;
    },
    value: function (elem, value) {
        if (elem instanceof HTMLInputElement) {
            elem.value = '';
            return true;
        }
        return false;
    }
};
var serializeAttr = (_a = {
        style: function (value) {
            if (toString.call(value) == '[object Object]') {
                var str = '';
                for (var key in value) {
                    str += key + "=" + value[key] + ";";
                }
                return "style=\"" + str + "\"";
            }
            else {
                return 'style=' + value;
            }
        },
        className: function (value) {
            return 'class=' + value;
        },
        key: function (value) {
            return '';
        }
    },
    _a[exports.VNODE_ID] = function (value) {
        if ($isServerRender)
            return exports.VNODE_ID + '=' + value;
        else
            return '';
    },
    _a);
/**toHtml方法使用 */
function SerializeAttr(name, value) {
    if (toString.call(value) == '[object Function]') {
        return '';
    }
    if (serializeAttr[name]) {
        return serializeAttr[name](value);
    }
    else {
        return name + '=' + value;
    }
}
exports.SerializeAttr = SerializeAttr;
/**toDom方法使用 */
function ApplyAttr(elem, name, value) {
    if (applyAttr[name]) {
        var res = applyAttr[name](elem, value);
        if (res)
            return;
    }
    elem.setAttribute(name, value);
}
exports.ApplyAttr = ApplyAttr;
function RemoveAttr(elem, name, value) {
    if (removeAttr[name]) {
        var res = removeAttr[name](elem, value);
        if (res)
            return;
    }
    elem.setAttribute(name, '');
}
exports.RemoveAttr = RemoveAttr;
function GetEventAttrName(attr) {
    if (/^on([A-Z][a-z]+)+$/.test(attr)) {
        return attr.slice(2).toLowerCase();
    }
    return null;
}
exports.GetEventAttrName = GetEventAttrName;


/***/ }),

/***/ "./src/diff.ts":
/*!*********************!*\
  !*** ./src/diff.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Diff(oldset, newset, compare) {
    var o2n = {};
    var n2o = {};
    var square = initSquare(oldset, newset);
    findShortest(square, oldset, newset, compare, o2n, n2o);
    var opers = getOpers(square, oldset, newset, o2n, n2o);
    opers.reverse();
    return opers;
}
exports.Diff = Diff;
function findShortest(square, oldset, newset, compare, o2n, n2o) {
    var target = square[oldset.length][newset.length];
    if (target.value != -1)
        return target.value;
    var lastnum = 0;
    var same = compare(oldset[oldset.length - 1], newset[newset.length - 1]);
    if (same) {
        lastnum = 0;
        o2n[oldset.length - 1] = newset.length - 1;
        n2o[newset.length - 1] = oldset.length - 1;
    }
    else
        lastnum = 1;
    var p1 = findShortest(square, oldset.slice(0, oldset.length - 1), newset, compare, o2n, n2o) + 1;
    var p2 = findShortest(square, oldset, newset.slice(0, newset.length - 1), compare, o2n, n2o) + 1;
    var p3 = findShortest(square, oldset.slice(0, oldset.length - 1), newset.slice(0, newset.length - 1), compare, o2n, n2o) + lastnum;
    var min = Math.min(p1, p2, p3);
    target.value = min;
    if (min == p1) {
        target.fromRow = oldset.length - 1;
        target.fromColumn = newset.length;
    }
    else {
        if (min == p2) {
            target.fromRow = oldset.length;
            target.fromColumn = newset.length - 1;
        }
        else {
            target.fromRow = oldset.length - 1;
            target.fromColumn = newset.length - 1;
        }
    }
    return target.value;
}
function initSquare(oldset, newset) {
    var square = [];
    for (var i = 0; i <= oldset.length; i++) {
        var row = [];
        for (var j = 0; j <= newset.length; j++) {
            if (i == 0) {
                row.push({ value: j, fromRow: 0, fromColumn: j - 1 });
                continue;
            }
            if (j == 0) {
                row.push({ value: i, fromRow: i - 1, fromColumn: 0 });
                continue;
            }
            row.push({ value: -1, fromRow: -1, fromColumn: -1 });
        }
        square.push(row);
    }
    return square;
}
function getOpers(square, oldset, newset, o2n, n2o) {
    var column = newset.length;
    var row = oldset.length;
    var states = [];
    while (true) {
        if (row == 0 && column == 0) {
            break;
        }
        var unit = square[row][column];
        if (unit.fromColumn == column - 1 && unit.fromRow == row - 1) {
            if (unit.value != square[row - 1][column - 1].value) {
                states.push({
                    oldValue: oldset[row - 1],
                    isdeprecated: o2n[row - 1] == null,
                    state: 'replace',
                    newValue: newset[column - 1],
                    newValueOrigin: oldset[n2o[column - 1]]
                });
            }
            else {
                states.push({
                    oldValue: oldset[row - 1],
                    state: 'old',
                    newValue: newset[column - 1]
                });
            }
            row--;
            column--;
            continue;
        }
        if (unit.fromColumn == column && unit.fromRow == row - 1) {
            states.push({ oldValue: oldset[row - 1], state: 'delete', isdeprecated: o2n[row - 1] == null });
            row--;
            continue;
        }
        if (unit.fromColumn == column - 1 && unit.fromRow == row) {
            states.push({ newValue: newset[column - 1], state: 'new', newValueOrigin: oldset[n2o[column - 1]] });
            column--;
            continue;
        }
    }
    return states;
}


/***/ }),

/***/ "./src/event-center.ts":
/*!*****************************!*\
  !*** ./src/event-center.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var events = {};
function RegisterEvent(event, func) {
    if (!events[event]) {
        events[event] = [];
    }
    events[event].push(func);
}
exports.RegisterEvent = RegisterEvent;
function TriggerEvent(event) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (events[event]) {
        events[event].forEach(function (func) {
            func.apply(void 0, args);
        });
    }
}
exports.TriggerEvent = TriggerEvent;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MVVM_1 = __webpack_require__(/*! ./MVVM */ "./src/MVVM.ts");
exports.MVVM = MVVM_1.MVVM;
var react_1 = __webpack_require__(/*! ./react */ "./src/react.ts");
exports.React = react_1.default;
var VNode_1 = __webpack_require__(/*! ./VNode */ "./src/VNode.ts");
exports.VNode = VNode_1.VNode;


/***/ }),

/***/ "./src/react.ts":
/*!**********************!*\
  !*** ./src/react.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VNode_1 = __webpack_require__(/*! ./VNode */ "./src/VNode.ts");
var attribute_1 = __webpack_require__(/*! ./attribute */ "./src/attribute.ts");
var isInBrowser = new Function('try {return this===window;}catch(e){ return false;}');
var React = /** @class */ (function () {
    function React() {
        this.counter = 0;
        this.mode = 'deep';
    }
    React.prototype.ResetCounter = function () {
        this.counter = 0;
    };
    React.prototype.createElement = function (Elem, attrs) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var allchildren = [];
        this.flatten('', children, allchildren);
        if (typeof Elem == 'string') {
            var vnode_1 = new VNode_1.VNode('standard');
            vnode_1.SetTag(Elem);
            if (!isInBrowser()) {
                vnode_1.SetAttr(attribute_1.VNODE_ID, this.counter);
                this.counter++;
            }
            if (attrs != null) {
                for (var key in attrs) {
                    vnode_1.SetAttr(key, attrs[key]);
                }
            }
            allchildren.forEach(function (child) {
                vnode_1.AppendChild(child);
            });
            return vnode_1;
        }
        else {
            var vnode = new VNode_1.VNode('custom');
            if (!isInBrowser()) {
                vnode.SetAttr(attribute_1.VNODE_ID, this.counter);
                this.counter++;
            }
            var mvvm = new Elem(attrs);
            vnode.SetMvvm(mvvm);
            mvvm.$SetChildren(allchildren);
            mvvm.$AttachVNode(vnode);
            if (this.mode == 'deep') {
                mvvm.$DoRender();
            }
            if (attrs != null) {
                for (var key in attrs) {
                    vnode.SetAttr(key, attrs[key]);
                }
            }
            return vnode;
        }
    };
    React.prototype.flatten = function (prefix, children, res) {
        var _this = this;
        children.forEach(function (child, index) {
            if (child == null)
                return;
            if (child instanceof Array) {
                _this.flatten(prefix + index + '_', child, res);
            }
            else {
                if (child instanceof VNode_1.VNode) {
                    var key = child.GetAttr('key');
                    if (key != null) {
                        res.push(child);
                    }
                    else {
                        child.SetAttr('key', prefix + index);
                        res.push(child);
                    }
                }
                else {
                    var textnode = new VNode_1.VNode('text');
                    textnode.SetText(child + '');
                    textnode.SetAttr('key', prefix + index);
                    res.push(textnode);
                }
            }
        });
    };
    React.prototype.ChangeMode = function (mode) {
        this.mode = mode;
    };
    return React;
}());
exports.default = new React();


/***/ }),

/***/ "./src/refresh.ts":
/*!************************!*\
  !*** ./src/refresh.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var queue = [];
var tempQueue = [];
var maxLoop = 10;
var counter = 0;
var promise;
function InsertQueue(mvvm) {
    if (queue.indexOf(mvvm) != -1) {
        return;
    }
    queue.push(mvvm);
    if (!promise && queue.length > 0) {
        promise = new Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            tempQueue = queue;
            queue = [];
            counter = 0;
            Refresh();
            promise = null;
        });
    }
}
exports.InsertQueue = InsertQueue;
function Refresh() {
    while (true) {
        if (counter > maxLoop) {
            throw new Error("refresh loop more than " + maxLoop);
        }
        counter++;
        tempQueue.forEach(function (root) {
            root.$ApplyRefresh();
        });
        if (queue.length == 0)
            break;
        tempQueue = queue;
        queue = [];
    }
}


/***/ })

/******/ });
//# sourceMappingURL=index.js.map