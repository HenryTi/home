import {ApiNav, User} from 'tonva-tools';

class MainApi extends ApiNav {
    async stickies():Promise<any[]> {
        return await this.get('sticky/list', {start:0, pageSize:30});
    }

    async ties():Promise<any[]> {
        return await this.get('tie/list', {start:0, pageSize:30});
    }

    async apps(unit:number):Promise<any> {
        return await this.get('tie/apps', {unit:unit});
    }

    async appApi(unit:number, app:number, apiName:string) {
        return await this.get('tie/app-api', {unit:unit, app:app, apiName:apiName});
    }

    loadFollows(pageSize:number, minName:string) {
        return this.get('follows', {pageSize:pageSize, minName: minName});
    }
    tieHao(tie:number) {
        return this.get('tie-hao', {tie: tie});
    }
    toHome(tie:number) {
        return this.post('to-home', {tie: tie});
    }
    dbInit() {
        return this.get('dbInit', undefined).then(res => res);
    }
}

const mainApi = new MainApi('tv/');
export default mainApi;
