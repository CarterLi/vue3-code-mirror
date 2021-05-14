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

const Events: (keyof CodeMirror.EditorEventMap)[] = [
  /** 获得焦点时触发 */
  'focus',
  /** 失去焦点时触发 */
  'blur',
  /** 滚动时触发 */
  'scroll',
];

/** 代码编辑组件 */
@Component({
  name: 'VCodeMirror',
  emits: ['update:value', ...Events],
})
export class VCodeMirror extends VueComponentBase {
  /** 代码字符串值 */
  @Prop({ required: true }) readonly value: string;
  /** 语言，默认为json */
  @Prop({ default: () => ({ name: 'javascript', json: true }) }) readonly mode: CodeMirror.ModeSpec<unknown>;
  /** 是否只读 */
  @Prop() readonly readonly: boolean;
  /** 是否折行 */
  @Prop({ default: true }) readonly wrap: boolean;
  /** 其他参数 */
  @Prop() readonly options: CodeMirror.EditorConfiguration;
  /** 是否自适应高度 */
  @Prop() readonly autoHeight: boolean;

  $el: HTMLDivElement & { _component: VCodeMirror };

  @Inreactive editor: CodeMirror.Editor;
  @Inreactive backupValue: string;
  @Inreactive cleanEvent: () => void;
  static ro: ResizeObserver;

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
    if (!VCodeMirror.ro) {
      VCodeMirror.ro = new ResizeObserver(function(this: void, entries) {
        entries.forEach(entry => {
          const that = (entry.target as HTMLDivElement & { _component: VCodeMirror })._component;
          if (that.autoHeight) {
            that.editor.refresh();
          } else {
            that.editor.setSize(entry.contentRect.width, entry.contentRect.height);
          }
        });
      });
    }
    VCodeMirror.ro.observe(this.$el);
  }

  beforeUnmount() {
    this.cleanEvent?.();
    VCodeMirror.ro?.unobserve(this.$el);
  }

  @Watch('value')
  updateValue(value: string) {
    if (value === this.backupValue) return;
    this.editor.setValue(value);
  }

  @Watch('readonly')
  updateReadonly(value: boolean) {
    this.editor.setOption('readOnly', value);
  }

  @Watch('wrap')
  updateWrap(value: boolean) {
    this.editor.setOption('lineWrapping', value);
  }

  focus() {
    this.editor.focus();
  }
}
