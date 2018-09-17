import * as React from 'react';
import {computed} from 'mobx';
import { CrUsq, VmPage, Query, Tuid, Action, IdBox } from 'tonva-react-usql';
import {Page, Tab, nav, isBridged} from 'tonva-tools';
import {Action as MenuAction, DropdownActions} from 'tonva-react-form';
import { store, Unit, Templet, Desk, SendFolder, PassFolder, CcFolder, AllFolder, UnitMessages, Folder, Item } from 'store';
import { DeskPage } from './desk';
import { JobsPage } from './jobs';
import { Queries } from './queries';
import { AppsPage } from './apps';
import { Message } from 'model';
import { MyFolders, WholeFolders } from './folders';
import { JobPage } from './job';
import { JobEdit } from './jobEdit';

interface MessageState {
    id: IdBox;
    message: Message;
    branch: number;
    done: number;
    prevState: string;
    state: string;
}

export class CrUnitxUsq extends CrUsq {
    //private unitId: number;
    private action_newMessage: Action;
    private action_readMessage: Action;
    private action_actMessage: Action;
    private query_getDesk: Query;
    private query_getFolder: Query;
    private query_getFolderUndone: Query;
    private query_getMessage: Query;
    private query_getTemplets: Query;
    private userMeUploaded:boolean = false;
    private pushId = 0;

    unit: Unit;
    templets: Templet[];
    tuid_message: Tuid;
    tuid_user: Tuid;
    desk: Desk;
    sendFolder: SendFolder;
    passFolder: PassFolder;
    ccFolder: CcFolder;
    allFolder: AllFolder;
    messages: UnitMessages;

    tabs:Tab[] = [
        {
            title: '待办',
            content: () => this.renderVm(DeskPage),
            redDot: computed(()=>{
                return this.desk.items.length;
            })
        },
        {
            title: '新建',
            content: () => this.renderVm(JobsPage), // <JobsPage />,
            load: async ():Promise<void> => {
                this.templets = await this.getTemplets();
            },
            //redDot: computed(()=>store.follow.newInvitesCount),
        },
        {
            title: '查看',
            content: () => this.renderVm(Queries), // <Queries />,
        },
        {
            title: '应用',
            content: () => this.renderVm(AppsPage), //  <AppsPage />,
            load: async ():Promise<void> => {
                if (this.unit.apps !== undefined) return;
                await this.unit.loadApps();
            }
            //redDot: computed(()=>store.follow.newInvitesCount),
        },
    ];
    

    constructor(unit: Unit) {
        super('$$$/$unitx', 0, 0, undefined, undefined);
        this.unit = unit;
        //this.unitId = unitId;
    }

    protected async internalStart() {
        await this.loadSchema();

        this.tuid_message = this.entities.tuid('message'),
        this.tuid_user = this.entities.tuid('user'),
        this.action_readMessage = this.entities.action('readMessage'),
        this.action_newMessage = this.entities.action('newMessage'),
        this.action_actMessage = this.entities.action('actMessage'),
        this.query_getDesk = this.entities.query('getDesk'),
        this.query_getFolder = this.entities.query('getFolder'),
        this.query_getFolderUndone = this.entities.query('getFolderUndone'),
        this.query_getMessage = this.entities.query('getMessage'),
        this.query_getTemplets = this.entities.query('getTemplets'),

        //this.tuid_message.setItemObservable();

        this.desk = new Desk(this.unit, this.query_getDesk);
        this.desk.scrollToBottom();
        await this.desk.first(undefined);

        this.sendFolder = new SendFolder(this.unit, this.query_getFolder);
        this.passFolder = new PassFolder(this.unit, this.query_getFolder);
        this.ccFolder = new CcFolder(this.unit, this.query_getFolder);
        this.allFolder = new AllFolder(this.unit, this.query_getFolder);

        this.loadFoldsUndone();
        await this.showVm(VmUnitx);
    }

    showAppsPage() {
        //this.showVm(AppsPage);
        alert('AppsPage cannot show');
    }

    jobPage(msg: Message) {
        this.showVm(JobPage, msg);
    }

    jobEdit(templet: Templet) {
        this.showVm(JobEdit, templet);
    }

    myFolders() {
        return this.renderVm(MyFolders);
    }

    wholeFolders() {
        return this.renderVm(WholeFolders);
    }

    getQuery(name:string):Query {
        return this.entities.query(name);
    }

    async readMessage(id: number):Promise<void> {
        await this.action_readMessage.submit({msg: id});
    }

    async actMessage(msg:Message, act:string, toState:string, to: {user:number}[]): Promise<void> {
        let {id} = msg;
        await this.action_actMessage.submit({
            msg: id,
            curState: toState,
            toState: '#',
            action: act,
            to: to
        });
    }

    async onMessage(message: any):Promise<void> {
        let {$type, $push, msg, to, action, data} = message;
        this.pushId = $push;
        if ($type !== 'msg') return;
        if (!action) return;
        console.log('ws message: ', message);
        let parts = action.split(',');
        for (let p of parts) {
            switch (p) {
                default:
                    this.to(p, this.dataToMsg(data));
                    break;
                case '$away':
                    this.removeFromDesk(msg);
                    break;
                case '$read':
                    this.messageBeReaden(msg);
                    break;
            }
        }
    }
    private dataToMsg(data:string):MessageState {
        let parts = data.split('\t');
        function toNum(t:string):number {if (t) return Number(t)}
        function toDate(t:string):Date {if (t) return new Date(Number(t)*1000)}
        let id = toNum(parts[0]);
        let date = toDate(parts[4]);
        let branch = toNum(parts[8]);
        let done = toNum(parts[9]);
        let prevState = parts[10];
        let state = parts[11];
        
        let m:Message;
        if (date !== undefined) m = {
            id: id,
            fromUser: toNum(parts[1]),
            fromUnit: toNum(parts[2]),
            type: parts[3],
            date: date,
            subject: parts[5],
            discription: parts[6],
            content: parts[7],
            //read: 0,
            //state: parts[8],
        };
        return {
            id: this.tuid_message.createID(id),
            message: m,
            branch: branch,
            done: done,
            prevState: prevState,
            state: state,
        };
    };

    private to(action:string, ms:MessageState) {
        let {id, message, branch, done, prevState, state} = ms;
        let folder: Folder<Item>;
        let parts = action.split(',');
        for (let p of parts) {
            switch (p) {
                default: return;
                case '$desk':
                    //this.changeUread(1);
                    folder = this.desk;
                    break;
                case '$me': 
                    folder = this.sendFolder;
                    break;
                case '$pass':
                    folder = this.passFolder;
                    break;
                case '$cc':
                    folder = this.ccFolder;
                    break;
            }
            // folder === undefined, then chat not loaded
            if (folder === undefined) return;
            if (message !== undefined) {
                let {fromUser} = message;
                this.tuid_message.cacheValue(message);
                this.tuid_user.useId(fromUser);
            }
            let item = {
                message: id, 
                read: 0, 
                branch:branch, 
                done:done, 
                prevState: prevState, 
                state: state
            };
            this.allFolder.updateItem(item, false);
            folder.updateItem(item);
            folder.scrollToBottom();
        }
    }
    private changeUread(delta:number) {
        let unread = this.unit.unread;
        if (unread !== undefined) {
            unread += delta;
            if (unread >= 0) {
                this.unit.unread = unread;
            }
        }
    }
    private removeFromDesk(id:number) {
        //this.changeUread(-1);
        if (this.desk !== undefined) this.desk.remove(id);
    }
    private messageBeReaden(id:number) {
        if (this.desk === undefined) return;
        let msg = this.desk.items.find(v => v.message.id === id);
        if (msg !== undefined) msg.read = 1;
    }
    async newMessage(msg:any):Promise<number> {
        if (this.userMeUploaded === false) {
            let {name, nick, icon} = nav.user;
            msg.meName = name;
            msg.meNick = nick;
            msg.meIcon = icon;
            this.userMeUploaded = true;
        }
        return await this.action_newMessage.submit(msg);
    }

    async loadFoldsUndone():Promise<void> {
        let ret = await this.query_getFolderUndone.query({});
        let {unDesk, unMe, onMe, unPass, onPass, unCc, onCc} = ret.ret[0];
        // this.unit.unread = unDesk;
        this.sendFolder.undone = unMe;
        this.sendFolder.doing = onMe;
        this.passFolder.undone = unPass;
        this.passFolder.doing = onPass;
        this.ccFolder.undone = unCc;
        this.ccFolder.doing = onCc;
    }

    async getMessage(id:number):Promise<any> {
        let result = await this.query_getMessage.query({msg:id});
        let {ret, flow} = result;
        if (ret.length === 0) return;
        let r = ret[0];
        return {
            msg: ret[0],
            flow: r.flow,
            flows: flow,
        }
    }

    async getTemplets():Promise<Templet[]> {
        if (this.templets === undefined) {
            let ret = await this.query_getTemplets.query({});
            this.templets = ret.ret;
        }
        return this.templets;
    }
}

class VmUnitx extends VmPage {
    protected coordinator: CrUnitxUsq;

    async showEntry() {
        this.openPage(this.view);
    }

    private unleash = async () => {
        if (confirm("真的要取消关注吗？") === false) return;
        await store.unfollowUnit();
        this.closePage();
    }
    private rightMenu:MenuAction[] = [
        {
            caption: '取消关注',
            icon: 'trash',
            action: this.unleash,
        }
    ];
    private clickToAdmin = async () => {
        let adminApp = await store.getAdminApp();
        let unitId = this.coordinator.unit.id;
        isBridged();
        nav.navToApp(adminApp.url, unitId);
    }

    private view = () => {
        let {tabs} = this.coordinator;
        let {id, name, discription, apps, icon, ownerName, ownerNick, isOwner, isAdmin} = this.coordinator.unit;
        if (ownerNick !== undefined) ownerNick = '- ' + ownerNick;
        let right;
        if (id > 0) {
            right = <DropdownActions actions={this.rightMenu} />;
        }
        return <Page tabs={tabs} header={name} keepHeader={true} right={right} />;
    }
}