import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, EasyDate, LMR, FA, Muted, PropGrid, Prop, Media, IconText} from 'tonva-react-form';
import {Page, nav, User} from 'tonva-tools';
import {Message} from 'model';
import {store} from 'store';
import {UserSpan} from './userSpan';

const states = {
    '#': <span className="text-succeed">完成</span>,
    '#-': <span className="text-danger">没完成</span>,
}
function stateText(state):string {
    let ret = states[state];
    return ret || state;
}

export interface JobPageProps {
    msg: Message
}
interface JobPageState {
    msg: Message;
    flow: number;
    flows: any[];
}

export class JobPage extends React.Component<JobPageProps, JobPageState> {
    constructor(props) {
        super(props);
        this.finish = this.finish.bind(this);
        this.decline = this.decline.bind(this);
        this.edit = this.edit.bind(this);
    }

    async componentDidMount() {
        let ret = await store.unit.unitx.getMessage(this.props.msg.id);
        this.setState(ret);
    }
    private async finish() {
        let {msg} = this.props;
        await store.unit.unitx.actMessage(msg, 'done', '#', [{user:0}]);
        //store.unit.chat.done(msg.id);
        nav.pop();
    }
    private async decline() {
        let {msg} = this.props;
        await store.unit.unitx.actMessage(msg, 'decline', '#-', [{user:0}]);
        alert('显示做不了的理由, 然后选择。暂未完成设计！');
        nav.pop();
    }
    private async edit() {
        let {msg} = this.props;
        msg.subject += '.1';
    }
    private flowRender(flow:any, index:number):JSX.Element {
        let {id, prev, date, state, user, action} = flow;
        let left = state==='$'?
            <div className="col-sm-6">开始</div> :
            <>
                <div className="col-sm-1" />
                <div className="col-sm-5">
                    {action} &nbsp; <UserSpan userIds={[user]} />
                </div>
            </>;
        let mid = prev>0? 
            <div className="col-sm-4">
                <div className="row">
                    <div className="col-sm-6 text-right">
                        <FA className="text-info" name="arrow-right" />
                    </div>
                    <div className="col-sm-6">
                        {stateText(state)}
                    </div>
                </div>
            </div>
            : <div className="col-sm-4" />;
        return <span key={id} className="container-fluid my-2">
            <div className="row">
                {left}
                {mid}
                <div className="col-sm-2 align-items-end justify-content-center d-flex flex-column">
                    <Muted><EasyDate date={date} /></Muted>
                </div>
            </div>
        </span>;
    }
    private buildFlow(rows:Prop[]) {
        if (this.state === null) return;
        let {flow, flows} = this.state;
        rows.push({
            type: 'component',
            full: true,
            component: <List className="w-100"
                header={<Muted>流程</Muted>}
                items={flows} item={{render:this.flowRender}}
            />
        });
        rows.push('');
        if (flow === undefined) return;
        rows.push({
            label: '',
            type: 'component',
            bk: 'tansparent',
            component: <div className="w-100">
                <LMR
                    left={<Button color="success" onClick={this.finish}>完成</Button>} 
                    right={<Button color="info" onClick={this.decline}>做不了</Button>} />
            </div>
            //<Button color="secondary" onClick={this.edit}>编辑</Button>
        });
    }
    render() {
        let {msg} = this.props;
        let {fromUser} = msg;
        let {tuid_message, tuid_user} = store.unit.unitx;
        let user = tuid_user.getId(fromUser);
        let rows:Prop[] = [
            {
                label: '来自',
                type: 'component', 
                component: <div className="w-100">
                    {typeof user === 'object'?
                        <small>{user.nick || user.name}</small> : 
                        <small>{user}</small>}
                </div>
            },
            {
                label: '任务描述',
                type: 'string', 
                name: 'discription',
                //onClick: this.applyUnit
            },
            '',
        ];
        this.buildFlow(rows);
        return <Page header="处理任务">
            <PropGrid className="px-3 py-2" rows={rows} values={msg} />
        </Page>;
    }
}
/*
<div>
<Button color="success" onClick={this.finish}>完成</Button> &nbsp; &nbsp;
<Button color="secondary" onClick={this.decline}>做不了</Button>
<Button color="secondary" onClick={this.edit}>编辑</Button>
</div>
*/