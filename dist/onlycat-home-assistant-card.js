function t(t,e,i,o){var n,s=arguments.length,r=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),n=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=t=>new s("string"==typeof t?t:t+"",void 0,o),a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new s(i,t,o)},c=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return r(e)})(t):t,{is:l,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:m}=Object,y=globalThis,f=y.trustedTypes,g=f?f.emptyScript:"",v=y.reactiveElementPolyfillSupport,_=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),y.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&d(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:n}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const s=o?.call(this);n?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=m(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(c(t))}else void 0!==t&&e.push(c(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),n=e.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=o;const s=n.fromAttribute(e,t.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(t,e,i,o=!1,n){if(void 0!==t){const s=this.constructor;if(!1===o&&(n=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??$)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:n},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==n||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[_("elementProperties")]=new Map,k[_("finalized")]=new Map,v?.({ReactiveElement:k}),(y.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=t=>t,E=w.trustedTypes,C=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,T="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+S,P=`<${z}>`,I=document,O=()=>I.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,D="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,j=/>/g,H=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,B=/"/g,q=/^(?:script|style|textarea|title)$/i,W=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),Z=W(1),F=W(2),V=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),J=new WeakMap,Y=I.createTreeWalker(I,129);function G(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,o=[];let n,s=2===e?"<svg>":3===e?"<math>":"",r=N;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(r.lastIndex=d,c=r.exec(i),null!==c);)d=r.lastIndex,r===N?"!--"===c[1]?r=R:void 0!==c[1]?r=j:void 0!==c[2]?(q.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=H):void 0!==c[3]&&(r=H):r===H?">"===c[0]?(r=n??N,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?H:'"'===c[3]?B:L):r===B||r===L?r=H:r===R||r===j?r=N:(r=H,n=void 0);const h=r===H&&t[e+1].startsWith("/>")?" ":"";s+=r===N?i+P:l>=0?(o.push(a),i.slice(0,l)+T+i.slice(l)+S+h):i+S+(-2===l?e:h)}return[G(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class Q{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let n=0,s=0;const r=t.length-1,a=this.parts,[c,l]=X(t,e);if(this.el=Q.createElement(c,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=Y.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(T)){const e=l[s++],i=o.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?nt:"?"===r[1]?st:"@"===r[1]?rt:ot}),o.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:n}),o.removeAttribute(t));if(q.test(o.tagName)){const t=o.textContent.split(S),e=t.length-1;if(e>0){o.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],O()),Y.nextNode(),a.push({type:2,index:++n});o.append(t[e],O())}}}else if(8===o.nodeType)if(o.data===z)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=o.data.indexOf(S,t+1));)a.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const i=I.createElement("template");return i.innerHTML=t,i}}function tt(t,e,i=t,o){if(e===V)return e;let n=void 0!==o?i._$Co?.[o]:i._$Cl;const s=M(e)?void 0:e._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),void 0===s?n=void 0:(n=new s(t),n._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=n:i._$Cl=n),void 0!==n&&(e=tt(t,n._$AS(t,e.values),n,o)),e}class et{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??I).importNode(e,!0);Y.currentNode=o;let n=Y.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new it(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new at(n,this,t)),this._$AV.push(e),a=i[++r]}s!==a?.index&&(n=Y.nextNode(),s++)}return Y.currentNode=I,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class it{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),M(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new et(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new Q(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const n of t)o===e.length?e.push(i=new it(this.O(O()),this.O(O()),this,this.options)):i=e[o],i._$AI(n),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class ot{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,n){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,o){const n=this.strings;let s=!1;if(void 0===n)t=tt(this,t,e,0),s=!M(t)||t!==this._$AH&&t!==V,s&&(this._$AH=t);else{const o=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=tt(this,o[i+r],e,r),a===V&&(a=this._$AH[r]),s||=!M(a)||a!==this._$AH[r],a===K?t=K:t!==K&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class nt extends ot{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class st extends ot{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class rt extends ot{constructor(t,e,i,o,n){super(t,e,i,o,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??K)===V)return;const i=this._$AH,o=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==K&&(i===K||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const ct=w.litHtmlPolyfillSupport;ct?.(Q,it),(w.litHtmlVersions??=[]).push("3.3.2");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class dt extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let n=o._$litPart$;if(void 0===n){const t=i?.renderBefore??null;o._$litPart$=n=new it(e.insertBefore(O(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}dt._$litElement$=!0,dt.finalized=!0,lt.litElementHydrateSupport?.({LitElement:dt});const ht=lt.litElementPolyfillSupport;ht?.({LitElement:dt}),(lt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:$},ut=(t=pt,e,i)=>{const{kind:o,metadata:n}=i;let s=globalThis.litPropertyMetadata.get(n);if(void 0===s&&globalThis.litPropertyMetadata.set(n,s=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,n,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];e.call(this,i),this.requestUpdate(o,n,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function mt(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function yt(t){return mt({...t,state:!0,attribute:!1})}
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
function ft(t,e){return(e,i,o)=>((t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i))(e,i,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}const gt={en:{card:{name_default:"Cat Flap",config_required:"Please configure the OnlyCat card.",locked:"Locked",unlocked:"Unlocked",connected:"Connected",offline:"Offline",unavailable:"Unavailable",policy:"Policy",no_recent_activity:"No recent activity",errors:"Device errors"},actions:{unlock:"Unlock",unlock_title:"Unlock now",restart:"Restart",restart_title:"Restart the cat flap",cancel:"Cancel"},camera:{title:"Last activity",stream_unavailable:"Stream unavailable.",open:"Open the last activity video"},history:{title:"Activity history",loading:"Loading…",error:"Unable to load history.",passage_detected:"Passage detected",prey_detected:"Prey detected",human_detected:"Human detected",row_flap:"Passage",row_prey:"Prey",row_human:"Human",unlock_triggered:"Triggered by unlock button",previous_event:"Previous event",next_event:"Next event",close_zoom:"Close zoom",previous_day:"Previous day",next_day:"Next day",kind_in:"In",kind_out:"Out",kind_in_attempt:"Tried to come in",kind_out_attempt:"Tried to go out",kind_unknown:"Passage",attempt:"Didn't go through",outside:"Outside"},pets:{inside:"Inside",outside:"Outside",unknown:"Unknown"},time:{just_now:"just now",minutes_ago:"{n} min ago",hours_ago:"{h}h ago",hours_minutes_ago:"{h}h{m} ago",days_ago:"{d}d ago",minutes:"{n} min",hours_minutes:"{h}h{m}",days:"{d} d"},confirm_restart:{title:"Confirm restart",question:"Are you sure you want to restart the cat flap?",note:"The cat flap will be temporarily offline during the restart."},editor:{name:"Card name",device:"OnlyCat device",device_hint:"Device created by the OnlyCat integration",show_title:"Show title",show_pets:"Show pets",entities:"Entities",entities_hint:"Leave empty to detect them from the device. Only needed for renamed entities.",advanced:"Advanced",history_days:"Days of history",history_days_hint:"How many past days the timeline can browse (default {n})",device_id:"OnlyCat device id (legacy)",device_id_hint:"Entity id prefix, e.g. oc_0cbfb5801849. Kept for configurations made before the device picker."},entity:{camera:"Last activity video",image:"Last activity image",lock:"Lock",connectivity:"Connectivity",errors:"Device errors",event:"Passage event",contraband:"Prey event",human:"Human event",policy:"Door policy",unlock:"Unlock button",reboot:"Reboot button"}},fr:{card:{name_default:"Chatière",config_required:"Veuillez configurer la carte OnlyCat.",locked:"Verrouillé",unlocked:"Ouvert",connected:"Connecté",offline:"Hors ligne",unavailable:"Indisponible",policy:"Politique",no_recent_activity:"Aucune activité récente",errors:"Erreurs de l'appareil"},actions:{unlock:"Déverrouiller",unlock_title:"Déverrouiller maintenant",restart:"Redémarrer",restart_title:"Redémarrer la chatière",cancel:"Annuler"},camera:{title:"Dernière activité",stream_unavailable:"Flux indisponible.",open:"Ouvrir la vidéo de la dernière activité"},history:{title:"Historique des activités",loading:"Chargement…",error:"Impossible de charger l'historique.",passage_detected:"Passage détecté",prey_detected:"Proie détectée",human_detected:"Humain détecté",row_flap:"Passage",row_prey:"Proie",row_human:"Humain",unlock_triggered:"Déclenché par déverrouillage",previous_event:"Événement précédent",next_event:"Événement suivant",close_zoom:"Fermer le zoom",previous_day:"Jour précédent",next_day:"Jour suivant",kind_in:"Entrée",kind_out:"Sortie",kind_in_attempt:"Tentative d'entrée",kind_out_attempt:"Tentative de sortie",kind_unknown:"Passage",attempt:"Non passé",outside:"Dehors"},pets:{inside:"Dedans",outside:"Dehors",unknown:"Inconnu"},time:{just_now:"à l'instant",minutes_ago:"il y a {n} min",hours_ago:"il y a {h}h",hours_minutes_ago:"il y a {h}h{m}",days_ago:"il y a {d} j",minutes:"{n} min",hours_minutes:"{h}h{m}",days:"{d} j"},confirm_restart:{title:"Confirmer le redémarrage",question:"Êtes-vous sûr de vouloir redémarrer la chatière ?",note:"La chatière sera temporairement hors ligne pendant le redémarrage."},editor:{name:"Nom de la carte",device:"Appareil OnlyCat",device_hint:"Appareil créé par l'intégration OnlyCat",show_title:"Afficher le titre",show_pets:"Afficher les chats",entities:"Entités",entities_hint:"Laisser vide pour les détecter depuis l'appareil. Utile seulement pour des entités renommées.",advanced:"Avancé",history_days:"Jours d'historique",history_days_hint:"Nombre de jours passés consultables dans la frise (par défaut {n})",device_id:"Identifiant OnlyCat (ancien format)",device_id_hint:"Préfixe des identifiants d'entité, ex. oc_0cbfb5801849. Conservé pour les configurations antérieures au sélecteur d'appareil."},entity:{camera:"Vidéo de la dernière activité",image:"Image de la dernière activité",lock:"Verrou",connectivity:"Connectivité",errors:"Erreurs de l'appareil",event:"Événement de passage",contraband:"Événement proie",human:"Événement humain",policy:"Politique de la porte",unlock:"Bouton de déverrouillage",reboot:"Bouton de redémarrage"}}};function vt(t,e){const i=e.indexOf("."),o=e.slice(0,i),n=e.slice(i+1),s=t[o];return"object"==typeof s?s[n]:void 0}function _t(t,e){return vt(gt[function(t){return(t?.locale?.language??t?.language??"en").toLowerCase().startsWith("fr")?"fr":"en"}(t)],e)??vt(gt.en,e)??e}function bt(t,e,i){let o=_t(t,e);for(const[t,e]of Object.entries(i))o=o.replace(`{${t}}`,String(e));return o}const $t="onlycat",xt={camera:{domain:"camera",key:"onlycat_last_activity_video",suffix:"last_activity_video"},image:{domain:"image",key:"onlycat_last_activity_image",suffix:"last_activity_image"},lock:{domain:"binary_sensor",key:"onlycat_lock_sensor",suffix:"lock"},connectivity:{domain:"binary_sensor",key:"onlycat_connection_sensor",suffix:"connectivity"},errors:{domain:"binary_sensor",key:"onlycat_error_sensor",suffix:"errors"},event:{domain:"binary_sensor",key:"onlycat_event_sensor",suffix:"event"},contraband:{domain:"binary_sensor",key:"onlycat_contraband_sensor",suffix:"contraband"},human:{domain:"binary_sensor",key:"onlycat_human_sensor",suffix:"human"},policy:{domain:"select",key:"onlycat_policy_select",suffix:"policy"},unlock:{domain:"button",key:"onlycat_unlock_button",suffix:"unlock"},reboot:{domain:"button",key:"onlycat_reboot_button",suffix:"reboot"}},kt=Object.keys(xt);function wt(t,e){const{domain:i,suffix:o}=xt[e];return t?`${i}.${t}_${o}`:""}function At(t,e){if(e.device)return e.device;const i=t?.entities;if(i)for(const t of kt){const o=[e.entities?.[t],wt(e.device_id??"",t)];for(const t of o){const e=t?i[t]?.device_id:void 0;if(e)return e}}}function Et(t,e){const i=e.device_id??"",o=At(t,e),n=o?Object.values(t?.entities??{}).filter(t=>!!t&&t.device_id===o&&(void 0===t.platform||t.platform===$t)):[],s={};for(const o of kt){const{domain:r,key:a,suffix:c}=xt[o],l=e.entities?.[o],d=wt(i,o),h=n.filter(t=>t.entity_id.startsWith(`${r}.`)),p=!(!d||!t?.states?.[d]||e.device&&t.entities?.[d]?.device_id!==e.device);s[o]=l||(p?d:"")||h.find(t=>t.translation_key===a)?.entity_id||h.find(t=>t.entity_id.endsWith(`_${c}`))?.entity_id||d}return s}const Ct="device_tracker.",Tt="_tracker",St=["var(--pink-color, #ec407a)","var(--deep-purple-color, #7e57c2)","var(--indigo-color, #5c6bc0)","var(--brown-color, #8d6e63)","var(--cyan-color, #26c6da)","var(--blue-grey-color, #78909c)"];function zt(t){return t?t.replace(/[’']s presence$/i,"").replace(/s Anwesenheit$/i,"").trim():""}function Pt(t,e){const i=t?.states??{},o=e.pets??Object.keys(i).filter(e=>function(t,e){if(!e.startsWith(Ct)||!e.endsWith(Tt))return!1;const i=t?.entities?.[e];return!i||"onlycat"===i.platform}(t,e)).sort();return o.map(t=>{const e="string"==typeof t?{entity:t}:t,o=i[e.entity]?.attributes?.friendly_name,n=function(t){let e=t;return e.startsWith(Ct)&&(e=e.slice(15)),e.endsWith(Tt)&&(e=e.slice(0,-8)),e.toLowerCase()}(e.entity);return{entityId:e.entity,rfid:n,name:e.name||zt(o)||n,color:e.color}}).filter(t=>{return e.pets||(i=t.name,o=t.rfid,!(i.toLowerCase()===o));var i,o}).map((t,e)=>({...t,color:t.color||St[e%St.length]}))}function It(t,e){const i=!e||"TRANSIT"===e;return"INWARD"===t?i?"in":"in_attempt":"OUTWARD"===t?i?"out":"out_attempt":"unknown"}function Ot(t){return!t||"unavailable"===t||"unknown"===t}function Mt(t){return!!t&&"home"!==t&&"unknown"!==t&&"unavailable"!==t}const Ut={in:"mdi:home-import-outline",out:"mdi:home-export-outline",in_attempt:"mdi:home-import-outline",out_attempt:"mdi:home-export-outline",unknown:"mdi:cat"},Dt="var(--history-in-color, var(--success-color, #43a047))",Nt="var(--history-out-color, var(--warning-color, #fb8c00))",Rt={in:Dt,out:Nt,in_attempt:Dt,out_attempt:Nt,unknown:"var(--history-flap-color, var(--info-color, #039be5))"};function jt(t){return"in_attempt"===t||"out_attempt"===t}function Ht(t){return 1e3*(t.lc??t.lu)}const Lt=t=>"on"===t;function Bt(t,e,i,o){const n=[];if(!Array.isArray(t))return n;let s=null;for(const o of t){const t=Math.max(i,Ht(o));if(isNaN(t))continue;const r=e(o.s);r&&null===s?s=t:r||null===s||(n.push({startTs:s,endTs:t}),s=null)}return null!==s&&n.push({startTs:s,endTs:Math.max(s,o)}),n}function qt(t,e,i){const o=[];if(!Array.isArray(t))return o;const n=new Map,s=new Map;let r=null;for(const a of t){const t=Math.max(e,Ht(a));if(isNaN(t))continue;const c=a.a??{},l="number"==typeof c.eventId?c.eventId:void 0,d="on"===a.s;d&&(!r||void 0!==l&&void 0!==r.eventId&&l!==r.eventId)&&(r&&(r.endTs=t),r={startTs:t,endTs:i,eventId:l,kind:"unknown",rfids:[]},o.push(r),s.set(r,{}));let h=void 0!==l?n.get(l):void 0;if(!h&&d&&r&&(h=r),h){void 0===h.eventId&&void 0!==l&&(h.eventId=l),void 0!==h.eventId&&n.set(h.eventId,h);const t=s.get(h);"string"==typeof c.direction&&c.direction&&(t.direction=c.direction),"string"==typeof c.action&&c.action&&(t.action=c.action);const e=[...c.rfidCode?[c.rfidCode]:[],...Array.isArray(c.rfidCodes)?c.rfidCodes:[]];for(const t of e){const e=String(t).toLowerCase();h.rfids.includes(e)||h.rfids.push(e)}}!d&&r&&(r.endTs=t,r=null)}for(const t of o)t.kind=It(s.get(t).direction,s.get(t).action),t.endTs=Math.max(t.startTs,t.endTs);return o}function Wt(t,e){if(!e.length)return[...t];const i=new Set(e.map(t=>t.rfid));return t.filter(t=>t.rfids.some(t=>i.has(t)))}const Zt={passages:[],prey:[],human:[],lock:[],outside:{}};function Ft(t){return"kind"in t}const Vt=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}};const Kt=new Map;function Jt(t,e){const i={};for(const o of function(t){let e=Kt.get(t);return e||(e=new Intl.DateTimeFormat("en-US",{timeZone:t,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}),Kt.set(t,e)),e}(e).formatToParts(new Date(t)))"literal"!==o.type&&(i[o.type]=Number(o.value));return{year:i.year,month:i.month,day:i.day,hour:i.hour%24,minute:i.minute,second:i.second}}function Yt(t,e){const i=Jt(t,e);return Date.UTC(i.year,i.month-1,i.day,i.hour,i.minute,i.second)-(t-(t%1e3+1e3)%1e3)}function Gt(t,e,i,o){const n=Date.UTC(t.year,t.month-1,t.day,e,i),s=Yt(n,o),r=n-s,a=Yt(r,o);return a===s?r:n-a}function Xt(t,e){const i=new Date(Date.UTC(t.year,t.month-1,t.day+e));return{year:i.getUTCFullYear(),month:i.getUTCMonth()+1,day:i.getUTCDate()}}function Qt(t,e){const i=t.end-t.start;return i<=0?0:Math.min(1,Math.max(0,(e-t.start)/i))}function te(t,e){if(!e)return`${t}h`;return`${t%12==0?12:t%12} ${t%24<12?"AM":"PM"}`}function ee(t,e,i,o,n=!1){return new Intl.DateTimeFormat(i,{timeZone:e,hour:"2-digit",minute:"2-digit",...n?{second:"2-digit"}:{},hourCycle:o?"h12":"h23"}).format(new Date(t))}function ie(t,e,i){const{hour:o,minute:n}=Jt(t,e);if(0===n)return te(o,i);const s=String(n).padStart(2,"0");if(!i)return`${o}h${s}`;return`${o%12==0?12:o%12}:${s} ${o<12?"AM":"PM"}`}const oe={in:"history.kind_in",out:"history.kind_out",in_attempt:"history.kind_in_attempt",out_attempt:"history.kind_out_attempt",unknown:"history.kind_unknown"};class ne extends dt{constructor(){super(...arguments),this.pets=[],this.historyDays=10,this._show=!1,this._loading=!1,this._hasFetched=!1,this._error=null,this._data=Zt,this._window=null,this._offsetPages=0,this._zoom=null,this._requestId=0}get _timeZone(){return t=this.hass,"local"===t?.locale?.time_zone?Vt():t?.config?.time_zone||Vt();var t}get _amPm(){return function(t){const e=t?.time_format??"language";if("12"===e)return!0;if("24"===e)return!1;const i="system"===e?void 0:t?.language;return new Date("January 1, 2023 22:00:00").toLocaleString(i).includes("10")}(this.hass?.locale)}get _lang(){return this.hass?.locale?.language??"en"}_targetWindow(){return function(t,e,i){const o=Xt(Jt(t,i),-e),n=Gt(o,0,0,i),s=Gt(Xt(o,1),0,0,i);return{timeZone:i,day:o,start:n,end:0===e?Math.min(Math.max(t,n+1),s):s,dayEnd:s}}(Date.now(),this._offsetPages,this._timeZone)}_isEntityOn(t){return"on"===this.hass?.states?.[t]?.state}async _load(){const t=++this._requestId,e=this._targetWindow(),i=this.pets;this._loading=!0,this._error=null;try{const r={event:this.eventEntityId,contraband:this.contrabandEntityId,human:this.humanEntityId,lock:this.lockEntityId},a=[...Object.values(r),...i.map(t=>t.entityId)].filter(t=>!!t),c=a.length?await this.hass.callWS((o=a,n=e.start,s=e.end,{type:"history/history_during_period",start_time:new Date(n).toISOString(),end_time:new Date(s).toISOString(),entity_ids:[...o],include_start_time_state:!0,significant_changes_only:!1,minimal_response:!1,no_attributes:!1})):{};if(t!==this._requestId)return;this._data=function(t,e,i,o,n,s){const r=e=>e?t?.[e]:void 0,a={};for(const t of i)a[t.rfid]=Bt(r(t.entityId),o,n,s);return{passages:qt(r(e.event),n,s),prey:Bt(r(e.contraband),Lt,n,s),human:Bt(r(e.human),Lt,n,s),lock:Bt(r(e.lock),Lt,n,s),outside:a}}(c,r,i,Mt,e.start,e.end),this._window=e,this._zoom=null,this._hasFetched=!0}catch(e){if(t!==this._requestId)return;console.error("[OnlyCat] history error",e),this._error=_t(this.hass,"history.error")}finally{t===this._requestId&&(this._loading=!1)}var o,n,s}_toggle(){this._show=!this._show,this._show&&this._load()}_navPrev(){this._loading||this._offsetPages>=this.historyDays||(this._offsetPages++,this._load())}_navNext(){this._loading||0===this._offsetPages||(this._offsetPages--,this._load())}_formatDateRange(){const{start:t,timeZone:e}=this._targetWindow();return new Intl.DateTimeFormat(this._lang,{timeZone:e,weekday:"short",month:"short",day:"numeric"}).format(new Date(t))}_formatTooltip(t,e){const i=t=>ee(t,this._timeZone,this._lang,this._amPm),o=Math.round((e-t)/1e3),n=o<60?`${o}s`:o<3600?`${Math.floor(o/60)}min${o%60>0?" "+o%60+"s":""}`:`${Math.floor(o/3600)}h ${Math.floor(o%3600/60)}min`;return`${i(t)} – ${i(e)} (${n})`}_kindLabel(t){return _t(this.hass,oe[t])}_petNames(t){return this.pets.filter(e=>t.rfids.includes(e.rfid)).map(t=>t.name)}_passageTooltip(t){return[this._formatTooltip(t.startTs,t.endTs),this._kindLabel(t.kind),...this._petNames(t)].join(" · ")}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._zoomTimer)}_rows(){return function(t,e,i){const o=e.map(e=>({key:`pet:${e.rfid}`,label:e.name,color:e.color,events:t.passages.filter(t=>t.rfids.includes(e.rfid)),background:t.outside[e.rfid]??[],passages:!0}));return[{key:"flap",...i.flap,events:Wt(t.passages,e),passages:!0},...o,{key:"prey",...i.prey,events:t.prey,passages:!1},{key:"human",...i.human,events:t.human,passages:!1}]}(this._data,this.pets,{flap:{label:_t(this.hass,"history.row_flap"),color:"var(--oc-flap-color)"},prey:{label:_t(this.hass,"history.row_prey"),color:"var(--oc-contraband-color)"},human:{label:_t(this.hass,"history.row_human"),color:"var(--oc-human-color)"}})}_onBarEnter(t,e){clearTimeout(this._zoomTimer),this._zoom={centerTs:(e.startTs+e.endTs)/2,highlightStartTs:e.startTs,highlightEndTs:e.endTs,rowKey:t.key,eventIndex:Math.max(0,t.events.indexOf(e))}}_zoomNavigate(t){if(!this._zoom)return;const e=this._zoom.rowKey,i=this._rows().find(t=>t.key===e)?.events??[],o=this._zoom.eventIndex+t;if(o<0||o>=i.length)return;const n=i[o];this._zoom={...this._zoom,eventIndex:o,centerTs:(n.startTs+n.endTs)/2,highlightStartTs:n.startTs,highlightEndTs:n.endTs}}_onBarLeave(){clearTimeout(this._zoomTimer),this._zoomTimer=setTimeout(()=>{this._zoom=null},200)}_onBarPointerEnter(t,e,i){"mouse"===t.pointerType&&(t.stopPropagation(),this._onBarEnter(e,i))}_onBarClick(t,e,i){t.stopPropagation();const o="mouse"===t.pointerType;this._zoom?.rowKey===e.key&&this._zoom.highlightStartTs===i.startTs&&this._zoom.highlightEndTs===i.endTs&&!o?this._closeZoom():this._onBarEnter(e,i)}_onPointerLeave(t){"mouse"===t.pointerType&&this._onBarLeave()}_closeZoom(){clearTimeout(this._zoomTimer),this._zoom=null}_renderBar(t,e,i,o,n,s){const r=Ft(e)?e:null,a=r?Rt[r.kind]:t.color,c=r?this._passageTooltip(r):this._formatTooltip(e.startTs,e.endTs),l=r&&jt(r.kind)?`fill: ${a}; fill-opacity: 0.2; stroke: ${a}; stroke-width: 1.5; stroke-dasharray: 3 2;`:`fill: ${a}; stroke: var(--card-background-color, #fff); stroke-opacity: 0.5; stroke-width: 0.5;`;return F`<g
        class="event-bar"
        @pointerenter=${s?i=>this._onBarPointerEnter(i,t,e):null}
        @click=${s?i=>this._onBarClick(i,t,e):null}
      >
      <title>${c}</title>
      <rect x="${i}" y="4" width="${o}" height="20" rx="3"
        style="${l}" opacity="${n}" />
    </g>`}_renderOutside(t,e){const i=_t(this.hass,"history.outside");return(t.background??[]).map(o=>{const[n,s]=e(o);return F`<g>
        <title>${i} ${this._formatTooltip(o.startTs,o.endTs)}</title>
        <rect x="${n}" y="9" width="${Math.max(1,s-n)}" height="10"
          rx="2" class="outside-bar" style="fill: ${t.color};" />
      </g>`})}_renderZoom(t){const e=this._zoom,i=e.highlightEndTs-e.highlightStartTs,o=Math.max(18e5,Math.min(72e5,30*i)),n=e.centerTs-o/2,s=e.centerTs+o/2,r=o,a=t=>Math.min(600,Math.max(0,(t-n)/r*600)),c=t=>ie(t,this._timeZone,this._amPm),l=Math.round((e.highlightEndTs-e.highlightStartTs)/1e3),d=l<60?`${l}s`:`${Math.floor(l/60)}min${l%60?" "+l%60+"s":""}`,h=t.passages&&this._data.lock.some(t=>t.startTs<=e.highlightEndTs+3e4&&t.endTs>=e.highlightStartTs-3e4),p=t.events,u=p[e.eventIndex],m=u&&Ft(u)?u:null,y=m?this._petNames(m):[],f=p.filter(t=>t.endTs>=n&&t.startTs<=s);return Z`
      <div
        class="zoom-overlay"
        @pointerenter=${()=>clearTimeout(this._zoomTimer)}
        @pointerleave=${this._onPointerLeave}
      >
        <div class="zoom-header-info">
          <span class="zoom-time">${(t=>ee(t,this._timeZone,this._lang,this._amPm,!0))(e.highlightStartTs)}</span>
          <span class="zoom-dur">${d}</span>
          ${m&&"unknown"!==m.kind?Z`<span
                class="zoom-kind"
                style="color: ${Rt[m.kind]}"
              >
                <ha-icon icon="${Ut[m.kind]}"></ha-icon>
                ${this._kindLabel(m.kind)}
              </span>`:K}
          ${y.length?Z`<span class="zoom-pets">${y.join(", ")}</span>`:K}
          ${h?Z`<ha-icon
                icon="mdi:lock-open-variant"
                class="zoom-unlock-icon"
                title="${_t(this.hass,"history.unlock_triggered")}"
              ></ha-icon>`:K}
        </div>
        <div class="zoom-header-nav">
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${0===e.eventIndex}
            @click=${t=>{t.stopPropagation(),this._zoomNavigate(-1)}}
            title="${_t(this.hass,"history.previous_event")}"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${e.eventIndex>=p.length-1}
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
            ${this._renderOutside(t,t=>[a(t.startTs),a(t.endTs)])}
            ${f.map(i=>{const o=a(i.startTs),n=Math.max(4,a(i.endTs)-o),s=i.startTs===e.highlightStartTs&&i.endTs===e.highlightEndTs;return this._renderBar(t,i,o,n,s?"1":"0.35",!1)})}
          </svg>
        </div>
        <div class="zoom-axis">
          <span>${c(n)}</span>
          <span>${c(e.centerTs)}</span>
          <span>${c(s)}</span>
        </div>
      </div>
    `}_renderLegend(){const t=Wt(this._data.passages,this.pets),e=t.some(t=>"unknown"!==t.kind),i=t.some(t=>jt(t.kind));return e||this.pets.length?Z`
      <div class="chart-legend">
        ${e?["in","out"].map(t=>Z`<span class="legend-item">
                  <span
                    class="legend-swatch"
                    style="background: ${Rt[t]}"
                    aria-hidden="true"
                  ></span>
                  ${this._kindLabel(t)}
                </span>`):K}
        ${i?Z`<span class="legend-item">
              <span
                class="legend-swatch legend-swatch--attempt"
                aria-hidden="true"
              ></span>
              ${_t(this.hass,"history.attempt")}
            </span>`:K}
        ${this.pets.length?Z`<span class="legend-item">
              <span
                class="legend-swatch legend-swatch--outside"
                aria-hidden="true"
              ></span>
              ${_t(this.hass,"history.outside")}
            </span>`:K}
      </div>
    `:K}_renderChart(t){const e=this._rows(),i=e=>[600*Qt(t,e.startTs),600*Qt(t,e.endTs)];return Z`
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
          ${e.map(t=>Z`
              <div class="chart-row">
                <span
                  class="chart-label"
                  style="color: ${t.color}"
                  title="${t.label}"
                  >${t.label}</span
                >
                <div class="chart-track">
                  <svg
                    class="chart-svg"
                    viewBox="0 0 600 28"
                    preserveAspectRatio="none"
                    @pointerleave=${this._onPointerLeave}
                  >
                    ${this._renderOutside(t,i)}
                    ${t.events.map(e=>{const[o,n]=i(e);return this._renderBar(t,e,o,Math.max(4,n-o),"0.85",!0)})}
                  </svg>
                </div>
                <span class="chart-count">${t.events.length}</span>
                ${this._zoom?.rowKey===t.key?this._renderZoom(t):K}
              </div>
            `)}
        </div>

        <div class="chart-axis">
          <div></div>
          <div class="chart-axis-inner">
            ${function(t,e){const i=[];for(let o=0;o<=24;o+=6){const n=24===o?t.dayEnd:Gt(t.day,o,0,t.timeZone);if(n>t.end+1)break;i.push({ts:n,frac:Qt(t,n),label:te(o,e)})}t.end<t.dayEnd&&(i[i.length-1]?.frac??0)<.97&&i.push({ts:t.end,frac:1,label:ie(t.end,t.timeZone,e)});return i}(t,this._amPm).map(({label:t,frac:e})=>Z`<span style="left: ${100*e}%">${t}</span>`)}
          </div>
          <div></div>
        </div>
        ${this._renderLegend()}
      </div>
    `}render(){const t=this._isEntityOn(this.eventEntityId),e=this._isEntityOn(this.contrabandEntityId),i=this._isEntityOn(this.humanEntityId);return Z`
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
              </span>`:K}
          ${e?Z`<span
                class="event-badge event-badge--contraband"
                title="${_t(this.hass,"history.prey_detected")}"
              >
                <ha-icon icon="mdi:rodent"></ha-icon>
              </span>`:K}
          ${i?Z`<span
                class="event-badge event-badge--human"
                title="${_t(this.hass,"history.human_detected")}"
              >
                <ha-icon icon="mdi:account"></ha-icon>
              </span>`:K}

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
                </div>`:this._window?this._renderChart(this._window):K:K}
      </div>
    `}}ne.styles=a`
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
      grid-template-columns: 64px 1fr 28px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .outside-bar {
      opacity: 0.28;
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
      grid-template-columns: 64px 1fr 28px;
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
      left: 70px;
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

    .zoom-kind {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .zoom-kind ha-icon {
      --mdc-icon-size: 14px;
    }

    .zoom-pets {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .zoom-axis {
      display: flex;
      justify-content: space-between;
      margin-top: 2px;
      font-size: 0.62rem;
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    /* ── Legend ──────────────────────────────────────────── */
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px 12px;
      margin-top: 6px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .legend-swatch {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .legend-swatch--attempt {
      border: 1.5px dashed var(--secondary-text-color);
      box-sizing: border-box;
    }

    .legend-swatch--outside {
      height: 5px;
      background: var(--secondary-text-color);
      opacity: 0.4;
    }
  `,t([mt({attribute:!1})],ne.prototype,"hass",void 0),t([mt()],ne.prototype,"eventEntityId",void 0),t([mt()],ne.prototype,"contrabandEntityId",void 0),t([mt()],ne.prototype,"humanEntityId",void 0),t([mt()],ne.prototype,"lockEntityId",void 0),t([mt({attribute:!1})],ne.prototype,"pets",void 0),t([mt({type:Number})],ne.prototype,"historyDays",void 0),t([yt()],ne.prototype,"_show",void 0),t([yt()],ne.prototype,"_loading",void 0),t([yt()],ne.prototype,"_hasFetched",void 0),t([yt()],ne.prototype,"_error",void 0),t([yt()],ne.prototype,"_data",void 0),t([yt()],ne.prototype,"_window",void 0),t([yt()],ne.prototype,"_offsetPages",void 0),t([yt()],ne.prototype,"_zoom",void 0),customElements.define("onlycat-activity-history",ne);const se=Object.keys(xt);class re extends dt{constructor(){super(...arguments),this._formReady=!!customElements.get("ha-form"),this._computeLabel=t=>{const e=t.name in xt?`entity.${t.name}`:`editor.${t.name}`;return _t(this.hass,e)},this._computeHelper=t=>"device"===t.name?_t(this.hass,"editor.device_hint"):"device_id"===t.name?_t(this.hass,"editor.device_id_hint"):"entities"===t.name?_t(this.hass,"editor.entities_hint"):"history_days"===t.name?bt(this.hass,"editor.history_days_hint",{n:10}):void 0}setConfig(t){this._config=t}connectedCallback(){super.connectedCallback(),this._formReady||async function(){if(!customElements.get("ha-form"))try{const t=await(window.loadCardHelpers?.()),e=t?.createCardElement({type:"entities"}),i=e?.constructor;await(i?.getConfigElement?.())}catch{}}().then(()=>this._formReady=!0)}_schema(){return[{name:"device",selector:{device:{filter:{integration:$t}}}},{name:"name",selector:{text:{}}},{name:"show_title",selector:{boolean:{}}},{name:"show_pets",selector:{boolean:{}}},{name:"entities",type:"expandable",title:_t(this.hass,"editor.entities"),schema:se.map(t=>({name:t,selector:{entity:{domain:xt[t].domain}}}))},{name:"advanced",type:"expandable",flatten:!0,title:_t(this.hass,"editor.advanced"),schema:[{name:"history_days",selector:{number:{min:1,max:365,mode:"box"}}},{name:"device_id",selector:{text:{}}}]}]}_valueChanged(t){t.stopPropagation();const e={...t.detail.value},i=this._config.device||At(this.hass,this._config);e.device&&e.device!==i&&delete e.device_id,this._config=function(t){const e={...t},i=Object.fromEntries(Object.entries(t.entities??{}).filter(([,t])=>!!t));return Object.keys(i).length?e.entities=i:delete e.entities,e.device_id||delete e.device_id,e.device||delete e.device,void 0!==e.history_days&&null!==e.history_days||delete e.history_days,e}(e),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass||!this._formReady)return Z``;const t={show_title:!0,show_pets:!0,...this._config,device:this._config.device||At(this.hass,this._config)};return Z`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${this._schema()}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}}t([mt({attribute:!1})],re.prototype,"hass",void 0),t([yt()],re.prototype,"_config",void 0),t([yt()],re.prototype,"_formReady",void 0),customElements.define("onlycat-home-assistant-card-editor",re);class ae extends dt{constructor(){super(...arguments),this.pets=[]}_renderLastPassage(){const t=this.eventEntityId?this.hass?.states?.[this.eventEntityId]:void 0;if(!t||Ot(t.state))return K;const e=t.attributes,i=It(e?.direction,e?.action);if("unknown"===i)return K;const o=e?.rfidCode?String(e.rfidCode).toLowerCase():void 0,n=this.pets.find(t=>t.rfid===o)?.name;if(this.pets.length&&!n)return K;const s=`history.kind_${i}`;return Z`<span
      class="camera-passage ${jt(i)?"camera-passage--attempt":""}"
      style="--passage-color: ${Rt[i]}"
    >
      <ha-icon icon="${Ut[i]}" aria-hidden="true"></ha-icon>
      ${_t(this.hass,s)}${n?Z` · ${n}`:K}
    </span>`}connectedCallback(){super.connectedCallback(),this._clockTimer=setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._clockTimer)}_entity(){return this.hass?.states?.[this.entityId]}_getSnapshotUrl(){return t=this._entity()?.attributes?.entity_picture,"string"!=typeof t?null:t.startsWith("/api/camera_proxy/")?t:null;var t}_openMoreInfo(){this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:this.entityId}}))}_latestActivityTs(){if(this.lastActivityEntityId){const t=this.hass?.states?.[this.lastActivityEntityId]?.state,e=t?new Date(t).getTime():NaN;if(!isNaN(e))return e}const t=[this.eventEntityId,this.humanEntityId,this.contrabandEntityId];let e=null;for(const i of t){if(!i)continue;const t=this.hass?.states?.[i]?.last_changed;if(!t)continue;const o=new Date(t).getTime();!isNaN(o)&&(null===e||o>e)&&(e=o)}return e}_onKeyDown(t){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._openMoreInfo())}render(){const t=this._getSnapshotUrl(),e=this._latestActivityTs(),i="unavailable"===this._entity()?.state;return Z`
      <div
        class="camera-panel ${t?"camera-panel--clickable":""}"
        role=${t?"button":K}
        tabindex=${t?"0":K}
        aria-label=${t?_t(this.hass,"camera.open"):K}
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
                      >${function(t,e,i){const o=Math.round((i-e)/6e4);if(o<1)return _t(t,"time.just_now");if(o<60)return bt(t,"time.minutes_ago",{n:o});const n=Math.floor(o/60);if(n>=24)return bt(t,"time.days_ago",{d:Math.floor(n/24)});const s=o%60;return 0===s?bt(t,"time.hours_ago",{h:n}):bt(t,"time.hours_minutes_ago",{h:n,m:String(s).padStart(2,"0")})}(this.hass,e,Date.now())}</span
                    >`:K}
                ${this._renderLastPassage()}
              </div>
            `:Z`
              <div class="camera-placeholder">
                <ha-icon
                  icon=${i?"mdi:video-off-outline":"mdi:paw"}
                ></ha-icon>
                <span
                  >${_t(this.hass,i?"camera.stream_unavailable":"card.no_recent_activity")}</span
                >
              </div>
            `}
      </div>
    `}}ae.styles=a`
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

    .camera-passage {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px 2px 6px;
      border-radius: 99px;
      background: var(--passage-color);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .camera-passage ha-icon {
      --mdc-icon-size: 15px;
    }

    .camera-passage--attempt {
      background: rgba(0, 0, 0, 0.45);
      border: 1.5px dashed var(--passage-color);
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
  `,t([mt({attribute:!1})],ae.prototype,"hass",void 0),t([mt()],ae.prototype,"entityId",void 0),t([mt()],ae.prototype,"eventEntityId",void 0),t([mt()],ae.prototype,"humanEntityId",void 0),t([mt()],ae.prototype,"contrabandEntityId",void 0),t([mt()],ae.prototype,"lastActivityEntityId",void 0),t([mt({attribute:!1})],ae.prototype,"pets",void 0),customElements.define("onlycat-camera-panel",ae);class ce extends dt{constructor(){super(...arguments),this.pets=[]}connectedCallback(){super.connectedCallback(),this._clockTimer=setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._clockTimer)}_since(t){const e=t?new Date(t).getTime():NaN;if(isNaN(e))return"";const i=Math.max(0,Math.floor((Date.now()-e)/6e4));if(i<1)return _t(this.hass,"time.just_now");if(i<60)return bt(this.hass,"time.minutes",{n:i});const o=Math.floor(i/60);return o<24?bt(this.hass,"time.hours_minutes",{h:o,m:String(i%60).padStart(2,"0")}):bt(this.hass,"time.days",{d:Math.floor(o/24)})}_openMoreInfo(t){this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}))}render(){return this.pets.length?Z`
      <div class="pets">
        ${this.pets.map(t=>{const e=this.hass?.states?.[t.entityId],i=!Ot(e?.state),o=i&&Mt(e?.state),n=_t(this.hass,i?o?"pets.outside":"pets.inside":"unknown"===e?.state?"pets.unknown":"card.unavailable"),s=i?this._since(e?.last_changed):"",r=`${t.name} · ${n}${s?` · ${s}`:""}`;return Z`
            <button
              type="button"
              class="pet ${i?o?"pet--outside":"pet--inside":"pet--unknown"}"
              style="--pet-color: ${t.color}"
              title="${r}"
              aria-label="${r}"
              @click=${()=>this._openMoreInfo(t.entityId)}
            >
              <ha-icon
                icon="${i?o?"mdi:tree-outline":"mdi:home-outline":"mdi:help-circle-outline"}"
              ></ha-icon>
              <span class="pet-name">${t.name}</span>
              <span class="pet-state"
                >${n}${s?Z` · ${s}`:K}</span
              >
            </button>
          `})}
      </div>
    `:K}}ce.styles=a`
    :host {
      display: block;
    }

    .pets {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .pet {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      padding: 5px 10px 5px 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-left: 3px solid var(--pet-color);
      border-radius: 9px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-size: 0.8rem;
      cursor: pointer;
      transition: border-color 0.15s;
    }

    .pet:hover {
      border-color: var(--pet-color);
    }

    .pet:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }

    .pet ha-icon {
      --mdc-icon-size: 16px;
      flex-shrink: 0;
    }

    .pet--inside ha-icon {
      color: ${r(Rt.in)};
    }

    .pet--outside ha-icon {
      color: ${r(Rt.out)};
    }

    .pet--unknown {
      opacity: 0.6;
    }

    .pet-name {
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pet-state {
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
  `,t([mt({attribute:!1})],ce.prototype,"hass",void 0),t([mt({attribute:!1})],ce.prototype,"pets",void 0),customElements.define("onlycat-pet-status",ce);class le extends dt{constructor(){super(...arguments),this._ids=Et(void 0,{})}static getStubConfig(){return{name:"",device:"",show_title:!0}}static getConfigElement(){return document.createElement("onlycat-home-assistant-card-editor")}setConfig(t){if(!t)throw new Error("Invalid configuration.");this._config={name:t.name??"",device:t.device??"",device_id:t.device_id??"",show_title:!1!==t.show_title,show_pets:!1!==t.show_pets,...t.entities?{entities:{...t.entities}}:{},...void 0!==t.history_days?{history_days:t.history_days}:{},...t.pets?{pets:t.pets}:{}}}getCardSize(){const t=this.offsetHeight;return t>0?Math.ceil(t/50):!1===this._config?.show_title?7:8}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}get _pets(){const t=Pt(this.hass,this._config),e=JSON.stringify(t);return this._petsCache?.key!==e&&(this._petsCache={key:e,pets:t}),this._petsCache.pets}_entity(t){return this.hass?.states?.[t]}_isOn(t){return"on"===this._entity(t)?.state}_isAvailable(t){const e=this._entity(t)?.state;return!!e&&"unavailable"!==e&&"unknown"!==e}_binaryState(t){const e=this._entity(t)?.state;return"on"===e||"off"===e?e:null}_onUnlock(){this._isAvailable(this._ids.unlock)&&this.hass.callService("button","press",{entity_id:this._ids.unlock})}_onRebootConfirm(){this._isAvailable(this._ids.reboot)&&(this.hass.callService("button","press",{entity_id:this._ids.reboot}),this._closeRebootConfirm())}_onPolicyChange(t){const e=t.target.value;e&&this.hass.callService("select","select_option",{entity_id:this._ids.policy,option:e})}_renderStatusPills(){const t=this._binaryState(this._ids.connectivity),e=this._binaryState(this._ids.lock),i=this._isOn(this._ids.errors),o=_t(this.hass,"card.unavailable");return Z`
      <div class="status-pills">
        ${i?Z`<ha-icon
              icon="mdi:alert-circle"
              class="error-pill-icon"
              title="${_t(this.hass,"card.errors")}"
            ></ha-icon>`:K}
        ${null===e?Z`<div class="pill pill--lock pill--unknown">
              <ha-icon icon="mdi:lock-question"></ha-icon>
              <span>${o}</span>
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
              <span>${o}</span>
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
    `}_renderPolicy(){const t=this._entity(this._ids.policy),e=t?.attributes?.options??[],i=t?.state??"";return Z`
      <div class="row-section">
        <ha-icon icon="mdi:home-clock" class="section-icon"></ha-icon>
        <span class="section-label">${_t(this.hass,"card.policy")}</span>
        ${t&&this._isAvailable(this._ids.policy)?Z`
              <select
                class="policy-select"
                .value=${i}
                @change=${t=>this._onPolicyChange(t)}
              >
                ${e.map(e=>Z`<option value="${e}" ?selected=${e===i}>
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
    `}render(){if(!this.hass||!this._config)return K;const t=this._config.name||_t(this.hass,"card.name_default"),e=this._pets;if(!(i=this._config)||!(i.device||i.device_id||Object.values(i.entities??{}).some(Boolean)))return Z`
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
      `;var i;this._ids=Et(this.hass,this._config);const o=this._ids;return Z`
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
            .pets=${e}
          ></onlycat-camera-panel>
          ${this._config.show_pets?Z`<onlycat-pet-status
                .hass=${this.hass}
                .pets=${e}
              ></onlycat-pet-status>`:K}
          ${this._renderPolicy()} ${this._renderActions()}
          <onlycat-activity-history
            .hass=${this.hass}
            .eventEntityId=${o.event}
            .contrabandEntityId=${o.contraband}
            .humanEntityId=${o.human}
            .lockEntityId=${o.lock}
            .pets=${e}
            .historyDays=${this._config.history_days??10}
          ></onlycat-activity-history>
        </div>
      </ha-card>

      ${this._renderRebootDialog()}
    `}}le.styles=a`
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
  `,t([mt({attribute:!1})],le.prototype,"hass",void 0),t([yt()],le.prototype,"_config",void 0),t([ft("dialog.reboot-dialog")],le.prototype,"_rebootDialog",void 0),t([ft(".action-btn--secondary")],le.prototype,"_rebootButton",void 0),customElements.define("onlycat-home-assistant-card",le),window.customCards=window.customCards||[],window.customCards.push({type:"onlycat-home-assistant-card",name:"OnlyCat Home Assistant Card",description:"Card to monitor and control your OnlyCat smart cat flap.",preview:!0,documentationURL:"https://github.com/Gamso/onlycat-home-assistant-card"});
