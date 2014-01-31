/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

(function(e,t){typeof define=="function"&&define.amd?define([],t):e.visualCaptcha=t()})(this,function(){var e,t,n;return function(r){function v(e,t){return h.call(e,t)}function m(e,t){var n,r,i,s,o,u,a,f,c,h,p,v=t&&t.split("/"),m=l.map,g=m&&m["*"]||{};if(e&&e.charAt(0)===".")if(t){v=v.slice(0,v.length-1),e=e.split("/"),o=e.length-1,l.nodeIdCompat&&d.test(e[o])&&(e[o]=e[o].replace(d,"")),e=v.concat(e);for(c=0;c<e.length;c+=1){p=e[c];if(p===".")e.splice(c,1),c-=1;else if(p===".."){if(c===1&&(e[2]===".."||e[0]===".."))break;c>0&&(e.splice(c-1,2),c-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((v||g)&&m){n=e.split("/");for(c=n.length;c>0;c-=1){r=n.slice(0,c).join("/");if(v)for(h=v.length;h>0;h-=1){i=m[v.slice(0,h).join("/")];if(i){i=i[r];if(i){s=i,u=c;break}}}if(s)break;!a&&g&&g[r]&&(a=g[r],f=c)}!s&&a&&(s=a,u=f),s&&(n.splice(0,u,s),e=n.join("/"))}return e}function g(e,t){return function(){return s.apply(r,p.call(arguments,0).concat([e,t]))}}function y(e){return function(t){return m(t,e)}}function b(e){return function(t){a[e]=t}}function w(e){if(v(f,e)){var t=f[e];delete f[e],c[e]=!0,i.apply(r,t)}if(!v(a,e)&&!v(c,e))throw new Error("No "+e);return a[e]}function E(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function S(e){return function(){return l&&l.config&&l.config[e]||{}}}var i,s,o,u,a={},f={},l={},c={},h=Object.prototype.hasOwnProperty,p=[].slice,d=/\.js$/;o=function(e,t){var n,r=E(e),i=r[0];return e=r[1],i&&(i=m(i,t),n=w(i)),i?n&&n.normalize?e=n.normalize(e,y(t)):e=m(e,t):(e=m(e,t),r=E(e),i=r[0],e=r[1],i&&(n=w(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},u={require:function(e){return g(e)},exports:function(e){var t=a[e];return typeof t!="undefined"?t:a[e]={}},module:function(e){return{id:e,uri:"",exports:a[e],config:S(e)}}},i=function(e,t,n,i){var s,l,h,p,d,m=[],y=typeof n,E;i=i||e;if(y==="undefined"||y==="function"){t=!t.length&&n.length?["require","exports","module"]:t;for(d=0;d<t.length;d+=1){p=o(t[d],i),l=p.f;if(l==="require")m[d]=u.require(e);else if(l==="exports")m[d]=u.exports(e),E=!0;else if(l==="module")s=m[d]=u.module(e);else if(v(a,l)||v(f,l)||v(c,l))m[d]=w(l);else{if(!p.p)throw new Error(e+" missing "+l);p.p.load(p.n,g(i,!0),b(l),{}),m[d]=a[l]}}h=n?n.apply(a[e],m):undefined;if(e)if(s&&s.exports!==r&&s.exports!==a[e])a[e]=s.exports;else if(h!==r||!E)a[e]=h}else e&&(a[e]=n)},e=t=s=function(e,t,n,a,f){if(typeof e=="string")return u[e]?u[e](t):w(o(e,t).f);if(!e.splice){l=e,l.deps&&s(l.deps,l.callback);if(!t)return;t.splice?(e=t,t=n,n=null):e=r}return t=t||function(){},typeof n=="function"&&(n=a,a=f),a?i(r,e,t,n):setTimeout(function(){i(r,e,t,n)},4),s},s.config=function(e){return s(e)},e._defined=a,n=function(e,t,n){t.splice||(n=t,t=[]),!v(a,e)&&!v(f,e)&&(f[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("almond",function(){}),n("visualcaptcha/core",[],function(){var e,t,n,r,i,s,o;return e=function(e){var n=this,r;e.applyRandomNonce(),e.isLoading=!0,r=t(e),e.callbacks.loading&&e.callbacks.loading(n),e.request(r,function(t){t.audioFieldName&&(e.audioFieldName=t.audioFieldName),t.imageFieldName&&(e.imageFieldName=t.imageFieldName),t.imageName&&(e.imageName=t.imageName),t.values&&(e.imageValues=t.values),e.isLoading=!1,e.hasLoaded=!0,e.callbacks.loaded&&e.callbacks.loaded(n)})},t=function(e){return e.url+e.routes.start+"/"+e.numberOfImages+"?r="+e.randomNonce},n=function(e,t){return t>=0&&t<e.numberOfImages?e.url+e.routes.image+"/"+t+"?"+(s()?"retina=1&":"")+"r="+e.randomNonce:""},r=function(e,t){return e.url+e.routes.audio+(t?"/ogg":"")+"?r="+e.randomNonce},i=function(e,t){return t>=0&&t<e.numberOfImages?e.imageValues[t]:""},s=function(){return window.devicePixelRatio!==undefined&&window.devicePixelRatio>1},o=function(){var e,t=!1;try{e=document.createElement("audio"),e.canPlayType&&(t=!0)}catch(n){}return t},function(t){var u,a,f,l,c,h,p,d,v,m,g;return a=function(){return e.call(this,t)},f=function(){return t.isLoading},l=function(){return t.hasLoaded},c=function(){return t.imageValues.length},h=function(){return t.imageName},p=function(e){return i.call(this,t,e)},d=function(e){return n.call(this,t,e)},v=function(e){return r.call(this,t,e)},m=function(){return t.imageFieldName},g=function(){return t.audioFieldName},u={refresh:a,isLoading:f,hasLoaded:l,numberOfImages:c,imageName:h,imageValue:p,imageUrl:d,audioUrl:v,imageFieldName:m,audioFieldName:g,isRetina:s,supportsAudio:o},t.autoRefresh&&u.refresh(),u}}),n("visualcaptcha/xhr-request",[],function(){var e=window.XMLHttpRequest;return function(t,n){var r=new e;r.open("GET",t,!0),r.onreadystatechange=function(){var e;if(r.readyState!==4||r.status!==200)return;e=JSON.parse(r.responseText),n(e)},r.send()}}),n("visualcaptcha/config",["visualcaptcha/xhr-request"],function(e){return function(t){var n={request:e,url:"http://localhost:8282",path:"",routes:{start:"/start",image:"/image",audio:"/audio"},isLoading:!1,hasLoaded:!1,autoRefresh:!0,numberOfImages:6,randomNonce:"",audioFieldName:"",imageFieldName:"",imageName:"",imageValues:[],callbacks:{}};return n.applyRandomNonce=function(){return n.randomNonce=Math.random().toString(36).substring(2)},t.request&&(n.request=t.request),t.url&&(n.url=t.url),t.path&&(n.path=t.path),typeof t.autoRefresh!="undefined"&&(n.autoRefresh=t.autoRefresh),t.numberOfImages&&(n.numberOfImages=t.numberOfImages),t.routes&&(t.routes.start&&(n.routes.start=t.routes.start),t.routes.image&&(n.routes.image=t.routes.image),t.routes.audio&&(n.routes.audio=t.routes.audio)),t.callbacks&&(t.callbacks.loading&&(n.callbacks.loading=t.callbacks.loading),t.callbacks.loaded&&(n.callbacks.loaded=t.callbacks.loaded)),n}}),n("visualcaptcha",["require","visualcaptcha/core","visualcaptcha/config"],function(e){var t=e("visualcaptcha/core"),n=e("visualcaptcha/config");return function(e){return e=e||{},t(n(e))}}),n("visualcaptcha/deep-extend",[],function(){var e;return e=function(t,n){for(var r in n)n[r]&&n[r].constructor&&n[r].constructor===Object?(t[r]=t[r]||{},e(t[r],n[r])):t[r]=n[r];return t},e}),n("visualcaptcha/helpers",[],function(){var e,t,n,r,i,s,o;return e=function(e,t){return t?e[0]:Array.prototype.slice.call(e)},t=function(t,n,r){var i=t.getElementsByClassName(n);return e(i,r)},n=function(t,n,r){var i=t.getElementsByTagName(n);return e(i,r)},r=function(e,t){var n=new RegExp("(\\s|^)"+t+"(\\s|$)");return e.className&&n.test(e.className)},i=function(e,t){if(Array.isArray(e))for(var n=0;n<e.length;n++)i(e[n],t);else r(e,t)||(e.className.length>0?e.className+=" "+t:e.className=t)},s=function(e,t){var n;if(Array.isArray(e))for(var r=0;r<e.length;r++)s(e[r],t);else n=new RegExp("(\\s|^)"+t+"(\\s|$)"),e.className=e.className.replace(n," ").replace(/(^\s*)|(\s*$)/g,"")},o=function(e,t){if(Array.isArray(e))for(var n=0;n<e.length;n++)o(e[n],t);else e.addEventListener?e.addEventListener("click",t,!1):e.attachEvent("onclick",t)},{findByClass:t,findByTag:n,hasClass:r,addClass:i,removeClass:s,bindClick:o}}),n("visualcaptcha/templates",[],function(){var e,t,n,r,i,s;return e=function(e,t){for(var n in t)e=e.replace(new RegExp("{"+n+"}","g"),t[n]);return e},t=function(t,n,r){var i,s,o,u;return i='<div class="visualCaptcha-accessibility-button"><img src="{path}accessibility{retinaExtra}.png" title="{accessibilityTitle}" alt="{accessibilityAlt}" /></div>',s='<div class="visualCaptcha-refresh-button"><img src="{path}refresh{retinaExtra}.png" title="{refreshTitle}" alt="{refreshAlt}" /></div>',o='<div class="visualCaptcha-button-group">'+s+(t.supportsAudio()?i:"")+"</div>",u={path:r||"",refreshTitle:n.refreshTitle,refreshAlt:n.refreshAlt,accessibilityTitle:n.accessibilityTitle,accessibilityAlt:n.accessibilityAlt,retinaExtra:t.isRetina()?"@2x":""},e(o,u)},n=function(t,n){var r,i;return t.supportsAudio()?(r='<div class="visualCaptcha-accessibility-wrapper visualCaptcha-hide"><div class="accessibility-description">{accessibilityDescription}</div><audio preload="preload"><source src="{audioURL}" type="audio/ogg" /><source src="{audioURL}" type="audio/mpeg" /></audio></div>',i={accessibilityDescription:n.accessibilityDescription,audioURL:t.audioUrl(),audioFieldName:t.audioFieldName()},e(r,i)):""},r=function(t,n){var r="",i,s;for(var o=0,u=t.numberOfImages();o<u;o++)i='<div class="img"><img src="{imageUrl}" id="visualCaptcha-img-{i}" data-index="{i}" alt="" title="" /></div>',s={imageUrl:t.imageUrl(o),i:o},r+=e(i,s);return i='<p class="visualCaptcha-explanation">{explanation}</p><div class="visualCaptcha-possibilities">{images}</div>',s={imageFieldName:t.imageFieldName(),explanation:n.explanation.replace(/ANSWER/,t.imageName()),images:r},e(i,s)},i=function(t){var n,r;return n='<input class="audioField" type="text" name="{audioFieldName}" value="" autocomplete="off" />',r={audioFieldName:t.audioFieldName()},e(n,r)},s=function(t,n){var r,i;return r='<input class="imageField" type="hidden" name="{imageFieldName}" value="{value}" readonly="readonly" />',i={imageFieldName:t.imageFieldName(),value:t.imageValue(n)},e(r,i)},{buttons:t,accessibility:n,images:r,audioInput:i,imageInput:s}}),n("visualcaptcha/language",[],function(){return{accessibilityAlt:"Sound icon",accessibilityTitle:"Accessibility option: listen to a question and answer it!",accessibilityDescription:"Type below the <strong>answer</strong> to what you hear. Numbers or words:",explanation:"Click or touch the <strong>ANSWER</strong>",refreshAlt:"Refresh/reload icon",refreshTitle:"Refresh/reload: get new images and accessibility option!"}}),n("visualcaptcha.vanilla",["visualcaptcha","visualcaptcha/deep-extend","visualcaptcha/helpers","visualcaptcha/templates","visualcaptcha/language"],function(e,t,n,r,i){var s,o,u,a,f,l;return s=function(){},o=function(e,t){var i=e.config,s,o;s=r.accessibility(t,i.language)+r.images(t,i.language)+r.buttons(t,i.language,i.imgPath),e.innerHTML=s,o=n.findByClass(e,"visualCaptcha-accessibility-button",!0),n.bindClick(o,u.bind(null,e,t)),o=n.findByClass(e,"visualCaptcha-refresh-button",!0),n.bindClick(o,f.bind(null,e,t)),o=n.findByClass(e,"visualCaptcha-possibilities",!0),n.bindClick(n.findByClass(o,"img"),a.bind(null,e,t))},u=function(e,t){var i=n.findByClass(e,"visualCaptcha-accessibility-wrapper",!0),s=n.findByClass(e,"visualCaptcha-possibilities",!0),o=n.findByClass(e,"visualCaptcha-explanation",!0),u=n.findByTag(i,"audio",!0),a,f,l,c;n.hasClass(i,"visualCaptcha-hide")?(n.addClass(s,"visualCaptcha-hide"),n.addClass(o,"visualCaptcha-hide"),a=n.findByClass(s,"img"),n.removeClass(a,"visualCaptcha-selected"),f=n.findByTag(o,"input",!0),f!==undefined&&(f.value=""),c=r.audioInput(t),i.innerHTML=i.innerHTML.replace("<audio",c+"<audio"),n.removeClass(i,"visualCaptcha-hide"),u.load(),u.play()):(u.pause(),n.addClass(i,"visualCaptcha-hide"),l=n.findByTag(i,"input",!0),i.removeChild(l),n.removeClass(o,"visualCaptcha-hide"),n.removeClass(s,"visualCaptcha-hide"))},a=function(e,t,i){var s=i.currentTarget,o=n.findByClass(e,"visualCaptcha-possibilities",!0),u=n.findByClass(e,"visualCaptcha-explanation",!0),a,f,l,c,h;c=n.findByTag(u,"input",!0),c&&(u.removeChild(c),f=n.findByClass(o,"img"),n.removeClass(f,"visualCaptcha-selected")),n.addClass(s,"visualCaptcha-selected"),a=n.findByTag(s,"img",!0),l=parseInt(a.getAttribute("data-index"),10),h=r.imageInput(t,l),u.innerHTML+=h},f=function(e,t){t.refresh()},l=function(e){var t=n.findByClass(e,"imageField",!0)||{},r=n.findByClass(e,"audioField",!0)||{},i=!!t.value||!!r.value;return i?{valid:i,name:t.value?t.name:r.name,value:t.value?t.value:r.value}:{valid:i}},function(r,u){var a,f;return a=t({imgPath:"/",language:i,captcha:{}},u),r=typeof r=="string"?document.getElementById(r):r,r.config=a,n.addClass(r,"visualCaptcha"),f=e(t(a.captcha,{callbacks:{loading:s.bind(null,r),loaded:o.bind(null,r)}})),typeof a.init=="function"&&(f.getCaptchaData=function(){return l(r)},a.init.call(null,f)),f}}),t("visualcaptcha.vanilla")});