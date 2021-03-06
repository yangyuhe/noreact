(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["noreact"] = factory();
	else
		root["noreact"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
var react_1 = __webpack_require__(/*! ./react */ "./src/react.ts");
var refresh_1 = __webpack_require__(/*! ./refresh */ "./src/refresh.ts");
var dev_1 = __importDefault(__webpack_require__(/*! ./dev */ "./src/dev.ts"));
var MVVM = /** @class */ (function () {
    function MVVM($props) {
        /**组件内部的事件注册中心 */
        this.$eventRegister = {};
        /**该组件拥有的子级虚拟树 */
        this.$children = [];
        this.$isdirty = false;
        this.$hasRenderedDom = false;
        this.$mountDom = null;
        this.$isDestroyed = false;
        if ($props != undefined)
            this.$props = $props;
        else
            this.$props = {};
        this.$watchObject(this.$props);
        this.$id = react_1.GetId();
    }
    /**渲染完成后该方法会被调用，此时elem成员变量才可以被访问到 */
    MVVM.prototype.$didMounted = function () { };
    /**销毁函数 */
    MVVM.prototype.$willUnMount = function () { };
    /**向所有父级发送消息 */
    MVVM.prototype.$emitUp = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = this.$root).EmitUp.apply(_a, [event].concat(data));
    };
    /**向所有子级发送消息 */
    MVVM.prototype.$emitDown = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = this.$root).EmitDown.apply(_a, [event].concat(data));
    };
    /**监听事件 */
    MVVM.prototype.$on = function (event, callback) {
        if (!this.$eventRegister[event])
            this.$eventRegister[event] = [];
        this.$eventRegister[event].push(callback);
        event_center_1.RegisterEvent(event, callback, this);
    };
    /**发送一个全局事件 */
    MVVM.prototype.$broadcast = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        event_center_1.TriggerEvent(event, data, this);
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
        if (this.$isdirty) {
            //remount时可能需要
            var root = this.$Render();
            this.$root = this.$checkNoVNode(root);
            this.$isdirty = false;
        }
        this.$hasRenderedDom = true;
        if (!this.$root)
            this.$DoRender();
        var doms = this.$root.ToDom();
        return doms;
    };
    MVVM.prototype.$ToHtml = function () {
        var root = this.$Render();
        var _root = this.$checkNoVNode(root);
        return _root.ToHtml();
    };
    MVVM.prototype.$GetRoot = function () {
        if (!this.$root)
            this.$DoRender();
        return this.$root;
    };
    MVVM.prototype.$SetChildren = function (children) {
        this.$children = children;
    };
    MVVM.prototype.$GetChildren = function () {
        return this.$children;
    };
    MVVM.prototype.$Dirty = function () {
        if (!this.$isdirty) {
            this.$isdirty = true;
            refresh_1.InsertQueue(this);
        }
    };
    MVVM.prototype.$GetDirty = function () {
        return this.$isdirty;
    };
    MVVM.prototype.$ApplyRefresh = function () {
        var _a;
        if (this.$isdirty) {
            dev_1.default.OnChange("update", [this]);
            react_1.React.ChangeMode('shallow');
            var old = react_1.React.target;
            react_1.React.target = this;
            var _newroot = this.$Render();
            var newroot = this.$checkNoVNode(_newroot);
            react_1.React.target = old;
            react_1.React.ChangeMode('deep');
            var same = MVVM.$compareVNode(this.$root, newroot);
            if (same) {
                this.$useOld(this.$root, newroot);
            }
            else {
                if (this.$hasRenderedDom) {
                    var doms = newroot.ToDom();
                    var res_1 = this.$root.GetParent().GetSiblingDom(this.$root);
                    if (res_1.isparent) {
                        (_a = res_1.dom).append.apply(_a, doms);
                    }
                    else {
                        doms.forEach(function (dom) {
                            res_1.dom.parentNode.insertBefore(dom, res_1.dom);
                        });
                    }
                    this.$root.Doms.forEach(function (dom) {
                        dom.remove();
                    });
                }
                this.$root.GetParent().isMulti = newroot.isMulti;
                newroot.SetParent(this.$root.GetParent());
                this.$root.Destroy();
                var oldmvvms = this.$root.GetAllMvvm();
                if (oldmvvms.length > 0)
                    dev_1.default.OnChange("delete", oldmvvms);
                this.$root = newroot;
                if (this.$hasRenderedDom)
                    newroot.Rendered();
                var newmvvms = newroot.GetAllMvvm();
                if (newmvvms.length > 0)
                    dev_1.default.OnChange("new", newmvvms, { isparent: true, id: this.$id });
            }
            this.$isdirty = false;
        }
    };
    MVVM.prototype.$DoRender = function () {
        var _this = this;
        var keys = [];
        Object.keys(this).forEach(function (key) {
            if (!key.startsWith('$') && _this[key] !== _this.$props)
                keys.push(key);
        });
        keys.length > 0 && this.$watchObject(this, keys);
        var old = react_1.React.target;
        react_1.React.target = this;
        var root = this.$Render();
        this.$root = this.$checkNoVNode(root);
        if (!this.$attachedVNode) {
            this.$attachedVNode = new VNode_1.VNode("custom");
            this.$attachedVNode.SetMvvm(this);
        }
        this.$attachedVNode.isMulti = this.$root.isMulti;
        this.$root.SetParent(this.$attachedVNode);
        react_1.React.target = old;
        return this.$root;
    };
    MVVM.prototype.$watchObject = function (obj, keys) {
        var _this = this;
        var isNotRef = !(obj instanceof react_1.Ref);
        var isNotVnode = !(obj instanceof VNode_1.VNode);
        var isNotMvvm = !(obj instanceof MVVM) || keys && keys.length > 0;
        var isObj = toString.call(obj) == '[object Object]' && isNotRef && isNotVnode && isNotMvvm;
        var isArr = toString.call(obj) == '[object Array]';
        if (isObj || isArr) {
            var watchers_1 = [];
            ((keys && keys.length > 0 && keys) || Object.keys(obj)).forEach(function (key) {
                var descriptor = Object.getOwnPropertyDescriptor(obj, key);
                if (descriptor && descriptor.configurable) {
                    var value_1 = obj[key];
                    Object.defineProperty(obj, key, {
                        get: function () {
                            if (react_1.React.target &&
                                watchers_1.indexOf(react_1.React.target)) {
                                watchers_1.push(react_1.React.target);
                            }
                            return value_1;
                        },
                        set: function (val) {
                            if (val != value_1) {
                                watchers_1.forEach(function (item) { return item.$Dirty(); });
                                value_1 = val;
                                if (toString.call(value_1) == "[object Array]")
                                    _this.$watchArray(value_1, watchers_1);
                                _this.$watchObject(value_1);
                            }
                        },
                        configurable: false,
                        enumerable: true
                    });
                    if (toString.call(value_1) == "[object Array]")
                        _this.$watchArray(value_1, watchers_1);
                    _this.$watchObject(value_1);
                }
            });
            return;
        }
    };
    MVVM.prototype.$watchArray = function (arr, watchers) {
        var oldproto = Object.getPrototypeOf(arr);
        if (oldproto && oldproto.$marked == 'noreact') {
            return;
        }
        var proto = this.getArrayProto(arr, watchers);
        Object.setPrototypeOf(arr, proto);
        Object.setPrototypeOf(proto, oldproto);
    };
    MVVM.prototype.$useOld = function (oldNode, newNode) {
        if (oldNode.GetType() == 'custom') {
            var instance = oldNode.GetMvvm();
            var newInstance = newNode.GetMvvm();
            instance.$resetProps(newInstance.$props);
            var samechildren = (instance.$children === newInstance.$children) || instance.$children.length == 0 && newInstance.$children.length == 0;
            if (!samechildren) {
                instance.$SetChildren(newInstance.$children);
                instance.$isdirty = true;
            }
            if (instance.$isdirty) {
                instance.$ApplyRefresh();
            }
            return;
        }
        if (oldNode.GetType() == 'standard' || oldNode.GetType() == 'fragment') {
            if (oldNode.GetType() == 'standard')
                oldNode.ApplyAttrDiff(newNode.GetAttrs());
            this.$diff(oldNode.GetChildren(), newNode.GetChildren(), oldNode);
            return;
        }
        if (oldNode.GetType() == 'text') {
            return;
        }
    };
    MVVM.prototype.$IsParentOf = function (mvvm) {
        var parentNode = mvvm.$attachedVNode.GetParent();
        while (parentNode) {
            if (parentNode.GetMvvm() == this) {
                return true;
            }
            parentNode = parentNode.GetParent();
        }
        return false;
    };
    MVVM.prototype.$diff = function (olds, news, parent) {
        var _this = this;
        var opers = diff_1.Diff(olds, news, MVVM.$compareVNode);
        var index = 0;
        opers.forEach(function (item) {
            if (item.state == 'old') {
                index++;
                _this.$useOld(item.oldValue, item.newValue);
                return;
            }
            if (item.state == 'new') {
                if (item.newValueOrigin) {
                    _this.$useOld(item.newValueOrigin, item.newValue);
                    parent.InsertVNode(item.newValueOrigin, index, _this.$hasRenderedDom);
                }
                else {
                    if (_this.$hasRenderedDom) {
                        item.newValue.ToDom();
                    }
                    parent.InsertVNode(item.newValue, index, _this.$hasRenderedDom);
                    _this.$devNew(item.newValue, index);
                    if (_this.$hasRenderedDom)
                        item.newValue.Rendered();
                }
                index++;
                return;
            }
            if (item.state == 'delete') {
                parent.RemoveVNode(item.oldValue, index, _this.$hasRenderedDom && item.isdeprecated);
                _this.$devDelete(item.oldValue);
                if (item.isdeprecated) {
                    item.oldValue.Destroy();
                }
                return;
            }
            if (item.state == 'replace') {
                parent.RemoveVNode(item.oldValue, index, _this.$hasRenderedDom && item.isdeprecated);
                _this.$devDelete(item.oldValue);
                if (item.isdeprecated) {
                    item.oldValue.Destroy();
                }
                if (item.newValueOrigin) {
                    _this.$useOld(item.newValueOrigin, item.newValue);
                    parent.InsertVNode(item.newValueOrigin, index, _this.$hasRenderedDom);
                }
                else {
                    if (_this.$hasRenderedDom)
                        item.newValue.ToDom();
                    parent.InsertVNode(item.newValue, index, _this.$hasRenderedDom);
                    _this.$devNew(item.newValue, index);
                    if (_this.$hasRenderedDom)
                        item.newValue.Rendered();
                }
                index++;
            }
        });
    };
    MVVM.prototype.$devDelete = function (vnode) {
        var mvvms = vnode.GetAllMvvm();
        if (mvvms.length > 0) {
            dev_1.default.OnChange("delete", mvvms);
        }
    };
    MVVM.prototype.$devNew = function (vnode, index) {
        var mvvms = vnode.GetAllMvvm();
        if (mvvms.length > 0) {
            var nextmvvm = null;
            var parent_1 = vnode.GetParent();
            if (parent_1.GetChildren().length - 1 > index) {
                var nextsibling = parent_1.GetChildren()[index + 1];
                nextmvvm = nextsibling.GetFirstChildMvvm();
                if (nextmvvm)
                    dev_1.default.OnChange("new", mvvms, { isparent: false, id: nextmvvm.$id });
            }
            if (!nextmvvm)
                dev_1.default.OnChange("new", mvvms, { isparent: true, id: parent_1.GetNearestAncestorMvvm().$id });
        }
    };
    MVVM.prototype.$resetProps = function (props) {
        var _this = this;
        if (this.$props && Object.prototype.toString.call(this.$props) == "[object Object]") {
            if (props && Object.prototype.toString.call(props) == "[object Object]") {
                var oldkeys_1 = Object.keys(this.$props);
                var newkeys_1 = Object.keys(props);
                oldkeys_1.forEach(function (key) {
                    if (newkeys_1.indexOf(key) != -1) {
                        _this.$setProp(key, props[key]);
                    }
                    else {
                        _this.$props[key] = undefined;
                    }
                });
                newkeys_1.forEach(function (key) {
                    if (oldkeys_1.indexOf(key) == -1) {
                        _this.$props[key] = props[key];
                        _this.$watchObject(_this.$props, [key]);
                    }
                });
            }
        }
    };
    MVVM.prototype.$setProp = function (key, value) {
        var oldvalue = this.$props[key];
        if (typeof oldvalue == 'function' && typeof value == 'function') {
            if (typeof oldvalue.prototype != 'undefined' && typeof value.prototype != 'undefined') {
                if (typeof oldvalue.toString == 'function' && typeof value.toString == 'function' && oldvalue.toString() == value.toString()) {
                    return;
                }
            }
            this.$props[key] = value;
            return;
        }
        if (Object.prototype.toString.call(oldvalue) == '[object RegExp]' && Object.prototype.toString.call(value) == '[object RegExp]' && oldvalue.toString() == value.toString()) {
            return;
        }
        this.$props[key] = value;
    };
    MVVM.prototype.$checkNoVNode = function (value) {
        if (value instanceof VNode_1.VNode)
            return value;
        if (value && (typeof value.toString == 'function')) {
            var str = value.toString();
            var textnode = new VNode_1.VNode("text");
            textnode.SetText(str);
            textnode.SetAttr("key", "$1");
            return textnode;
        }
        throw new Error("$Render function return invalid value");
    };
    MVVM.prototype.$Rendered = function () {
        this.$isDestroyed = false;
        this.$root.Rendered();
        this.$didMounted();
    };
    MVVM.prototype.$Destroy = function () {
        this.$isDestroyed = true;
        this.$willUnMount();
        this.$root.Destroy();
    };
    MVVM.prototype.$IsDestroyed = function () {
        return this.$isDestroyed;
    };
    MVVM.prototype.$AttachVNode = function (vnode) {
        this.$attachedVNode = vnode;
    };
    MVVM.prototype.$AppendTo = function (elem) {
        var dom;
        if (typeof elem == 'string') {
            dom = document.querySelector(elem);
        }
        else {
            dom = elem;
        }
        dom.append.apply(dom, this.$ToDom());
        this.$mountDom = dom;
        this.$Rendered();
        dev_1.default.AddMvvm(this);
    };
    MVVM.prototype.$GetMountDom = function () {
        return this.$mountDom;
    };
    MVVM.prototype.$GetAttachedVNode = function () {
        return this.$attachedVNode;
    };
    MVVM.$compareVNode = function (left, right) {
        if (left.GetAttr('key') != right.GetAttr('key')) {
            return false;
        }
        if (left.GetType() != right.GetType()) {
            return false;
        }
        if (left.GetType() == 'custom') {
            if (left.GetMvvm().constructor !=
                right.GetMvvm().constructor) {
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
    MVVM.prototype.$GetProps = function () {
        return this.$props;
    };
    MVVM.prototype.getArrayProto = function (arr, watchers) {
        var _this = this;
        var oldpush = arr.push;
        var oldpop = arr.pop;
        var oldsplice = arr.splice;
        var oldshift = arr.shift;
        var oldunshift = arr.unshift;
        var method = function (name, func, args) {
            watchers.forEach(function (item) { return item.$Dirty(); });
            var res = func.apply(arr, Array.prototype.slice.call(args));
            if (name == "push" || name == "unshift") {
                _this.$watchObject(arr);
            }
            return res;
        };
        return {
            $marked: "noreact",
            push: function () {
                return method("push", oldpush, arguments);
            },
            pop: function () {
                return method("pop", oldpop, arguments);
            },
            splice: function () {
                return method("slice", oldsplice, arguments);
            },
            shift: function () {
                return method("shift", oldshift, arguments);
            },
            unshift: function () {
                return method("unshift", oldunshift, arguments);
            }
        };
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
var react_1 = __webpack_require__(/*! ./react */ "./src/react.ts");
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
        /**是否是多dom节点 */
        this.isMulti = false;
        this.type = type;
    }
    Object.defineProperty(VNode.prototype, "Doms", {
        get: function () {
            if (this.type == "standard" || this.type == "text")
                return [this.dom];
            if (this.type == "fragment") {
                var doms_1 = [];
                this.children.forEach(function (child) {
                    doms_1 = doms_1.concat(child.Doms);
                });
                return doms_1;
            }
            if (this.type == "custom")
                return this.mvvm.$GetRoot().Doms;
        },
        enumerable: true,
        configurable: true
    });
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
    VNode.prototype.GetMvvm = function () {
        return this.mvvm;
    };
    VNode.prototype.GetParent = function () {
        return this.parent;
    };
    VNode.prototype.InsertVNode = function (child, index, domchange) {
        var _a;
        //虚拟dom操作
        this.children.splice(index, 0, child);
        child.parent = this;
        if (domchange) {
            var res_1 = this.GetSiblingDom(child);
            var doms = child.Doms;
            if (res_1.isparent) {
                (_a = res_1.dom).append.apply(_a, doms);
            }
            else {
                doms.forEach(function (dom) {
                    res_1.dom.parentNode.insertBefore(dom, res_1.dom);
                });
            }
        }
    };
    //child是当前节点的子节点，获取child的dom，如果没有就找child后的相邻节点的dom，如果都没有就返回父节点
    VNode.prototype.GetSiblingDom = function (child) {
        if (this.type == 'custom') {
            if (this.parent)
                return this.parent.GetSiblingDom(this);
            return { dom: this.mvvm.$GetMountDom(), isparent: true };
        }
        var index = this.children.indexOf(child);
        index++;
        while (index < this.children.length) {
            var c = this.children[index];
            var doms = c.Doms;
            if (doms.length > 0)
                return { dom: doms[0], isparent: false };
            index++;
        }
        if (this.isMulti)
            return this.parent.GetSiblingDom(this);
        return { dom: this.dom, isparent: true };
    };
    /**移除一个孩子节点，注意会引发dom操作 */
    VNode.prototype.RemoveVNode = function (child, index, domchange) {
        if (domchange === void 0) { domchange = true; }
        this.children.splice(index, 1);
        if (domchange) {
            var doms = child.Doms;
            if (doms)
                doms.forEach(function (dom) {
                    dom.parentNode.removeChild(dom);
                });
        }
    };
    VNode.prototype.SetChildren = function (children) {
        var _this = this;
        children.forEach(function (child) {
            child.parent = _this;
        });
        this.children = children;
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
        if (this.type == 'standard' || this.type == 'fragment') {
            this.children.forEach(function (child) {
                child.Rendered();
            });
        }
        if (this.attrs['ref'] instanceof react_1.Ref) {
            if (this.type == "standard")
                this.attrs['ref'].current = this.dom;
            else {
                if (this.type == "custom") {
                    this.attrs['ref'].current = this.mvvm;
                }
            }
        }
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
                    _this.dom.removeEventListener(eventName, _this.attrs[key]);
                }
                else {
                    attribute_1.RemoveAttr(_this.dom, key, _this.attrs[key]);
                }
            }
            else {
                //已存在的属性
                if (key == 'style' &&
                    toString.call(_this.attrs.style) == '[object Object]' &&
                    toString.call(newAttrs.style) == '[object Object]') {
                    var oldStyle_1 = _this.attrs.style;
                    var newStyle_1 = newAttrs.style;
                    Object.keys(oldStyle_1).forEach(function (k) {
                        if (!newStyle_1[k]) {
                            _this.dom.style[k] = '';
                        }
                        else {
                            if (newStyle_1[k] != oldStyle_1[k]) {
                                _this.dom.style[k] =
                                    newStyle_1[k];
                            }
                        }
                    });
                    Object.keys(newStyle_1).forEach(function (k) {
                        if (!oldStyle_1[k]) {
                            _this.dom.style[k] =
                                newStyle_1[k];
                        }
                    });
                    return;
                }
                if (isEvent) {
                    if (_this.attrs[key] != newAttrs[key]) {
                        _this.dom.removeEventListener(eventName, _this.attrs[key]);
                        _this.dom.addEventListener(eventName, newAttrs[key]);
                    }
                }
                else {
                    if (_this.attrs[key] != newAttrs[key]) {
                        attribute_1.RemoveAttr(_this.dom, key, _this.attrs[key]);
                        attribute_1.ApplyAttr(_this.dom, key, newAttrs[key]);
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
                    _this.dom.addEventListener(eventName, newAttrs[key]);
                }
                else {
                    attribute_1.ApplyAttr(_this.dom, key, newAttrs[key]);
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
            innerhtmls_1.push("<" + this.tag);
            Object.keys(this.attrs).forEach(function (key) {
                var attrStr = attribute_1.SerializeAttr(key, _this.attrs[key]);
                if (attrStr)
                    innerhtmls_1.push(' ' + attrStr);
            });
            innerhtmls_1.push('>');
            this.children.forEach(function (child) {
                var res = child.ToHtml();
                innerhtmls_1.push(res);
            });
            innerhtmls_1.push("</" + this.tag + ">");
            return innerhtmls_1.join('');
        }
        if (this.type == 'fragment') {
            var innerhtmls_2 = [];
            this.children.forEach(function (child) {
                var res = child.ToHtml();
                innerhtmls_2.push(res);
            });
            return innerhtmls_2.join('');
        }
    };
    VNode.prototype.ToDom = function () {
        var _this = this;
        if (this.type == 'custom') {
            var doms = this.mvvm.$ToDom();
            return doms;
        }
        if (this.type == 'standard') {
            var elem_1 = document.createElement(this.tag);
            this.dom = elem_1;
            this.children.forEach(function (child) {
                var doms = child.ToDom();
                doms.forEach(function (dom) { return elem_1.appendChild(dom); });
            });
            Object.keys(this.attrs).forEach(function (key) {
                var eventName = attribute_1.GetEventAttrName(key);
                if (eventName) {
                    elem_1.addEventListener(eventName, _this.attrs[key]);
                }
                else
                    attribute_1.ApplyAttr(elem_1, key, _this.attrs[key]);
            });
            return [elem_1];
        }
        if (this.type == 'fragment') {
            var children_1 = [];
            this.children.forEach(function (child) {
                var doms = child.ToDom();
                children_1 = children_1.concat(doms);
            });
            return children_1;
        }
        if (this.type == 'text') {
            var text = document.createTextNode(this.text);
            this.dom = text;
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
        this.dom = dom;
        Object.keys(this.attrs).forEach(function (key) {
            var eventName = attribute_1.GetEventAttrName(key);
            if (eventName) {
                dom.addEventListener(eventName, _this.attrs[key]);
            }
        });
    };
    VNode.prototype.GetNearestAncestorMvvm = function () {
        if (this.type == "custom")
            return this.mvvm;
        return this.parent && this.parent.GetNearestAncestorMvvm();
    };
    VNode.prototype.GetFirstChildMvvm = function () {
        if (this.type == "custom")
            return this.mvvm;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var mvvm = child.GetFirstChildMvvm();
            if (mvvm)
                return mvvm;
        }
        return null;
    };
    VNode.prototype.GetAllMvvm = function () {
        if (this.type == "custom")
            return [this.mvvm];
        if (this.type == 'text')
            return [];
        if (this.type == "standard" || this.type == "fragment") {
            var total_1 = [];
            this.children.forEach(function (child) {
                total_1 = total_1.concat(child.GetAllMvvm());
            });
            return total_1;
        }
        return [];
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
            Object.keys(value).forEach(function (key) {
                elem.style[key] = value[key];
            });
            return true;
        }
        return false;
    },
    className: function (elem, value) {
        if (value instanceof Array) {
            elem.setAttribute('class', value.join(" "));
        }
        else
            elem.setAttribute('class', value);
        return true;
    },
    class: function (elem, value) {
        if (value instanceof Array) {
            elem.setAttribute('class', value.join(" "));
        }
        else
            elem.setAttribute('class', value);
        return true;
    },
    key: function (elem, value) {
        return true;
    },
    ref: function (elem, value) {
        return true;
    },
    value: function (elem, value) {
        if (elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement) {
            elem.value = value;
            return true;
        }
        return false;
    },
    checked: function (elem, value) {
        if (elem instanceof HTMLInputElement) {
            elem.checked = value;
            return true;
        }
        return false;
    }
};
var removeAttr = {
    style: function (elem, value) {
        if (toString.call(value) == '[object Object]') {
            Object.keys(value).forEach(function (key) {
                elem.style[key] = '';
            });
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
                var str_1 = '';
                Object.keys(value).forEach(function (key) {
                    str_1 += key + "=" + value[key] + ";";
                });
                return "style=\"" + str_1 + "\"";
            }
            else {
                return 'style=' + value;
            }
        },
        className: function (value) {
            if (value instanceof Array) {
                value = value.join(" ");
            }
            return 'class=' + value;
        },
        key: function (value) {
            return '';
        },
        ref: function (value) {
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

/***/ "./src/dev.ts":
/*!********************!*\
  !*** ./src/dev.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dev = /** @class */ (function () {
    function Dev() {
        this.roots = [];
        this.listeners = [];
    }
    Dev.prototype.Subscribe = function (listener, init) {
        if (this.listeners.indexOf(listener) == -1) {
            if (this.roots) {
                init(this.toJson());
            }
            this.listeners.push(listener);
        }
    };
    Dev.prototype.AddMvvm = function (mvvm) {
        var _this = this;
        this.roots.push(mvvm);
        this.listeners.forEach(function (item) {
            item("new", _this.getMvvm(mvvm.$GetAttachedVNode()));
        });
    };
    Dev.prototype.Unsubscribe = function (listener) {
        this.listeners = this.listeners.filter(function (item) { return item != listener; });
    };
    Dev.prototype.toJson = function () {
        var _this = this;
        var mvvms = [];
        if (this.roots) {
            this.roots.forEach(function (root) {
                mvvms = mvvms.concat(_this.getMvvm(root.$GetAttachedVNode()));
            });
        }
        return mvvms;
    };
    Dev.prototype.getMvvm = function (vnode) {
        var _this = this;
        if (vnode.GetType() == 'text')
            return [];
        if (vnode.GetType() == "standard" || vnode.GetType() == 'fragment') {
            var children_1 = [];
            vnode.GetChildren().forEach(function (child) {
                children_1 = children_1.concat(_this.getMvvm(child));
            });
            return children_1;
        }
        if (vnode.GetType() == "custom") {
            var mvvm_1 = vnode.GetMvvm();
            var name_1 = mvvm_1.constructor.name;
            var data_1 = {};
            Object.keys(mvvm_1).forEach(function (key) {
                if (!key.startsWith("$") && mvvm_1[key] !== mvvm_1.$GetProps() || key == "$id") {
                    data_1[key] = mvvm_1[key];
                }
            });
            var vnodeObj = { name: name_1, data: data_1, props: vnode.GetMvvm().$GetProps(), children: this.getMvvm(vnode.GetMvvm().$GetRoot()) };
            return [vnodeObj];
        }
        throw new Error("vnode type error");
    };
    Dev.prototype.OnChange = function (type, mvvms, extra) {
        var _this = this;
        var instances = [];
        mvvms.forEach(function (mvvm) {
            var instance = { name: mvvm.constructor.name, props: mvvm.$GetProps(), data: {}, children: [] };
            Object.keys(mvvm).forEach(function (key) {
                if (!key.startsWith("$") && mvvm[key] !== mvvm.$GetProps() || key == "$id") {
                    instance.data[key] = mvvm[key];
                }
            });
            if (type == "new") {
                instance.children = _this.getMvvm(mvvm.$GetRoot());
            }
            instances.push(instance);
        });
        this.listeners.forEach(function (listener) {
            listener(type, instances, extra);
        });
    };
    return Dev;
}());
var dev = new Dev();
window.__noreact_dev = dev;
exports.default = dev;


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
function RegisterEvent(event, func, mvvm) {
    if (!events[event]) {
        events[event] = [];
    }
    events[event].push({ cb: func, mvvm: mvvm });
}
exports.RegisterEvent = RegisterEvent;
function TriggerEvent(event) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (events[event]) {
        events[event] = events[event].filter(function (item) { return !item.mvvm.$IsDestroyed(); });
        events[event].forEach(function (item) {
            item.cb.apply(item, args);
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
exports.React = react_1.React;
exports.Ref = react_1.Ref;
exports.Fragment = react_1.Fragment;
var VNode_1 = __webpack_require__(/*! ./VNode */ "./src/VNode.ts");
exports.VNode = VNode_1.VNode;
var dev_1 = __webpack_require__(/*! ./dev */ "./src/dev.ts");
exports.Dev = dev_1.default;


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
var MVVM_1 = __webpack_require__(/*! ./MVVM */ "./src/MVVM.ts");
var isInBrowser = new Function('try {return this===window;}catch(e){ return false;}');
var NoReact = /** @class */ (function () {
    function NoReact() {
        this.mode = 'deep';
    }
    NoReact.prototype.createElement = function (Elem, attrs) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var allchildren = [];
        this.flatten('$', children, allchildren);
        if (typeof Elem == 'string') {
            var vnode_1 = new VNode_1.VNode('standard');
            vnode_1.SetTag(Elem);
            vnode_1.isMulti = false;
            if (attrs != null) {
                Object.keys(attrs).forEach(function (key) {
                    vnode_1.SetAttr(key, attrs[key]);
                });
            }
            vnode_1.SetChildren(allchildren);
            return vnode_1;
        }
        if (Elem == Fragment) {
            var vnode_2 = new VNode_1.VNode('fragment');
            vnode_2.isMulti = true;
            vnode_2.SetChildren(allchildren);
            if (attrs != null) {
                Object.keys(attrs).forEach(function (key) {
                    vnode_2.SetAttr(key, attrs[key]);
                });
            }
            return vnode_2;
        }
        if (Elem.prototype instanceof MVVM_1.MVVM) {
            var vnode_3 = new VNode_1.VNode('custom');
            var mvvm = new Elem(attrs);
            vnode_3.SetMvvm(mvvm);
            mvvm.$SetChildren(allchildren);
            mvvm.$AttachVNode(vnode_3);
            if (this.mode == 'deep') {
                var root = mvvm.$DoRender();
                vnode_3.isMulti = root.isMulti;
            }
            if (attrs != null) {
                Object.keys(attrs).forEach(function (key) {
                    vnode_3.SetAttr(key, attrs[key]);
                });
            }
            return vnode_3;
        }
        if (typeof Elem == "function") {
            var vnode = Elem(attrs);
            return vnode;
        }
    };
    NoReact.prototype.flatten = function (prefix, children, res) {
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
    NoReact.prototype.ChangeMode = function (mode) {
        this.mode = mode;
    };
    return NoReact;
}());
var Fragment = /** @class */ (function () {
    function Fragment() {
    }
    return Fragment;
}());
exports.Fragment = Fragment;
var Ref = /** @class */ (function () {
    function Ref() {
    }
    return Ref;
}());
exports.Ref = Ref;
exports.React = new NoReact();
var counter = 0;
function GetId() {
    return counter++;
}
exports.GetId = GetId;


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
        tempQueue.sort(function (m1, m2) {
            if (m1.$IsParentOf(m2)) {
                return -1;
            }
            if (m2.$IsParentOf(m1)) {
                return 1;
            }
            return 0;
        });
        if (counter > maxLoop) {
            throw new Error("refresh loop more than " + maxLoop);
        }
        counter++;
        tempQueue.forEach(function (root) {
            if (!root.$IsDestroyed() && root.$GetDirty())
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
});
//# sourceMappingURL=index.js.map