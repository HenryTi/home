(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{202:function(e,t,n){"use strict";n.r(t),n.d(t,"ChangePasswordPage",function(){return i});var s=n(0),a=n(10),r=n(9),o=function(e,t,n,s){return new(n||(n=Promise))(function(a,r){function o(e){try{c(s.next(e))}catch(t){r(t)}}function i(e){try{c(s.throw(e))}catch(t){r(t)}}function c(e){e.done?a(e.value):new n(function(t){t(e.value)}).then(o,i)}c((s=s.apply(e,t||[])).next())})};class i extends s.Component{constructor(){super(...arguments),this.schema=[{name:"orgPassword",type:"string",maxLength:60,required:!0},{name:"newPassword",type:"string",maxLength:60,required:!0},{name:"newPassword1",type:"string",maxLength:60,required:!0},{name:"submit",type:"button"}],this.uiSchema={items:{orgPassword:{label:"\u539f\u5bc6\u7801",placeholder:"\u8f93\u5165\u539f\u6765\u7684\u5bc6\u7801"},newPassword:{label:"\u65b0\u5bc6\u7801",placeholder:"\u8f93\u5165\u65b0\u8bbe\u7684\u5bc6\u7801"},newPassword1:{label:"\u786e\u8ba4\u5bc6\u7801",placeholder:"\u518d\u6b21\u8f93\u5165\u65b0\u8bbe\u5bc6\u7801"},submit:{widget:"button",label:"\u63d0\u4ea4",className:"btn btn-primary"}}},this.onSubmit=((e,t)=>o(this,void 0,void 0,function*(){let{orgPassword:e,newPassword:n,newPassword1:o}=t.data;if(n!==o)return void t.setError("newPassword1","\u65b0\u5bc6\u7801\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165");let i=new r.b("tv/",void 0);!1!==(yield i.changePassword({orgPassword:e,newPassword:n}))?a.nav.replace(s.createElement(a.Page,{header:"\u4fee\u6539\u5bc6\u7801",back:"close"},s.createElement("div",{className:"m-3  text-success"},"\u5bc6\u7801\u4fee\u6539\u6210\u529f\uff01"))):t.setError("orgPassword","\u539f\u5bc6\u7801\u9519\u8bef")}))}render(){return s.createElement(a.Page,{header:"\u4fee\u6539\u5bc6\u7801"},s.createElement(a.Form,{className:"m-3",schema:this.schema,uiSchema:this.uiSchema,onButtonClick:this.onSubmit,fieldLabelSize:2}))}}}}]);
//# sourceMappingURL=2.8bdc1f15.chunk.js.map