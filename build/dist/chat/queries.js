import * as React from 'react';
import { PropGrid, IconText } from 'tonva-react-form';
import { Page, nav } from 'tonva-tools';
import { MyFolders, WholeFolders } from './folders';
export class Queries extends React.Component {
    constructor() {
        super(...arguments);
        this.rows = [
            '',
            {
                type: 'component',
                component: React.createElement(IconText, { iconClass: "text-primary", icon: "building", text: "\u9879\u76EE" }),
                onClick: this.projects
            },
            {
                type: 'component',
                component: React.createElement(IconText, { iconClass: "text-primary", icon: "archive", text: "\u529E\u4E8B\u4EBA" }),
                onClick: this.persons
            },
        ];
    }
    projects() {
        nav.push(React.createElement(Projects, null));
    }
    persons() {
        nav.push(React.createElement(Persons, null));
    }
    render() {
        return React.createElement(React.Fragment, null,
            React.createElement(PropGrid, { rows: this.rows, values: {} }),
            React.createElement(MyFolders, null),
            React.createElement(WholeFolders, null));
    }
}
class Projects extends React.Component {
    render() {
        return React.createElement(Page, { header: "\u9879\u76EE" },
            React.createElement("div", { className: "m-3" }, "\u6309\u9879\u76EE\u67E5\u770B\u4EFB\u52A1\u8FDB\u5C55\u60C5\u51B5"));
    }
}
class Persons extends React.Component {
    render() {
        return React.createElement(Page, { header: "\u529E\u4E8B\u4EBA" },
            React.createElement("div", { className: "m-3" }, "\u6309\u529E\u4E8B\u4EBA\u67E5\u770B\u4EFB\u52A1\u8FDB\u5C55\u60C5\u51B5"));
    }
}
//# sourceMappingURL=queries.js.map