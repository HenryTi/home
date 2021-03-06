/*
import * as React from 'react';
import { VPage, Page, Form, ItemSchema, UiSchema, StringSchema, UiTextItem, UiPasswordItem, Context, ButtonSchema, UiButton } from 'tonva';
import { CHome } from './cHome';
import mainApi from '../mainApi';

export class VChangePassword extends VPage<CHome> {
    private schema: ItemSchema[] = [
        {name:'orgPassword', type: 'string', maxLength: 60, required: true} as StringSchema,
        {name:'newPassword', type: 'string', maxLength: 60, required: true} as StringSchema,
        {name:'newPassword1', type: 'string', maxLength: 60, required: true} as StringSchema,
        {name:'submit', type: 'button'} as ButtonSchema
    ];
    private uiSchema: UiSchema = {
        items: {
            orgPassword: {
                label: '原密码',
                placeholder: '输入原来的密码'
            } as UiPasswordItem,
            newPassword: {
                label: '新密码',
                placeholder: '输入新设的密码'
            } as UiPasswordItem,
            newPassword1: {
                label: '确认密码', 
                placeholder: '再次输入新设密码'
            } as UiPasswordItem,
            submit: {
                widget: 'button',
                label: '提交',
                className: 'btn btn-primary'
            } as UiButton,
        }
    };
    async open() {
        this.openPage(this.page);
    }

    private onSubmit = async (name:string, context: Context):Promise<any> => {
        let {orgPassword, newPassword, newPassword1} = context.data;
        if (newPassword !== newPassword1) {
            context.setError('newPassword1', '新密码错误，请重新输入');
            return;
        }
        let ret = await mainApi.changePassword({orgPassword: orgPassword, newPassword:newPassword});
        if (ret === false) {
            context.setError('orgPassword', '原密码错误');
            return;
        }
        this.replacePageElement(<Page header="修改密码" back="close">
            <div className="m-3  text-success">
                密码修改成功！
            </div>
        </Page>);
        return;
    }

    private page = ():JSX.Element => {
        return <Page header="修改密码">
            <Form
                className="m-3" 
                schema={this.schema}
                uiSchema={this.uiSchema}
                onButtonClick={this.onSubmit}
                fieldLabelSize={2} />
        </Page>;
    }
}
*/