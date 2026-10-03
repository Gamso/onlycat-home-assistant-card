function t(t,e,o,i){var n,s=arguments.length,r=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,o,i);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(s<3?n(r):s>3?n(e,o,r):n(e,o))||r);return s>3&&r&&Object.defineProperty(e,o,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,o=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let s=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(o&&void 0===t){const o=void 0!==e&&1===e.length;o&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&n.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,o,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[i+1],t[0]);return new s(o,t,i)},a=o?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,y=m.trustedTypes,f=y?y.emptyScript:"",v=m.reactiveElementPolyfillSupport,_=(t,e)=>t,g={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(t){o=null}}return o}},b=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:g,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(t,o,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,o){const{get:i,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const s=i?.call(this);n?.call(this,e),this.requestUpdate(t,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const o of e)this.createProperty(o,t[o])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,o]of e)this.elementProperties.set(t,o)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const o=this._$Eu(t,e);void 0!==o&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(o)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const o of i){const i=document.createElement("style"),n=e.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=o.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){const o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(void 0!==i&&!0===o.reflect){const n=(void 0!==o.converter?.toAttribute?o.converter:g).toAttribute(e,o.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const o=this.constructor,i=o._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=o.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:g;this._$Em=i;const s=n.fromAttribute(e,t.type);this[i]=s??this._$Ej?.get(i)??s,this._$Em=null}}requestUpdate(t,e,o,i=!1,n){if(void 0!==t){const s=this.constructor;if(!1===i&&(n=this[t]),o??=s.getPropertyOptions(t),!((o.hasChanged??b)(n,e)||o.useDefault&&o.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,o))))return;this.C(t,e,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:i,wrapped:n},s){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==n||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,o]of t){const{wrapped:t}=o,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,o,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[_("elementProperties")]=new Map,x[_("finalized")]=new Map,v?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,k=t=>t,A=w.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+T,z=`<${S}>`,P=document,O=()=>P.createComment(""),I=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,D="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,N=/>/g,H=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,L=/"/g,q=/^(?:script|style|textarea|title)$/i,B=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),Z=B(1),W=B(2),F=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),J=new WeakMap,Y=P.createTreeWalker(P,129);function K(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const G=(t,e)=>{const o=t.length-1,i=[];let n,s=2===e?"<svg>":3===e?"<math>":"",r=M;for(let e=0;e<o;e++){const o=t[e];let a,c,l=-1,d=0;for(;d<o.length&&(r.lastIndex=d,c=r.exec(o),null!==c);)d=r.lastIndex,r===M?"!--"===c[1]?r=R:void 0!==c[1]?r=N:void 0!==c[2]?(q.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=H):void 0!==c[3]&&(r=H):r===H?">"===c[0]?(r=n??M,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?H:'"'===c[3]?L:j):r===L||r===j?r=H:r===R||r===N?r=M:(r=H,n=void 0);const h=r===H&&t[e+1].startsWith("/>")?" ":"";s+=r===M?o+z:l>=0?(i.push(a),o.slice(0,l)+C+o.slice(l)+T+h):o+T+(-2===l?e:h)}return[K(t,s+(t[o]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class X{constructor({strings:t,_$litType$:e},o){let i;this.parts=[];let n=0,s=0;const r=t.length-1,a=this.parts,[c,l]=G(t,e);if(this.el=X.createElement(c,o),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Y.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=l[s++],o=i.getAttribute(t).split(T),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:o,ctor:"."===r[1]?it:"?"===r[1]?nt:"@"===r[1]?st:ot}),i.removeAttribute(t)}else t.startsWith(T)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(q.test(i.tagName)){const t=i.textContent.split(T),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let o=0;o<e;o++)i.append(t[o],O()),Y.nextNode(),a.push({type:2,index:++n});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===S)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(T,t+1));)a.push({type:7,index:n}),t+=T.length-1}n++}}static createElement(t,e){const o=P.createElement("template");return o.innerHTML=t,o}}function Q(t,e,o=t,i){if(e===F)return e;let n=void 0!==i?o._$Co?.[i]:o._$Cl;const s=I(e)?void 0:e._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),void 0===s?n=void 0:(n=new s(t),n._$AT(t,o,i)),void 0!==i?(o._$Co??=[])[i]=n:o._$Cl=n),void 0!==n&&(e=Q(t,n._$AS(t,e.values),n,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);Y.currentNode=i;let n=Y.nextNode(),s=0,r=0,a=o[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new et(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new rt(n,this,t)),this._$AV.push(e),a=o[++r]}s!==a?.index&&(n=Y.nextNode(),s++)}return Y.currentNode=P,i}p(t){let e=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),I(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:o}=t,i="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=X.createElement(K(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),o=t.u(this.options);t.p(e),this.T(o),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new X(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,i=0;for(const n of t)i===e.length?e.push(o=new et(this.O(O()),this.O(O()),this,this.options)):o=e[i],o._$AI(n),i++;i<e.length&&(this._$AR(o&&o._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class ot{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,i,n){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=V}_$AI(t,e=this,o,i){const n=this.strings;let s=!1;if(void 0===n)t=Q(this,t,e,0),s=!I(t)||t!==this._$AH&&t!==F,s&&(this._$AH=t);else{const i=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=Q(this,i[o+r],e,r),a===F&&(a=this._$AH[r]),s||=!I(a)||a!==this._$AH[r],a===V?t=V:t!==V&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}s&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends ot{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class nt extends ot{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class st extends ot{constructor(t,e,o,i,n){super(t,e,o,i,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??V)===F)return;const o=this._$AH,i=t===V&&o!==V||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,n=t!==V&&(o===V||i);i&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(X,et),(w.litHtmlVersions??=[]).push("3.3.2");const ct=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{const i=o?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=o?.renderBefore??null;i._$litPart$=n=new et(e.insertBefore(O(),t),t,void 0,o??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:b},pt=(t=ht,e,o)=>{const{kind:i,metadata:n}=o;let s=globalThis.litPropertyMetadata.get(n);if(void 0===s&&globalThis.litPropertyMetadata.set(n,s=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),s.set(o.name,t),"accessor"===i){const{name:i}=o;return{set(o){const n=e.get.call(this);e.set.call(this,o),this.requestUpdate(i,n,t,!0,o)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=o;return function(o){const n=this[i];e.call(this,o),this.requestUpdate(i,n,t,!0,o)}}throw Error("Unsupported decorator location: "+i)};function ut(t){return(e,o)=>"object"==typeof o?pt(t,e,o):((t,e,o)=>{const i=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),i?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function mt(t){return ut({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function yt(t,e){return(e,o,i)=>((t,e,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,o),o))(e,o,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}const ft={en:{card:{name_default:"Cat Flap",config_required:"Please configure the OnlyCat card.",locked:"Locked",unlocked:"Unlocked",connected:"Connected",offline:"Offline",unavailable:"Unavailable",policy:"Policy",no_recent_activity:"No recent activity",errors:"Device errors"},actions:{unlock:"Unlock",unlock_title:"Unlock now",restart:"Restart",restart_title:"Restart the cat flap",cancel:"Cancel"},camera:{title:"Last activity",stream_unavailable:"Stream unavailable.",open:"Open the last activity video"},history:{title:"Activity history",loading:"Loading…",error:"Unable to load history.",passage_detected:"Passage detected",prey_detected:"Prey detected",human_detected:"Human detected",row_flap:"Passage",row_prey:"Prey",row_human:"Human",unlock_triggered:"Triggered by unlock button",previous_event:"Previous event",next_event:"Next event",close_zoom:"Close zoom",previous_day:"Previous day",next_day:"Next day"},time:{just_now:"just now",minutes_ago:"{n} min ago",hours_ago:"{h}h ago",hours_minutes_ago:"{h}h{m} ago",days_ago:"{d}d ago"},confirm_restart:{title:"Confirm restart",question:"Are you sure you want to restart the cat flap?",note:"The cat flap will be temporarily offline during the restart."},editor:{name:"Card name",device:"OnlyCat device",device_hint:"Device created by the OnlyCat integration",show_title:"Show title",entities:"Entities",entities_hint:"Leave empty to detect them from the device. Only needed for renamed entities.",advanced:"Advanced",history_days:"Days of history",history_days_hint:"How many past days the timeline can browse (default {n})",device_id:"OnlyCat device id (legacy)",device_id_hint:"Entity id prefix, e.g. oc_0cbfb5801849. Kept for configurations made before the device picker."},entity:{camera:"Last activity video",image:"Last activity image",lock:"Lock",connectivity:"Connectivity",errors:"Device errors",event:"Passage event",contraband:"Prey event",human:"Human event",policy:"Door policy",unlock:"Unlock button",reboot:"Reboot button"}},fr:{card:{name_default:"Chatière",config_required:"Veuillez configurer la carte OnlyCat.",locked:"Verrouillé",unlocked:"Ouvert",connected:"Connecté",offline:"Hors ligne",unavailable:"Indisponible",policy:"Politique",no_recent_activity:"Aucune activité récente",errors:"Erreurs de l'appareil"},actions:{unlock:"Déverrouiller",unlock_title:"Déverrouiller maintenant",restart:"Redémarrer",restart_title:"Redémarrer la chatière",cancel:"Annuler"},camera:{title:"Dernière activité",stream_unavailable:"Flux indisponible.",open:"Ouvrir la vidéo de la dernière activité"},history:{title:"Historique des activités",loading:"Chargement…",error:"Impossible de charger l'historique.",passage_detected:"Passage détecté",prey_detected:"Proie détectée",human_detected:"Humain détecté",row_flap:"Passage",row_prey:"Proie",row_human:"Humain",unlock_triggered:"Déclenché par déverrouillage",previous_event:"Événement précédent",next_event:"Événement suivant",close_zoom:"Fermer le zoom",previous_day:"Jour précédent",next_day:"Jour suivant"},time:{just_now:"à l'instant",minutes_ago:"il y a {n} min",hours_ago:"il y a {h}h",hours_minutes_ago:"il y a {h}h{m}",days_ago:"il y a {d} j"},confirm_restart:{title:"Confirmer le redémarrage",question:"Êtes-vous sûr de vouloir redémarrer la chatière ?",note:"La chatière sera temporairement hors ligne pendant le redémarrage."},editor:{name:"Nom de la carte",device:"Appareil OnlyCat",device_hint:"Appareil créé par l'intégration OnlyCat",show_title:"Afficher le titre",entities:"Entités",entities_hint:"Laisser vide pour les détecter depuis l'appareil. Utile seulement pour des entités renommées.",advanced:"Avancé",history_days:"Jours d'historique",history_days_hint:"Nombre de jours passés consultables dans la frise (par défaut {n})",device_id:"Identifiant OnlyCat (ancien format)",device_id_hint:"Préfixe des identifiants d'entité, ex. oc_0cbfb5801849. Conservé pour les configurations antérieures au sélecteur d'appareil."},entity:{camera:"Vidéo de la dernière activité",image:"Image de la dernière activité",lock:"Verrou",connectivity:"Connectivité",errors:"Erreurs de l'appareil",event:"Événement de passage",contraband:"Événement proie",human:"Événement humain",policy:"Politique de la porte",unlock:"Bouton de déverrouillage",reboot:"Bouton de redémarrage"}}};function vt(t,e){const o=e.indexOf("."),i=e.slice(0,o),n=e.slice(o+1),s=t[i];return"object"==typeof s?s[n]:void 0}function _t(t,e){return vt(ft[function(t){return(t?.locale?.language??t?.language??"en").toLowerCase().startsWith("fr")?"fr":"en"}(t)],e)??vt(ft.en,e)??e}function gt(t,e,o){let i=_t(t,e);for(const[t,e]of Object.entries(o))i=i.replace(`{${t}}`,String(e));return i}const bt="onlycat",$t={camera:{domain:"camera",key:"onlycat_last_activity_video",suffix:"last_activity_video"},image:{domain:"image",key:"onlycat_last_activity_image",suffix:"last_activity_image"},lock:{domain:"binary_sensor",key:"onlycat_lock_sensor",suffix:"lock"},connectivity:{domain:"binary_sensor",key:"onlycat_connection_sensor",suffix:"connectivity"},errors:{domain:"binary_sensor",key:"onlycat_error_sensor",suffix:"errors"},event:{domain:"binary_sensor",key:"onlycat_event_sensor",suffix:"event"},contraband:{domain:"binary_sensor",key:"onlycat_contraband_sensor",suffix:"contraband"},human:{domain:"binary_sensor",key:"onlycat_human_sensor",suffix:"human"},policy:{domain:"select",key:"onlycat_policy_select",suffix:"policy"},unlock:{domain:"button",key:"onlycat_unlock_button",suffix:"unlock"},reboot:{domain:"button",key:"onlycat_reboot_button",suffix:"reboot"}},xt=Object.keys($t);function wt(t,e){const{domain:o,suffix:i}=$t[e];return t?`${o}.${t}_${i}`:""}function kt(t,e){if(e.device)return e.device;const o=t?.entities;if(o)for(const t of xt){const i=[e.entities?.[t],wt(e.device_id??"",t)];for(const t of i){const e=t?o[t]?.device_id:void 0;if(e)return e}}}function At(t,e){const o=e.device_id??"",i=kt(t,e),n=i?Object.values(t?.entities??{}).filter(t=>!!t&&t.device_id===i&&(void 0===t.platform||t.platform===bt)):[],s={};for(const i of xt){const{domain:r,key:a,suffix:c}=$t[i],l=e.entities?.[i],d=wt(o,i),h=n.filter(t=>t.entity_id.startsWith(`${r}.`)),p=!(!d||!t?.states?.[d]||e.device&&t.entities?.[d]?.device_id!==e.device);s[i]=l||(p?d:"")||h.find(t=>t.translation_key===a)?.entity_id||h.find(t=>t.entity_id.endsWith(`_${c}`))?.entity_id||d}return s}function Et(t){if("state"in t){const e=t,o=new Date(e.last_changed).getTime();return isNaN(o)?null:{state:e.state,ts:o}}const e=t,o=e.lc??e.lu;return void 0===o?null:{state:e.s,ts:o>1e12?o:1e3*o}}const Ct=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}};const Tt=new Map;function St(t,e){const o={};for(const i of function(t){let e=Tt.get(t);return e||(e=new Intl.DateTimeFormat("en-US",{timeZone:t,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}),Tt.set(t,e)),e}(e).formatToParts(new Date(t)))"literal"!==i.type&&(o[i.type]=Number(i.value));return{year:o.year,month:o.month,day:o.day,hour:o.hour%24,minute:o.minute,second:o.second}}function zt(t,e){const o=St(t,e);return Date.UTC(o.year,o.month-1,o.day,o.hour,o.minute,o.second)-(t-(t%1e3+1e3)%1e3)}function Pt(t,e,o,i){const n=Date.UTC(t.year,t.month-1,t.day,e,o),s=zt(n,i),r=n-s,a=zt(r,i);return a===s?r:n-a}function Ot(t,e){const o=new Date(Date.UTC(t.year,t.month-1,t.day+e));return{year:o.getUTCFullYear(),month:o.getUTCMonth()+1,day:o.getUTCDate()}}function It(t,e){const o=t.end-t.start;return o<=0?0:Math.min(1,Math.max(0,(e-t.start)/o))}function Ut(t,e){if(!e)return`${t}h`;return`${t%12==0?12:t%12} ${t%24<12?"AM":"PM"}`}function Dt(t,e,o,i,n=!1){return new Intl.DateTimeFormat(o,{timeZone:e,hour:"2-digit",minute:"2-digit",...n?{second:"2-digit"}:{},hourCycle:i?"h12":"h23"}).format(new Date(t))}function Mt(t,e,o){const{hour:i,minute:n}=St(t,e);if(0===n)return Ut(i,o);const s=String(n).padStart(2,"0");if(!o)return`${i}h${s}`;return`${i%12==0?12:i%12}:${s} ${i<12?"AM":"PM"}`}class Rt extends lt{constructor(){super(...arguments),this.historyDays=10,this._show=!1,this._loading=!1,this._hasFetched=!1,this._error=null,this._data=[[],[],[]],this._lockData=[],this._window=null,this._offsetPages=0,this._zoom=null,this._requestId=0}get _timeZone(){return t=this.hass,"local"===t?.locale?.time_zone?Ct():t?.config?.time_zone||Ct();var t}get _amPm(){return function(t){const e=t?.time_format??"language";if("12"===e)return!0;if("24"===e)return!1;const o="system"===e?void 0:t?.language;return new Date("January 1, 2023 22:00:00").toLocaleString(o).includes("10")}(this.hass?.locale)}get _lang(){return this.hass?.locale?.language??"en"}_targetWindow(){return function(t,e,o){const i=Ot(St(t,o),-e),n=Pt(i,0,0,o),s=Pt(Ot(i,1),0,0,o);return{timeZone:o,day:i,start:n,end:0===e?Math.min(Math.max(t,n+1),s):s,dayEnd:s}}(Date.now(),this._offsetPages,this._timeZone)}_isEntityOn(t){return"on"===this.hass?.states?.[t]?.state}async _load(){const t=++this._requestId,e=this._targetWindow();this._loading=!0,this._error=null;try{const s=[this.eventEntityId,this.contrabandEntityId,this.humanEntityId,this.lockEntityId??""],r=s.filter(t=>!!t),a=r.length?await this.hass.callApi("GET",(o=r,i=e.start,n=e.end,`history/period/${new Date(i).toISOString()}?filter_entity_id=${o.join(",")}&end_time=${new Date(n).toISOString()}&minimal_response&no_attributes&significant_changes_only=false`)):[];if(t!==this._requestId)return;const c=function(t,e,o){const i=e.map(()=>[]);if(!Array.isArray(t))return i;for(const n of t){if(!n?.length)continue;const t=n[0],s=t.entity_id?e.indexOf(t.entity_id):-1;if(-1===s)continue;let r=null;for(const t of n){const e=Et(t);e&&("on"===e.state&&null===r?r=e.ts:"on"!==e.state&&null!==r&&(i[s].push({startTs:r,endTs:e.ts}),r=null))}null!==r&&i[s].push({startTs:r,endTs:Math.max(r,o)})}return i}(a,s,e.end);this._data=[c[0],c[1],c[2]],this._lockData=c[3],this._window=e,this._zoom=null,this._hasFetched=!0}catch(e){if(t!==this._requestId)return;console.error("[OnlyCat] history error",e),this._error=_t(this.hass,"history.error")}finally{t===this._requestId&&(this._loading=!1)}var o,i,n}_toggle(){this._show=!this._show,this._show&&this._load()}_navPrev(){this._loading||this._offsetPages>=this.historyDays||(this._offsetPages++,this._load())}_navNext(){this._loading||0===this._offsetPages||(this._offsetPages--,this._load())}_formatDateRange(){const{start:t,timeZone:e}=this._targetWindow();return new Intl.DateTimeFormat(this._lang,{timeZone:e,weekday:"short",month:"short",day:"numeric"}).format(new Date(t))}_formatTooltip(t,e){const o=t=>Dt(t,this._timeZone,this._lang,this._amPm),i=Math.round((e-t)/1e3),n=i<60?`${i}s`:i<3600?`${Math.floor(i/60)}min${i%60>0?" "+i%60+"s":""}`:`${Math.floor(i/3600)}h ${Math.floor(i%3600/60)}min`;return`${o(t)} – ${o(e)} (${n})`}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._zoomTimer)}_onBarEnter(t,e,o,i){clearTimeout(this._zoomTimer);const n=this._data[i]?.indexOf(t)??0;this._zoom={centerTs:(t.startTs+t.endTs)/2,highlightStartTs:t.startTs,highlightEndTs:t.endTs,color:e,label:o,rowIndex:i,eventIndex:n}}_zoomNavigate(t){if(!this._zoom)return;const e=this._data[this._zoom.rowIndex],o=this._zoom.eventIndex+t;if(o<0||o>=e.length)return;const i=e[o];this._zoom={...this._zoom,eventIndex:o,centerTs:(i.startTs+i.endTs)/2,highlightStartTs:i.startTs,highlightEndTs:i.endTs}}_onBarLeave(){clearTimeout(this._zoomTimer),this._zoomTimer=setTimeout(()=>{this._zoom=null},200)}_onBarPointerEnter(t,e,o,i,n){"mouse"===t.pointerType&&(t.stopPropagation(),this._onBarEnter(e,o,i,n))}_onBarClick(t,e,o,i,n){t.stopPropagation();const s="mouse"===t.pointerType;this._zoom?.rowIndex===n&&this._zoom.highlightStartTs===e.startTs&&this._zoom.highlightEndTs===e.endTs&&!s?this._closeZoom():this._onBarEnter(e,o,i,n)}_onPointerLeave(t){"mouse"===t.pointerType&&this._onBarLeave()}_closeZoom(){clearTimeout(this._zoomTimer),this._zoom=null}_renderZoom(){const t=this._zoom,e=t.highlightEndTs-t.highlightStartTs,o=Math.max(18e5,Math.min(72e5,30*e)),i=t.centerTs-o/2,n=t.centerTs+o/2,s=o,r=t=>Mt(t,this._timeZone,this._amPm),a=Math.round((t.highlightEndTs-t.highlightStartTs)/1e3),c=a<60?`${a}s`:`${Math.floor(a/60)}min${a%60?" "+a%60+"s":""}`,l=0===t.rowIndex&&this._lockData.some(e=>e.startTs<=t.highlightEndTs+3e4&&e.endTs>=t.highlightStartTs-3e4),d=(this._data[t.rowIndex]??[]).filter(t=>t.endTs>=i&&t.startTs<=n);return Z`
      <div
        class="zoom-overlay"
        @pointerenter=${()=>clearTimeout(this._zoomTimer)}
        @pointerleave=${this._onPointerLeave}
      >
        <div class="zoom-header-info">
          <span class="zoom-time">${(t=>Dt(t,this._timeZone,this._lang,this._amPm,!0))(t.highlightStartTs)}</span>
          <span class="zoom-dur">${c}</span>
          ${l?Z`<ha-icon
                icon="mdi:lock-open-variant"
                class="zoom-unlock-icon"
                title="${_t(this.hass,"history.unlock_triggered")}"
              ></ha-icon>`:V}
        </div>
        <div class="zoom-header-nav">
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${0===t.eventIndex}
            @click=${t=>{t.stopPropagation(),this._zoomNavigate(-1)}}
            title="${_t(this.hass,"history.previous_event")}"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${t.eventIndex>=(this._data[t.rowIndex]?.length??0)-1}
            @click=${t=>{t.stopPropagation(),this._zoomNavigate(1)}}
            title="${_t(this.hass,"history.next_event")}"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <button
            class="nav-btn zoom-nav-btn zoom-close-btn"
            @click=${t=>{t.stopPropagation(),this._closeZoom()}}
            title="${_t(this.hass,"history.close_zoom")}"
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="zoom-track">
          <svg class="zoom-svg" viewBox="0 0 600 28" preserveAspectRatio="none">
            ${d.map(e=>{const o=Math.max(0,(e.startTs-i)/s*600),n=Math.min(600,(e.endTs-i)/s*600),r=Math.max(4,n-o),a=e.startTs===t.highlightStartTs&&e.endTs===t.highlightEndTs;return W`<g>
                <title>${this._formatTooltip(e.startTs,e.endTs)}</title>
                <rect
                  x="${o}" y="4" width="${r}" height="20" rx="3"
                  style="fill: ${t.color}; stroke: var(--card-background-color, #fff); stroke-opacity: 0.6; stroke-width: 1;"
                  opacity="${a?"1":"0.35"}"
                />
              </g>`})}
          </svg>
        </div>
        <div class="zoom-axis">
          <span>${r(i)}</span>
          <span>${r(t.centerTs)}</span>
          <span>${r(n)}</span>
        </div>
      </div>
    `}_renderChart(t){const e=[{label:_t(this.hass,"history.row_flap"),color:"var(--oc-flap-color)",events:this._data[0]??[]},{label:_t(this.hass,"history.row_prey"),color:"var(--oc-contraband-color)",events:this._data[1]??[]},{label:_t(this.hass,"history.row_human"),color:"var(--oc-human-color)",events:this._data[2]??[]}];return Z`
      <div class="history-chart">
        <div class="chart-nav">
          <button
            class="nav-btn"
            @click=${this._navPrev}
            ?disabled=${this._loading||this._offsetPages>=this.historyDays}
            title="${_t(this.hass,"history.previous_day")}"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <span class="nav-label">${this._formatDateRange()}</span>
          <button
            class="nav-btn"
            @click=${this._navNext}
            ?disabled=${this._loading||0===this._offsetPages}
            title="${_t(this.hass,"history.next_day")}"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>

        <div class="chart-rows ${this._loading?"chart-rows--loading":""}">
          ${e.map((e,o)=>Z`
              <div class="chart-row">
                <span class="chart-label" style="color: ${e.color}"
                  >${e.label}</span
                >
                <div class="chart-track">
                  <svg
                    class="chart-svg"
                    viewBox="0 0 600 28"
                    preserveAspectRatio="none"
                    @pointerleave=${this._onPointerLeave}
                  >
                    ${e.events.map(i=>{const n=It(t,i.startTs),s=It(t,i.endTs),r=600*n,a=Math.max(4,600*(s-n));return W`<g
                          class="event-bar"
                          @pointerenter=${t=>this._onBarPointerEnter(t,i,e.color,e.label,o)}
                          @click=${t=>this._onBarClick(t,i,e.color,e.label,o)}
                        >
                        <title>${this._formatTooltip(i.startTs,i.endTs)}</title>
                        <rect
                          x="${r}"
                          y="4"
                          width="${a}"
                          height="20"
                          rx="3"
                          style="fill: ${e.color}; stroke: var(--card-background-color, #fff); stroke-opacity: 0.5; stroke-width: 0.5;"
                          opacity="0.85"
                        />
                      </g>`})}
                  </svg>
                </div>
                <span class="chart-count">${e.events.length}</span>
                ${this._zoom?.rowIndex===o?this._renderZoom():V}
              </div>
            `)}
        </div>

        <div class="chart-axis">
          <div></div>
          <div class="chart-axis-inner">
            ${function(t,e){const o=[];for(let i=0;i<=24;i+=6){const n=24===i?t.dayEnd:Pt(t.day,i,0,t.timeZone);if(n>t.end+1)break;o.push({ts:n,frac:It(t,n),label:Ut(i,e)})}t.end<t.dayEnd&&(o[o.length-1]?.frac??0)<.97&&o.push({ts:t.end,frac:1,label:Mt(t.end,t.timeZone,e)});return o}(t,this._amPm).map(({label:t,frac:e})=>Z`<span style="left: ${100*e}%">${t}</span>`)}
          </div>
          <div></div>
        </div>
      </div>
    `}render(){const t=this._isEntityOn(this.eventEntityId),e=this._isEntityOn(this.contrabandEntityId),o=this._isEntityOn(this.humanEntityId);return Z`
      <div class="event-section">
        <button
          class="history-toggle ${this._show?"history-toggle--open":""}"
          @click=${this._toggle}
        >
          <ha-icon icon="mdi:chart-timeline-variant"></ha-icon>
          <span>${_t(this.hass,"history.title")}</span>

          ${t?Z`<span
                class="event-badge event-badge--flap"
                title="${_t(this.hass,"history.passage_detected")}"
              >
                <ha-icon icon="mdi:cat"></ha-icon>
              </span>`:V}
          ${e?Z`<span
                class="event-badge event-badge--contraband"
                title="${_t(this.hass,"history.prey_detected")}"
              >
                <ha-icon icon="mdi:rodent"></ha-icon>
              </span>`:V}
          ${o?Z`<span
                class="event-badge event-badge--human"
                title="${_t(this.hass,"history.human_detected")}"
              >
                <ha-icon icon="mdi:account"></ha-icon>
              </span>`:V}

          <ha-icon
            class="chevron"
            icon="${this._show?"mdi:chevron-up":"mdi:chevron-down"}"
          ></ha-icon>
        </button>

        ${this._show?this._loading&&!this._hasFetched?Z`<div class="history-status">
                ${customElements.get("ha-spinner")?Z`<ha-spinner size="small"></ha-spinner>`:Z`<ha-circular-progress
                      active
                      indeterminate
                      size="small"
                    ></ha-circular-progress>`}
                <span>${_t(this.hass,"history.loading")}</span>
              </div>`:this._error?Z`<div class="history-status history-status--error">
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                  <span>${this._error}</span>
                </div>`:this._window?this._renderChart(this._window):V:V}
      </div>
    `}}Rt.styles=r`
    :host {
      display: block;
      /* Theme colours; --history-*-color stay available as overrides. */
      --oc-flap-color: var(--history-flap-color, var(--info-color, #039be5));
      --oc-contraband-color: var(
        --history-contraband-color,
        var(--error-color, #db4437)
      );
      --oc-human-color: var(--history-human-color, var(--purple-color, #926bc7));
      --oc-track-color: color-mix(
        in srgb,
        var(--primary-text-color, #212121) 8%,
        transparent
      );
    }

    /* ── Toggle button ───────────────────────────────── */
    .event-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .history-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 9px 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 9px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      text-align: left;
      transition: border-color 0.15s;
    }

    .history-toggle:hover {
      border-color: var(--primary-color);
    }

    .history-toggle--open {
      border-color: var(--primary-color);
    }

    .history-toggle ha-icon:first-child {
      color: var(--primary-color);
      --mdc-icon-size: 18px;
    }

    .history-toggle span:first-of-type {
      flex: 1;
    }

    .chevron {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }

    /* ── Live event badges ───────────────────────────── */
    .event-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 5px;
      border-radius: 6px;
      font-size: 0;
    }

    .event-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .event-badge--flap {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--oc-flap-color) 15%, transparent);
      color: var(--oc-flap-color);
    }

    .event-badge--contraband {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--oc-contraband-color) 15%, transparent);
      color: var(--oc-contraband-color);
    }

    .event-badge--human {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--oc-human-color) 15%, transparent);
      color: var(--oc-human-color);
    }

    /* ── Loading / error ─────────────────────────────── */
    .history-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      font-size: 0.875rem;
      color: var(--secondary-text-color);
    }

    .history-status--error {
      color: var(--error-color, #ef5350);
    }

    /* ── Chart container ─────────────────────────────── */
    .history-chart {
      background: var(--secondary-background-color);
      border-radius: 9px;
      padding: 10px 12px 8px;
      animation: fadeSlide 0.2s ease;
    }

    @keyframes fadeSlide {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ── Period navigation ───────────────────────────── */
    .chart-nav {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      flex-shrink: 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      transition:
        border-color 0.15s,
        opacity 0.15s;
    }

    .nav-btn:hover:not(:disabled) {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .nav-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }

    .nav-btn ha-icon {
      --mdc-icon-size: 16px;
    }

    .nav-label {
      flex: 1;
      text-align: center;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Timeline rows ───────────────────────────────── */
    .chart-rows {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .chart-rows--loading {
      opacity: 0.5;
      transition: opacity 0.15s;
    }

    .chart-row {
      display: grid;
      grid-template-columns: 52px 1fr 28px;
      align-items: center;
      gap: 6px;
      position: relative;
    }

    .chart-label {
      font-size: 0.72rem;
      font-weight: 700;
      text-align: right;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .chart-track {
      height: 28px;
      background: var(--oc-track-color);
      border-radius: 5px;
      overflow: hidden;
    }

    .chart-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .chart-svg .event-bar {
      cursor: pointer;
    }

    .chart-svg .event-bar:hover rect {
      opacity: 1;
    }

    .chart-count {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-align: center;
    }

    .chart-axis {
      display: grid;
      grid-template-columns: 52px 1fr 28px;
      gap: 6px;
      margin-top: 4px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    .chart-axis-inner {
      position: relative;
      height: 14px;
      overflow: visible;
    }

    .chart-axis-inner span {
      position: absolute;
      transform: translateX(-50%);
      white-space: nowrap;
    }

    /* ── Zoom overlay ────────────────────────────────────── */
    .zoom-overlay {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 58px;
      right: 34px;
      z-index: 10;
      background: var(--card-background-color);
      border: 1px solid var(--primary-color, #6200ea);
      border-radius: 6px;
      padding: 4px 8px 2px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
      pointer-events: auto;
      animation: fadeSlide 0.12s ease;
    }

    .zoom-header-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .zoom-nav-btn {
      width: 22px;
      height: 22px;
      flex-shrink: 0;
    }

    .zoom-nav-btn ha-icon {
      --mdc-icon-size: 14px;
    }

    .zoom-header-info {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .zoom-label-title {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .zoom-time {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--oc-flap-color) 15%, transparent);
      padding: 1px 6px;
      border-radius: 8px;
    }

    .zoom-dur {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      padding: 1px 6px;
      border-radius: 8px;
    }

    .zoom-unlock-icon {
      --mdc-icon-size: 14px;
      color: var(--warning-color, #ff9800);
    }

    .zoom-track {
      height: 28px;
      background: var(--oc-track-color);
      border-radius: 4px;
      overflow: hidden;
    }

    .zoom-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .zoom-axis {
      display: flex;
      justify-content: space-between;
      margin-top: 2px;
      font-size: 0.62rem;
      color: var(--secondary-text-color);
      opacity: 0.7;
    }
  `,t([ut({attribute:!1})],Rt.prototype,"hass",void 0),t([ut()],Rt.prototype,"eventEntityId",void 0),t([ut()],Rt.prototype,"contrabandEntityId",void 0),t([ut()],Rt.prototype,"humanEntityId",void 0),t([ut()],Rt.prototype,"lockEntityId",void 0),t([ut({type:Number})],Rt.prototype,"historyDays",void 0),t([mt()],Rt.prototype,"_show",void 0),t([mt()],Rt.prototype,"_loading",void 0),t([mt()],Rt.prototype,"_hasFetched",void 0),t([mt()],Rt.prototype,"_error",void 0),t([mt()],Rt.prototype,"_data",void 0),t([mt()],Rt.prototype,"_lockData",void 0),t([mt()],Rt.prototype,"_window",void 0),t([mt()],Rt.prototype,"_offsetPages",void 0),t([mt()],Rt.prototype,"_zoom",void 0),customElements.define("onlycat-activity-history",Rt);const Nt=Object.keys($t);class Ht extends lt{constructor(){super(...arguments),this._formReady=!!customElements.get("ha-form"),this._computeLabel=t=>{const e=t.name in $t?`entity.${t.name}`:`editor.${t.name}`;return _t(this.hass,e)},this._computeHelper=t=>"device"===t.name?_t(this.hass,"editor.device_hint"):"device_id"===t.name?_t(this.hass,"editor.device_id_hint"):"entities"===t.name?_t(this.hass,"editor.entities_hint"):"history_days"===t.name?gt(this.hass,"editor.history_days_hint",{n:10}):void 0}setConfig(t){this._config=t}connectedCallback(){super.connectedCallback(),this._formReady||async function(){if(!customElements.get("ha-form"))try{const t=await(window.loadCardHelpers?.()),e=t?.createCardElement({type:"entities"}),o=e?.constructor;await(o?.getConfigElement?.())}catch{}}().then(()=>this._formReady=!0)}_schema(){return[{name:"device",selector:{device:{filter:{integration:bt}}}},{name:"name",selector:{text:{}}},{name:"show_title",selector:{boolean:{}}},{name:"entities",type:"expandable",title:_t(this.hass,"editor.entities"),schema:Nt.map(t=>({name:t,selector:{entity:{domain:$t[t].domain}}}))},{name:"advanced",type:"expandable",flatten:!0,title:_t(this.hass,"editor.advanced"),schema:[{name:"history_days",selector:{number:{min:1,max:365,mode:"box"}}},{name:"device_id",selector:{text:{}}}]}]}_valueChanged(t){t.stopPropagation();const e={...t.detail.value},o=this._config.device||kt(this.hass,this._config);e.device&&e.device!==o&&delete e.device_id,this._config=function(t){const e={...t},o=Object.fromEntries(Object.entries(t.entities??{}).filter(([,t])=>!!t));return Object.keys(o).length?e.entities=o:delete e.entities,e.device_id||delete e.device_id,e.device||delete e.device,void 0!==e.history_days&&null!==e.history_days||delete e.history_days,e}(e),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass||!this._formReady)return Z``;const t={show_title:!0,...this._config,device:this._config.device||kt(this.hass,this._config)};return Z`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${this._schema()}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}}t([ut({attribute:!1})],Ht.prototype,"hass",void 0),t([mt()],Ht.prototype,"_config",void 0),t([mt()],Ht.prototype,"_formReady",void 0),customElements.define("onlycat-home-assistant-card-editor",Ht);class jt extends lt{connectedCallback(){super.connectedCallback(),this._clockTimer=setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._clockTimer)}_entity(){return this.hass?.states?.[this.entityId]}_getSnapshotUrl(){return t=this._entity()?.attributes?.entity_picture,"string"!=typeof t?null:t.startsWith("/api/camera_proxy/")?t:null;var t}_openMoreInfo(){this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:this.entityId}}))}_latestActivityTs(){if(this.lastActivityEntityId){const t=this.hass?.states?.[this.lastActivityEntityId]?.state,e=t?new Date(t).getTime():NaN;if(!isNaN(e))return e}const t=[this.eventEntityId,this.humanEntityId,this.contrabandEntityId];let e=null;for(const o of t){if(!o)continue;const t=this.hass?.states?.[o]?.last_changed;if(!t)continue;const i=new Date(t).getTime();!isNaN(i)&&(null===e||i>e)&&(e=i)}return e}_onKeyDown(t){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._openMoreInfo())}render(){const t=this._getSnapshotUrl(),e=this._latestActivityTs(),o="unavailable"===this._entity()?.state;return Z`
      <div
        class="camera-panel ${t?"camera-panel--clickable":""}"
        role=${t?"button":V}
        tabindex=${t?"0":V}
        aria-label=${t?_t(this.hass,"camera.open"):V}
        @click=${()=>{t&&this._openMoreInfo()}}
        @keydown=${e=>{t&&this._onKeyDown(e)}}
      >
        ${t?Z`
              <img
                src="${t}"
                alt="${_t(this.hass,"camera.title")}"
                class="camera-img"
              />
              <div class="camera-overlay">
                <ha-icon icon="mdi:play-circle-outline"></ha-icon>
                ${null!==e?Z`<span class="camera-ts"
                      >${function(t,e,o){const i=Math.round((o-e)/6e4);if(i<1)return _t(t,"time.just_now");if(i<60)return gt(t,"time.minutes_ago",{n:i});const n=Math.floor(i/60);if(n>=24)return gt(t,"time.days_ago",{d:Math.floor(n/24)});const s=i%60;return 0===s?gt(t,"time.hours_ago",{h:n}):gt(t,"time.hours_minutes_ago",{h:n,m:String(s).padStart(2,"0")})}(this.hass,e,Date.now())}</span
                    >`:V}
              </div>
            `:Z`
              <div class="camera-placeholder">
                <ha-icon
                  icon=${o?"mdi:video-off-outline":"mdi:paw"}
                ></ha-icon>
                <span
                  >${_t(this.hass,o?"camera.stream_unavailable":"card.no_recent_activity")}</span
                >
              </div>
            `}
      </div>
    `}}jt.styles=r`
    :host {
      display: block;
    }

    /* ── Thumbnail ───────────────────────────────────── */
    .camera-panel {
      position: relative;
      height: 160px;
      border-radius: 10px;
      overflow: hidden;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .camera-panel--clickable {
      cursor: pointer;
    }

    .camera-panel--clickable:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .camera-panel--clickable:hover .camera-overlay,
    .camera-panel--clickable:focus-visible .camera-overlay {
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
    }

    .camera-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .camera-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(transparent 40%, rgba(0, 0, 0, 0.55));
      display: flex;
      align-items: flex-end;
      gap: 6px;
      padding: 10px 12px;
      color: #fff;
      transition: background 0.2s;
    }

    .camera-overlay ha-icon {
      --mdc-icon-size: 22px;
    }

    .camera-ts {
      font-size: 0.8rem;
    }

    .camera-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: var(--secondary-text-color);
      opacity: 0.5;
    }

    .camera-placeholder ha-icon {
      --mdc-icon-size: 52px;
    }

    .camera-placeholder span {
      font-size: 0.85rem;
    }
  `,t([ut({attribute:!1})],jt.prototype,"hass",void 0),t([ut()],jt.prototype,"entityId",void 0),t([ut()],jt.prototype,"eventEntityId",void 0),t([ut()],jt.prototype,"humanEntityId",void 0),t([ut()],jt.prototype,"contrabandEntityId",void 0),t([ut()],jt.prototype,"lastActivityEntityId",void 0),customElements.define("onlycat-camera-panel",jt);class Lt extends lt{constructor(){super(...arguments),this._ids=At(void 0,{})}static getStubConfig(){return{name:"",device:"",show_title:!0}}static getConfigElement(){return document.createElement("onlycat-home-assistant-card-editor")}setConfig(t){if(!t)throw new Error("Invalid configuration.");this._config={name:t.name??"",device:t.device??"",device_id:t.device_id??"",show_title:!1!==t.show_title,...t.entities?{entities:{...t.entities}}:{},...void 0!==t.history_days?{history_days:t.history_days}:{}}}getCardSize(){const t=this.offsetHeight;return t>0?Math.ceil(t/50):!1===this._config?.show_title?7:8}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}_entity(t){return this.hass?.states?.[t]}_isOn(t){return"on"===this._entity(t)?.state}_isAvailable(t){const e=this._entity(t)?.state;return!!e&&"unavailable"!==e&&"unknown"!==e}_binaryState(t){const e=this._entity(t)?.state;return"on"===e||"off"===e?e:null}_onUnlock(){this._isAvailable(this._ids.unlock)&&this.hass.callService("button","press",{entity_id:this._ids.unlock})}_onRebootConfirm(){this._isAvailable(this._ids.reboot)&&(this.hass.callService("button","press",{entity_id:this._ids.reboot}),this._closeRebootConfirm())}_onPolicyChange(t){const e=t.target.value;e&&this.hass.callService("select","select_option",{entity_id:this._ids.policy,option:e})}_renderStatusPills(){const t=this._binaryState(this._ids.connectivity),e=this._binaryState(this._ids.lock),o=this._isOn(this._ids.errors),i=_t(this.hass,"card.unavailable");return Z`
      <div class="status-pills">
        ${o?Z`<ha-icon
              icon="mdi:alert-circle"
              class="error-pill-icon"
              title="${_t(this.hass,"card.errors")}"
            ></ha-icon>`:V}
        ${null===e?Z`<div class="pill pill--lock pill--unknown">
              <ha-icon icon="mdi:lock-question"></ha-icon>
              <span>${i}</span>
            </div>`:Z`<div
              class="pill pill--lock ${"off"===e?"pill--locked":"pill--unlocked"}"
            >
              <ha-icon
                icon="${"off"===e?"mdi:lock":"mdi:lock-open-variant"}"
              ></ha-icon>
              <span
                >${_t(this.hass,"off"===e?"card.locked":"card.unlocked")}</span
              >
            </div>`}
        ${null===t?Z`<div class="pill pill--connectivity pill--unknown">
              <ha-icon icon="mdi:help-network-outline"></ha-icon>
              <span>${i}</span>
            </div>`:Z`<div
              class="pill pill--connectivity ${"on"===t?"pill--online":"pill--offline"}"
            >
              <ha-icon
                icon="${"on"===t?"mdi:wifi":"mdi:wifi-off"}"
              ></ha-icon>
              <span
                >${_t(this.hass,"on"===t?"card.connected":"card.offline")}</span
              >
            </div>`}
      </div>
    `}_renderPolicy(){const t=this._entity(this._ids.policy),e=t?.attributes?.options??[],o=t?.state??"";return Z`
      <div class="row-section">
        <ha-icon icon="mdi:home-clock" class="section-icon"></ha-icon>
        <span class="section-label">${_t(this.hass,"card.policy")}</span>
        ${t&&this._isAvailable(this._ids.policy)?Z`
              <select
                class="policy-select"
                .value=${o}
                @change=${t=>this._onPolicyChange(t)}
              >
                ${e.map(e=>Z`<option value="${e}" ?selected=${e===o}>
                      ${this.hass.formatEntityState?.(t,e)??e}
                    </option>`)}
              </select>
            `:Z`<span class="unavailable"
              >${_t(this.hass,"card.unavailable")}</span
            >`}
      </div>
    `}_renderActions(){return Z`
      <div class="actions-row">
        <button
          class="action-btn action-btn--primary"
          ?disabled=${!this._isAvailable(this._ids.unlock)}
          @click=${()=>this._onUnlock()}
          title="${_t(this.hass,"actions.unlock_title")}"
        >
          <ha-icon icon="mdi:lock-open-variant"></ha-icon>
          <span>${_t(this.hass,"actions.unlock")}</span>
        </button>

        <button
          class="action-btn action-btn--secondary"
          ?disabled=${!this._isAvailable(this._ids.reboot)}
          aria-haspopup="dialog"
          @click=${()=>this._openRebootConfirm()}
          title="${_t(this.hass,"actions.restart_title")}"
        >
          <ha-icon icon="mdi:restart"></ha-icon>
          <span>${_t(this.hass,"actions.restart")}</span>
        </button>
      </div>
    `}_openRebootConfirm(){this._rebootDialog?.showModal()}_closeRebootConfirm(){this._rebootDialog?.open&&this._rebootDialog.close()}_renderRebootDialog(){return Z`
      <dialog
        class="reboot-dialog"
        aria-labelledby="reboot-dialog-title"
        aria-describedby="reboot-dialog-question"
        @click=${t=>{t.target===t.currentTarget&&this._closeRebootConfirm()}}
        @close=${()=>this._rebootButton?.focus()}
      >
        <div class="modal-header">
          <ha-icon
            icon="mdi:alert-circle"
            style="color:var(--warning-color,#ff9800)"
          ></ha-icon>
          <span id="reboot-dialog-title"
            >${_t(this.hass,"confirm_restart.title")}</span
          >
          <button
            class="modal-close"
            aria-label="${_t(this.hass,"actions.cancel")}"
            @click=${()=>this._closeRebootConfirm()}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="modal-body">
          <p id="reboot-dialog-question">
            ${_t(this.hass,"confirm_restart.question")}
          </p>
          <p class="confirm-note">
            ${_t(this.hass,"confirm_restart.note")}
          </p>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn--cancel"
            autofocus
            @click=${()=>this._closeRebootConfirm()}
          >
            ${_t(this.hass,"actions.cancel")}
          </button>
          <button
            class="btn btn--danger"
            @click=${()=>this._onRebootConfirm()}
          >
            <ha-icon icon="mdi:restart"></ha-icon>
            ${_t(this.hass,"actions.restart")}
          </button>
        </div>
      </dialog>
    `}render(){if(!this.hass||!this._config)return V;const t=this._config.name||_t(this.hass,"card.name_default");if(!(e=this._config)||!(e.device||e.device_id||Object.values(e.entities??{}).some(Boolean)))return Z`
        <ha-card>
          <div
            class="card-body"
            style="text-align:center;color:var(--warning-color,#ff9800);padding:24px 16px;font-size:0.9rem;"
          >
            <ha-icon
              icon="mdi:alert-circle-outline"
              style="--mdc-icon-size:32px;display:block;margin:0 auto 8px;"
            ></ha-icon>
            ${_t(this.hass,"card.config_required")}
          </div>
        </ha-card>
      `;var e;this._ids=At(this.hass,this._config);const o=this._ids;return Z`
      <ha-card>
        ${this._config.show_title?Z`
              <div class="card-header">
                <ha-icon icon="mdi:paw" class="header-icon"></ha-icon>
                <span class="header-title">${t}</span>
                ${this._renderStatusPills()}
              </div>
            `:Z`<div class="card-header card-header--no-title">
              ${this._renderStatusPills()}
            </div>`}

        <div class="card-body">
          <onlycat-camera-panel
            .hass=${this.hass}
            .entityId=${o.camera}
            .eventEntityId=${o.event}
            .humanEntityId=${o.human}
            .contrabandEntityId=${o.contraband}
            .lastActivityEntityId=${o.image}
          ></onlycat-camera-panel>
          ${this._renderPolicy()} ${this._renderActions()}
          <onlycat-activity-history
            .hass=${this.hass}
            .eventEntityId=${o.event}
            .contrabandEntityId=${o.contraband}
            .humanEntityId=${o.human}
            .lockEntityId=${o.lock}
            .historyDays=${this._config.history_days??10}
          ></onlycat-activity-history>
        </div>
      </ha-card>

      ${this._renderRebootDialog()}
    `}}Lt.styles=r`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
    }

    /* ── Header ─────────────────────────────────────────────── */
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px 10px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
    }

    .card-header--no-title {
      justify-content: flex-end;
    }

    .header-icon {
      color: var(--primary-color);
      --mdc-icon-size: 22px;
      flex-shrink: 0;
    }

    .header-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Status pills ────────────────────────────────────────── */
    .status-pills {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .pill {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 99px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .pill ha-icon {
      --mdc-icon-size: 14px;
    }

    .pill--locked {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--success-color, #43a047) 15%, transparent);
      color: var(--success-color, #43a047);
    }
    .pill--unlocked {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--warning-color, #ffa600) 15%, transparent);
      color: var(--warning-color, #ffa600);
    }
    .pill--online {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--info-color, #039be5) 12%, transparent);
      color: var(--info-color, #039be5);
    }
    .pill--offline {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      color: var(--error-color, #db4437);
    }
    .pill--unknown {
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    .error-pill-icon {
      color: var(--error-color, #e53935);
      --mdc-icon-size: 24px;
      width: 24px;
      height: 24px;
      display: flex;
      flex-shrink: 0;
    }

    /* ── Body ────────────────────────────────────────────────── */
    .card-body {
      padding: 12px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* ── Shared row section ───────────────────────────────────── */
    .row-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-icon {
      color: var(--primary-color);
      --mdc-icon-size: 20px;
      flex-shrink: 0;
    }

    .section-label {
      font-size: 0.875rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .unavailable {
      font-size: 0.875rem;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    /* ── Policy select ────────────────────────────────────────── */
    .policy-select {
      flex: 1;
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 0.875rem;
      cursor: pointer;
      min-width: 0;
    }

    /* ── Action buttons ───────────────────────────────────────── */
    .actions-row {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px 12px;
      border: none;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition:
        filter 0.15s,
        transform 0.1s;
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-btn:not(:disabled):active {
      transform: scale(0.96);
      filter: brightness(0.9);
    }

    .action-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    .action-btn--primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .action-btn--secondary {
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #ccc);
    }

    /* ── Confirmation dialog ──────────────────────────────────── */
    .reboot-dialog {
      border: none;
      padding: 0;
      border-radius: 14px;
      max-width: 380px;
      width: 92%;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    }

    .reboot-dialog[open] {
      animation: slideUp 0.2s ease;
    }

    .reboot-dialog::backdrop {
      background: rgba(0, 0, 0, 0.6);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
      font-weight: 600;
      font-size: 0.95rem;
    }

    .modal-header ha-icon:first-child {
      color: var(--primary-color);
    }

    .modal-close {
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: background 0.15s;
    }

    .modal-close:hover {
      background: var(--secondary-background-color);
    }

    .modal-body {
      padding: 16px;
    }

    .modal-body p {
      margin: 0 0 8px;
      color: var(--primary-text-color);
      font-size: 0.9rem;
    }

    .confirm-note {
      color: var(--secondary-text-color) !important;
      font-size: 0.82rem !important;
    }

    .modal-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 10px 16px 14px;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition: filter 0.15s;
    }

    .btn:hover {
      filter: brightness(0.92);
    }

    .btn--cancel {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc);
    }

    .btn--danger {
      background: var(--error-color, #db4437);
      color: var(--text-primary-color, #fff);
    }

    .btn ha-icon {
      --mdc-icon-size: 16px;
    }
  `,t([ut({attribute:!1})],Lt.prototype,"hass",void 0),t([mt()],Lt.prototype,"_config",void 0),t([yt("dialog.reboot-dialog")],Lt.prototype,"_rebootDialog",void 0),t([yt(".action-btn--secondary")],Lt.prototype,"_rebootButton",void 0),customElements.define("onlycat-home-assistant-card",Lt),window.customCards=window.customCards||[],window.customCards.push({type:"onlycat-home-assistant-card",name:"OnlyCat Home Assistant Card",description:"Card to monitor and control your OnlyCat smart cat flap.",preview:!0,documentationURL:"https://github.com/Gamso/onlycat-home-assistant-card"});
