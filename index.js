var VCodeMirror_1;
import { __decorate, __metadata } from "tslib";
import CodeMirror from 'codemirror';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import { capitalize, h, markRaw } from 'vue';
import ResizeObserver from 'resize-observer-polyfill';
// 这个组件会监听 html 标签上的 `theme-white` `theme-dark` 变化动态指定编辑器的主题色
import { $theme } from 'theme-helper';
import { Component, Inreactive, Prop, VueComponentBase, Watch } from 'vue3-component-base';
const Events = [
    /** 获得焦点时触发 */
    'focus',
    /** 失去焦点时触发 */
    'blur',
    /** 滚动时触发 */
    'scroll',
];
/** 代码编辑组件 */
let VCodeMirror = VCodeMirror_1 = class VCodeMirror extends VueComponentBase {
    render() {
        return h('div', { class: 'v-code-mirror' });
    }
    mounted() {
        const editor = this.editor = markRaw(CodeMirror(this.$el, {
            value: this.value,
            mode: this.mode,
            theme: $theme.get() === 'white' ? 'default' : 'dracula',
            readOnly: this.readonly,
            lineWrapping: this.wrap,
            lineNumbers: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            ...this.options,
        }));
        editor.on('changes', () => {
            const value = editor.getValue();
            this.backupValue = value;
            this.$emit('update:value', editor.getValue());
        });
        Events.forEach(x => {
            const eventName = 'on' + capitalize(x);
            if (typeof this.$.vnode.props[eventName] === 'function') {
                editor.on(x, this.$emit.bind(this, x));
            }
        });
        this.cleanEvent = markRaw($theme.onchange(({ detail }) => {
            this.editor.setOption('theme', detail === 'white' ? 'default' : 'dracula');
        }));
        this.backupValue = this.value;
        this.$el._component = this;
        if (!VCodeMirror_1.ro) {
            VCodeMirror_1.ro = new ResizeObserver(function (entries) {
                entries.forEach(entry => {
                    const that = entry.target._component;
                    if (that.autoHeight) {
                        that.editor.refresh();
                    }
                    else {
                        that.editor.setSize(entry.contentRect.width, entry.contentRect.height);
                    }
                });
            });
        }
        VCodeMirror_1.ro.observe(this.$el);
    }
    beforeUnmount() {
        var _a, _b;
        (_a = this.cleanEvent) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = VCodeMirror_1.ro) === null || _b === void 0 ? void 0 : _b.unobserve(this.$el);
    }
    updateValue(value) {
        if (value === this.backupValue)
            return;
        this.editor.setValue(value);
    }
    updateReadonly(value) {
        this.editor.setOption('readOnly', value);
    }
    updateWrap(value) {
        this.editor.setOption('lineWrapping', value);
    }
    focus() {
        this.editor.focus();
    }
};
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], VCodeMirror.prototype, "value", void 0);
__decorate([
    Prop({ default: () => ({ name: 'javascript', json: true }) }),
    __metadata("design:type", Object)
], VCodeMirror.prototype, "mode", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Boolean)
], VCodeMirror.prototype, "readonly", void 0);
__decorate([
    Prop({ default: true }),
    __metadata("design:type", Boolean)
], VCodeMirror.prototype, "wrap", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Object)
], VCodeMirror.prototype, "options", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Boolean)
], VCodeMirror.prototype, "autoHeight", void 0);
__decorate([
    Inreactive,
    __metadata("design:type", Object)
], VCodeMirror.prototype, "editor", void 0);
__decorate([
    Inreactive,
    __metadata("design:type", String)
], VCodeMirror.prototype, "backupValue", void 0);
__decorate([
    Inreactive,
    __metadata("design:type", Function)
], VCodeMirror.prototype, "cleanEvent", void 0);
__decorate([
    Watch('value'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VCodeMirror.prototype, "updateValue", null);
__decorate([
    Watch('readonly'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], VCodeMirror.prototype, "updateReadonly", null);
__decorate([
    Watch('wrap'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], VCodeMirror.prototype, "updateWrap", null);
VCodeMirror = VCodeMirror_1 = __decorate([
    Component({
        name: 'VCodeMirror',
        emits: ['update:value', ...Events],
    })
], VCodeMirror);
export { VCodeMirror };
//# sourceMappingURL=index.js.map