export const VNODE_ID = '__decorator__';
let $isServerRender = false;
export function ServerRender(isServerRender: boolean) {
    $isServerRender = isServerRender;
}
const applyAttr: { [name: string]: (elem: HTMLElement, value: any) => boolean } = {
    style: (elem, value) => {
        if (toString.call(value) == '[object Object]') {
            for (let key in value) {
                elem.style[key] = value[key];
            }
            return true;
        }
        return false;
    },
    className: (elem, value) => {
        elem.setAttribute('class', value);
        return true;
    },
    key: (elem, value) => {
        return true;
    },
    ref: (elem, value) => {
        return true;
    },
    value(elem, value) {
        if (elem instanceof HTMLInputElement) {
            elem.value = value;
            return true;
        }
        return false;
    }
};
const removeAttr: { [name: string]: (elem: HTMLElement, value: any) => boolean } = {
    style: (elem, value) => {
        if (toString.call(value) == '[object Object]') {
            for (let key in value) {
                elem.style[key] = '';
            }
            return true;
        }
        return false;
    },
    className: (elem, value) => {
        elem.setAttribute('class', '');
        return true;
    },
    key: (elem, value) => {
        return true;
    },
    value(elem, value) {
        if (elem instanceof HTMLInputElement) {
            elem.value = '';
            return true;
        }
        return false;
    }
};
const serializeAttr: { [name: string]: (value: any) => string } = {
    style: value => {
        if (toString.call(value) == '[object Object]') {
            let str = '';
            for (let key in value) {
                str += `${key}=${value[key]};`;
            }
            return `style="${str}"`;
        } else {
            return 'style=' + value;
        }
    },
    className: value => {
        return 'class=' + value;
    },
    key: value => {
        return '';
    },
    ref: value => {
        return '';
    },
    [VNODE_ID]: value => {
        if ($isServerRender) return VNODE_ID + '=' + value;
        else return '';
    }
};
/**toHtml方法使用 */
export function SerializeAttr(name: string, value: any): string {
    if (toString.call(value) == '[object Function]') {
        return '';
    }
    if (serializeAttr[name]) {
        return serializeAttr[name](value);
    } else {
        return name + '=' + value;
    }
}
/**toDom方法使用 */
export function ApplyAttr(elem: HTMLElement, name: string, value: any) {
    if (applyAttr[name]) {
        let res = applyAttr[name](elem, value);
        if (res)
            return;
    }
    elem.setAttribute(name, value);
}
export function RemoveAttr(elem: HTMLElement, name: string, value: any) {
    if (removeAttr[name]) {
        let res = removeAttr[name](elem, value);
        if (res)
            return;
    }
    elem.setAttribute(name, '');
}
export function GetEventAttrName(attr: string) {
    if (/^on([A-Z][a-z]+)+$/.test(attr)) {
        return attr.slice(2).toLowerCase();
    }
    return null;
}
