var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { List, EasyDate, LMR, FA, Muted, PropGrid, IconText } from 'tonva-react-form';
import { Page, nav, View } from 'tonva-tools';
import { templetDict } from 'store';
import { tv } from 'tonva-react-uq';
export class VFoldersView extends View {
    constructor() {
        super(...arguments);
        this.renderMessage = (item, index) => {
            return React.createElement(MsgRow, item);
        };
        this.clickMessage = (item) => {
            let { message } = item;
            //let tuid = store.unit.unitx.tuid_message;
            //let msg:Message = {} as any; //tuid.valueFromId(id);
            if (typeof message === 'number')
                return;
            //nav.push(<JobPage msg={msg} />);
            this.controller.jobPage(message.obj);
        };
        this.folderView = ({ header, folder }) => {
            //let {header, folder} = this.props;
            let { items, bottomDiv } = folder;
            return React.createElement(Page, { header: header },
                React.createElement(BottomDiv, { bottomId: bottomDiv },
                    React.createElement(List, { className: "my-1", before: React.createElement(Muted, null, "[\u65E0\u5185\u5BB9]"), items: items, item: { className: 'bg-transparent', render: this.renderMessage, onClick: this.clickMessage } })));
        };
    }
}
export class MyFolders extends VFoldersView {
    constructor() {
        super(...arguments);
        this.sendBox = () => __awaiter(this, void 0, void 0, function* () {
            let folder = this.controller.sendFolder;
            folder.scrollToBottom();
            yield folder.first({ tag: '$me', undone: 1 });
            //nav.push(<SendBox />);
            this.openPage(this.folderView, { header: "我发出任务", folder: this.controller.sendFolder });
        });
        this.passBox = () => __awaiter(this, void 0, void 0, function* () {
            let folder = this.controller.passFolder;
            folder.scrollToBottom();
            yield folder.first({ tag: '$pass', undone: 1 });
            //nav.push(<PassBox />);
            this.openPage(this.folderView, { header: "我经手任务", folder: this.controller.passFolder });
        });
        this.ccBox = () => __awaiter(this, void 0, void 0, function* () {
            let folder = this.controller.ccFolder;
            folder.scrollToBottom();
            yield folder.first({ tag: '$cc', undone: 1 });
            //nav.push(<CcBox />);
            this.openPage(this.folderView, { header: "抄送我的", folder: this.controller.ccFolder });
        });
        this.folderRow = observer(({ icon, text, folder }) => {
            let { doing, undone } = folder;
            let right;
            if (undone > 0) {
                right = React.createElement(React.Fragment, null,
                    doing > 0 ? React.createElement("span", { className: "badge badge-info" }, doing) : undefined,
                    React.createElement("span", { className: "badge badge-light" }, undone));
            }
            return React.createElement(LMR, { className: "w-100 align-items-center my-2 text-dark", left: React.createElement(FA, { className: "text-info mr-3", name: icon }), right: right }, text);
        });
    }
    render() {
        let { desk, sendFolder, passFolder, ccFolder } = this.controller;
        let rows = [
            '=',
            {
                type: 'component',
                component: React.createElement(this.folderRow, { icon: "share-square-o", text: "\u6211\u53D1\u51FA\u4EFB\u52A1", folder: sendFolder }),
                onClick: this.sendBox
            },
            {
                type: 'component',
                component: React.createElement(this.folderRow, { icon: "clipboard", text: "\u6211\u7ECF\u624B\u4EFB\u52A1", folder: passFolder }),
                onClick: this.passBox
            },
            {
                type: 'component',
                component: React.createElement(this.folderRow, { icon: "cc", text: "\u6284\u9001\u6211\u7684", folder: ccFolder }),
                onClick: this.ccBox
            },
        ];
        return React.createElement(PropGrid, { rows: rows, values: {} });
    }
}
export class WholeFolders extends VFoldersView {
    constructor() {
        super(...arguments);
        this.allBox = () => __awaiter(this, void 0, void 0, function* () {
            let folder = this.controller.allFolder;
            folder.scrollToBottom();
            yield folder.first({ tag: '$' });
            //nav.push(<AllBox />);
            this.openPage(this.folderView, { header: "全部任务", folder: this.controller.allFolder });
        });
        this.archiveBox = () => __awaiter(this, void 0, void 0, function* () {
            nav.push(React.createElement(ArchiveBox, null));
        });
        this.rows = [
            '',
            {
                type: 'component',
                component: React.createElement(IconText, { iconClass: "text-primary", textClass: "d-inline-block ml-3", icon: "building", text: "\u5168\u90E8" }),
                onClick: this.allBox
            },
            {
                type: 'component',
                component: React.createElement(IconText, { iconClass: "text-primary", textClass: "d-inline-block ml-3", icon: "archive", text: "\u5DF2\u5F52\u6863" }),
                onClick: this.archiveBox
            },
        ];
    }
    render() {
        return React.createElement(PropGrid, { rows: this.rows, values: {} });
    }
}
const lnRegx = /\\r\\\\n|\\r|\\n/;
const light = { fontSize: 'x-small', color: 'lightgray' };
const MsgRow = (item) => {
    let userId = nav.user.id;
    //let {tuid_message} = store.unit.unitx;
    let { message, branch, done, flow } = item;
    //let msg:Message = {} as any; //tuid_message.valueFromId(id);
    let rowCn = 'px-3 bg-white my-1';
    if (typeof message === 'number') {
        return React.createElement(LMR, { className: rowCn + ' py-2' },
            React.createElement("small", { style: { color: 'lightgray' } },
                "... ",
                message,
                " ..."));
    }
    let tmo = typeof message.obj;
    if (tmo === 'number' || tmo === 'string') {
        return React.createElement(React.Fragment, null,
            "MSG: ",
            message.id);
    }
    let { date, type, fromUser, subject, discription, content } = message.obj;
    let right = done < branch ?
        flow && React.createElement(FA, { className: "text-info", name: "file-text-o" }) :
        React.createElement(FA, { className: "text-success", name: "check-circle" });
    let dateDiv = React.createElement("div", { style: light },
        React.createElement(EasyDate, { date: date }));
    let header;
    if (fromUser.id != userId) {
        let td = templetDict[type];
        let icon = React.createElement(FA, { className: "mt-1 text-info", size: '2x', name: (td && td.icon) || 'envelope' });
        header = React.createElement(LMR, { left: icon, right: right },
            tv(fromUser),
            dateDiv);
        //<UserSpan userIds={[fromUser]} />
    }
    else {
        header = React.createElement(LMR, { left: dateDiv, right: right });
    }
    let caption;
    if (subject !== undefined) {
        caption = React.createElement("div", { className: "font-weight-bold" }, subject);
    }
    return React.createElement("div", { className: rowCn + ' py-1 flex-column' },
        header,
        React.createElement("div", { className: "py-1" },
            caption,
            React.createElement("div", null, discription)));
};
class BottomDiv extends React.Component {
    constructor(props) {
        super(props);
        this.onAnyInput = this.onAnyInput.bind(this);
    }
    componentDidMount() {
        let bd = this.props.bottomId;
        this.bottomTimer = setInterval(() => {
            let el = document.getElementById(bd);
            if (el)
                el.scrollIntoView();
        }, 100);
    }
    onAnyInput() {
        if (this.bottomTimer !== undefined) {
            clearInterval(this.bottomTimer);
            this.bottomTimer = undefined;
        }
    }
    render() {
        return React.createElement("div", { onTouchStartCapture: this.onAnyInput, onWheelCapture: this.onAnyInput, onMouseDownCapture: this.onAnyInput, onKeyPressCapture: this.onAnyInput },
            this.props.children,
            React.createElement("div", { id: this.props.bottomId }));
    }
}
class ArchiveBox extends React.Component {
    renderMessage(item, index) {
        return React.createElement(MsgRow, item);
    }
    clickMessage(msg) {
    }
    render() {
        return React.createElement(Page, { header: "\u5DF2\u5F52\u6863" },
            React.createElement("div", { className: "p-3" }, "\u5F52\u6863\u6B63\u5728\u5EFA\u8BBE\u4E2D..."));
    }
}
//# sourceMappingURL=folders.js.map