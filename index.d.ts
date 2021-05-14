import CodeMirror from 'codemirror';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import ResizeObserver from 'resize-observer-polyfill';
import { VueComponentBase } from 'vue3-component-base';
/** 代码编辑组件 */
export declare class VCodeMirror extends VueComponentBase {
    /** 代码字符串值 */
    readonly value: string;
    /** 语言，默认为json */
    readonly mode: CodeMirror.ModeSpec<unknown>;
    /** 是否只读 */
    readonly readonly: boolean;
    /** 是否折行 */
    readonly wrap: boolean;
    /** 其他参数 */
    readonly options: CodeMirror.EditorConfiguration;
    /** 是否自适应高度 */
    readonly autoHeight: boolean;
    $el: HTMLDivElement & {
        _component: VCodeMirror;
    };
    editor: CodeMirror.Editor;
    backupValue: string;
    cleanEvent: () => void;
    static ro: ResizeObserver;
    render(): import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    mounted(): void;
    beforeUnmount(): void;
    updateValue(value: string): void;
    updateReadonly(value: boolean): void;
    updateWrap(value: boolean): void;
    focus(): void;
}
