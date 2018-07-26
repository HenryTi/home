var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { store } from 'store';
let UserSpan = class UserSpan extends React.Component {
    render() {
        let { tuid_user } = store.unit.unitx;
        return React.createElement(React.Fragment, null, this.props.userIds.map(id => {
            let user = tuid_user.getId(id);
            return React.createElement("small", { key: id }, user === undefined ? id : user.nick || user.name);
        }));
    }
};
UserSpan = __decorate([
    observer
], UserSpan);
export { UserSpan };
//# sourceMappingURL=userSpan.js.map