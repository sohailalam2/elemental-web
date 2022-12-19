import{_ as s,c as n,o as a,a as l}from"./app.f6b5dcc0.js";const u=JSON.parse('{"title":"Event Controller","description":"","frontmatter":{},"headers":[],"relativePath":"elemental-component/event-controller/index.md"}'),p={name:"elemental-component/event-controller/index.md"},e=l(`<h1 id="event-controller" tabindex="-1">Event Controller <a class="header-anchor" href="#event-controller" aria-hidden="true">#</a></h1><p><code>EventController</code> is an interface that declares the ways to register and deregister an event. It also declares the way to dispatch an event - either a regular or a custom one.</p><h2 id="eventcontroller-interface" tabindex="-1">EventController Interface <a class="header-anchor" href="#eventcontroller-interface" aria-hidden="true">#</a></h2><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#569CD6;">interface</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">EventController</span><span style="color:#E6E6E6;"> {</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#DCDCAA;">registerEventListeners</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> (</span><span style="color:#9CDCFE;">registrations</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">EventListenerRegistration</span><span style="color:#E6E6E6;">[]) </span><span style="color:#569CD6;">=&gt;</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">void</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#DCDCAA;">deregisterEventListeners</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> () </span><span style="color:#569CD6;">=&gt;</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">void</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#DCDCAA;">raiseEvent</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> &lt;</span><span style="color:#4EC9B0;">Payload</span><span style="color:#E6E6E6;"> </span><span style="color:#D4D4D4;">=</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">undefined</span><span style="color:#E6E6E6;">&gt;(</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">     * A string with the name of the event. It is case-sensitive.</span></span>
<span class="line"><span style="color:#6A9955;">     */</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#9CDCFE;">name</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">string</span><span style="color:#E6E6E6;">,</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#9CDCFE;">isCustom</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;">,</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">     * The read-only detail property of the CustomEvent interface returns any</span></span>
<span class="line"><span style="color:#6A9955;">     * data passed when initializing the event via this payload property</span></span>
<span class="line"><span style="color:#6A9955;">     */</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#9CDCFE;">payload</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">Payload</span><span style="color:#E6E6E6;">,</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#9CDCFE;">options</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">EventOptions</span><span style="color:#E6E6E6;">,</span></span>
<span class="line"><span style="color:#E6E6E6;">  ) </span><span style="color:#569CD6;">=&gt;</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">void</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"><span style="color:#E6E6E6;">}</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#0991B6;">interface</span><span style="color:#002339;"> </span><span style="color:#0444AC;">EventController</span><span style="color:#002339;"> {</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#7EB233;">registerEventListeners</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> (</span><span style="color:#B1108E;">registrations</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#0444AC;">EventListenerRegistration</span><span style="color:#002339;">[]) </span><span style="color:#0991B6;">=&gt;</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">void</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#7EB233;">deregisterEventListeners</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> () </span><span style="color:#0991B6;">=&gt;</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">void</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#7EB233;">raiseEvent</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> &lt;</span><span style="color:#0444AC;">Payload</span><span style="color:#002339;"> </span><span style="color:#7B30D0;">=</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">undefined</span><span style="color:#002339;">&gt;(</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">     * A string with the name of the event. It is case-sensitive.</span></span>
<span class="line"><span style="color:#357B42;">     */</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#B1108E;">name</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">string</span><span style="color:#002339;">,</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#B1108E;">isCustom</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;">,</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">     * The read-only detail property of the CustomEvent interface returns any</span></span>
<span class="line"><span style="color:#357B42;">     * data passed when initializing the event via this payload property</span></span>
<span class="line"><span style="color:#357B42;">     */</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#B1108E;">payload</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#0444AC;">Payload</span><span style="color:#002339;">,</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#B1108E;">options</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#0444AC;">EventOptions</span><span style="color:#002339;">,</span></span>
<span class="line"><span style="color:#002339;">  ) </span><span style="color:#0991B6;">=&gt;</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">void</span><span style="color:#002339;">;</span></span>
<span class="line"><span style="color:#002339;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><h3 id="event-options" tabindex="-1">Event Options <a class="header-anchor" href="#event-options" aria-hidden="true">#</a></h3><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#569CD6;">interface</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">EventOptions</span><span style="color:#E6E6E6;"> {</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">   * A boolean value indicating whether the event bubbles.</span></span>
<span class="line"><span style="color:#6A9955;">   * The default is \`true\`</span></span>
<span class="line"><span style="color:#6A9955;">   */</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#9CDCFE;">bubbles</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">   * A boolean value indicating whether the event can be cancelled.</span></span>
<span class="line"><span style="color:#6A9955;">   * The default is \`true\`</span></span>
<span class="line"><span style="color:#6A9955;">   */</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#9CDCFE;">cancelable</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">   * A boolean value indicating whether the event will trigger listeners</span></span>
<span class="line"><span style="color:#6A9955;">   * outside of a shadow root. The default is \`true\`</span></span>
<span class="line"><span style="color:#6A9955;">   *</span></span>
<span class="line"><span style="color:#6A9955;">   * </span><span style="color:#569CD6;">@link</span><span style="color:#6A9955;"> Event.composed for more details</span></span>
<span class="line"><span style="color:#6A9955;">   * https://developer.mozilla.org/en-US/docs/Web/API/Event/composed</span></span>
<span class="line"><span style="color:#6A9955;">   */</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#9CDCFE;">composed</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"><span style="color:#E6E6E6;">}</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#0991B6;">interface</span><span style="color:#002339;"> </span><span style="color:#0444AC;">EventOptions</span><span style="color:#002339;"> {</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">   * A boolean value indicating whether the event bubbles.</span></span>
<span class="line"><span style="color:#357B42;">   * The default is \`true\`</span></span>
<span class="line"><span style="color:#357B42;">   */</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#2F86D2;">bubbles</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">   * A boolean value indicating whether the event can be cancelled.</span></span>
<span class="line"><span style="color:#357B42;">   * The default is \`true\`</span></span>
<span class="line"><span style="color:#357B42;">   */</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#2F86D2;">cancelable</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">   * A boolean value indicating whether the event will trigger listeners</span></span>
<span class="line"><span style="color:#357B42;">   * outside of a shadow root. The default is \`true\`</span></span>
<span class="line"><span style="color:#357B42;">   *</span></span>
<span class="line"><span style="color:#357B42;">   * </span><span style="color:#0991B6;">@link</span><span style="color:#357B42;"> Event.composed for more details</span></span>
<span class="line"><span style="color:#357B42;">   * https://developer.mozilla.org/en-US/docs/Web/API/Event/composed</span></span>
<span class="line"><span style="color:#357B42;">   */</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#2F86D2;">composed</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;">;</span></span>
<span class="line"><span style="color:#002339;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p>This interface has a default implementation provided by the <code>DefaultEventController</code> class.</p><p><code>ElementalComponent</code> uses the default implementation and currently there is no specific way to change use a different implementation.</p><h3 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h3><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#569CD6;">class</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">MyComponent</span><span style="color:#E6E6E6;"> </span><span style="color:#569CD6;">extends</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">HTMLElement</span><span style="color:#E6E6E6;"> {</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#DCDCAA;">onClickHandler</span><span style="color:#E6E6E6;">() {</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#6A9955;">// do nothing</span></span>
<span class="line"><span style="color:#E6E6E6;">  }</span></span>
<span class="line"><span style="color:#E6E6E6;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9CDCFE;">ElementalComponentRegistry</span><span style="color:#E6E6E6;">.</span><span style="color:#DCDCAA;">registerComponent</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">MyComponent</span><span style="color:#E6E6E6;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">const</span><span style="color:#E6E6E6;"> </span><span style="color:#9CDCFE;">component</span><span style="color:#E6E6E6;"> </span><span style="color:#D4D4D4;">=</span><span style="color:#E6E6E6;"> </span><span style="color:#569CD6;">new</span><span style="color:#E6E6E6;"> </span><span style="color:#DCDCAA;">MyComponent</span><span style="color:#E6E6E6;">();</span></span>
<span class="line"><span style="color:#569CD6;">const</span><span style="color:#E6E6E6;"> </span><span style="color:#9CDCFE;">controller</span><span style="color:#E6E6E6;"> </span><span style="color:#D4D4D4;">=</span><span style="color:#E6E6E6;"> </span><span style="color:#569CD6;">new</span><span style="color:#E6E6E6;"> </span><span style="color:#DCDCAA;">DefaultEventController</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">component</span><span style="color:#E6E6E6;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">const</span><span style="color:#E6E6E6;"> </span><span style="color:#9CDCFE;">registrations</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">EventListenerRegistration</span><span style="color:#E6E6E6;">[] </span><span style="color:#D4D4D4;">=</span><span style="color:#E6E6E6;"> [</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// creates a regular event handler and provide a handler reference</span></span>
<span class="line"><span style="color:#E6E6E6;">  { </span><span style="color:#9CDCFE;">name:</span><span style="color:#E6E6E6;"> </span><span style="color:#CE9178;">&#39;click&#39;</span><span style="color:#E6E6E6;">, </span><span style="color:#9CDCFE;">handler:</span><span style="color:#E6E6E6;"> </span><span style="color:#9CDCFE;">component</span><span style="color:#E6E6E6;">.</span><span style="color:#9CDCFE;">clickHandler</span><span style="color:#E6E6E6;"> },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// creates a custom event handler and proides a handler has its method name</span></span>
<span class="line"><span style="color:#E6E6E6;">  { </span><span style="color:#9CDCFE;">name:</span><span style="color:#E6E6E6;"> </span><span style="color:#CE9178;">&#39;custom-click&#39;</span><span style="color:#E6E6E6;">, </span><span style="color:#9CDCFE;">handlerName:</span><span style="color:#E6E6E6;"> </span><span style="color:#CE9178;">&#39;onClickHandler&#39;</span><span style="color:#E6E6E6;">, </span><span style="color:#9CDCFE;">isCustomEvent:</span><span style="color:#E6E6E6;"> </span><span style="color:#569CD6;">true</span><span style="color:#E6E6E6;"> },</span></span>
<span class="line"><span style="color:#E6E6E6;">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9CDCFE;">controller</span><span style="color:#E6E6E6;">.</span><span style="color:#DCDCAA;">registerEventListeners</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">registrations</span><span style="color:#E6E6E6;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9CDCFE;">component</span><span style="color:#E6E6E6;">.</span><span style="color:#DCDCAA;">click</span><span style="color:#E6E6E6;">();</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#0991B6;">class</span><span style="color:#002339;"> </span><span style="color:#0444AC;">MyComponent</span><span style="color:#002339;"> </span><span style="color:#DA5221;">extends</span><span style="color:#002339;"> </span><span style="color:#B02767;">HTMLElement</span><span style="color:#002339;"> {</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#7EB233;">onClickHandler</span><span style="color:#002339;">() {</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#357B42;">// do nothing</span></span>
<span class="line"><span style="color:#002339;">  }</span></span>
<span class="line"><span style="color:#002339;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#2F86D2;">ElementalComponentRegistry</span><span style="color:#002339;">.</span><span style="color:#7EB233;">registerComponent</span><span style="color:#002339;">(</span><span style="color:#2F86D2;">MyComponent</span><span style="color:#002339;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#0991B6;">const</span><span style="color:#002339;"> </span><span style="color:#2F86D2;">component</span><span style="color:#002339;"> </span><span style="color:#7B30D0;">=</span><span style="color:#002339;"> </span><span style="color:#7B30D0;">new</span><span style="color:#002339;"> </span><span style="color:#7EB233;">MyComponent</span><span style="color:#002339;">();</span></span>
<span class="line"><span style="color:#0991B6;">const</span><span style="color:#002339;"> </span><span style="color:#2F86D2;">controller</span><span style="color:#002339;"> </span><span style="color:#7B30D0;">=</span><span style="color:#002339;"> </span><span style="color:#7B30D0;">new</span><span style="color:#002339;"> </span><span style="color:#7EB233;">DefaultEventController</span><span style="color:#002339;">(</span><span style="color:#2F86D2;">component</span><span style="color:#002339;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#0991B6;">const</span><span style="color:#002339;"> </span><span style="color:#2F86D2;">registrations</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#0444AC;">EventListenerRegistration</span><span style="color:#002339;">[] </span><span style="color:#7B30D0;">=</span><span style="color:#002339;"> [</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">// creates a regular event handler and provide a handler reference</span></span>
<span class="line"><span style="color:#002339;">  { name: </span><span style="color:#A44185;">&#39;click&#39;</span><span style="color:#002339;">, handler: </span><span style="color:#2F86D2;">component</span><span style="color:#002339;">.</span><span style="color:#2F86D2;">clickHandler</span><span style="color:#002339;"> },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">// creates a custom event handler and proides a handler has its method name</span></span>
<span class="line"><span style="color:#002339;">  { name: </span><span style="color:#A44185;">&#39;custom-click&#39;</span><span style="color:#002339;">, handlerName: </span><span style="color:#A44185;">&#39;onClickHandler&#39;</span><span style="color:#002339;">, isCustomEvent: </span><span style="color:#174781;">true</span><span style="color:#002339;"> },</span></span>
<span class="line"><span style="color:#002339;">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#2F86D2;">controller</span><span style="color:#002339;">.</span><span style="color:#7EB233;">registerEventListeners</span><span style="color:#002339;">(</span><span style="color:#2F86D2;">registrations</span><span style="color:#002339;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#2F86D2;">component</span><span style="color:#002339;">.</span><span style="color:#7EB233;">click</span><span style="color:#002339;">();</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><div class="tip custom-block"><p class="custom-block-title">\u{1F481} Register event handlers for any <code>HTMLElement</code></p><p>Not so surprising is that you can use the <code>registerEventListeners()</code> method to register <em>any</em> <code>HTMLElement</code> and not necessarily restricted to using <code>ElementalComponent</code> and you will still benefit from its usage \u{1F603}</p></div><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki vp-code-dark"><code><span class="line"><span style="color:#569CD6;">interface</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">EventListenerRegistration</span><span style="color:#E6E6E6;"> {</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">   * A string with the name of the event. It is case-sensitive</span></span>
<span class="line"><span style="color:#6A9955;">   */</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#9CDCFE;">name</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">string</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">   * The handler name as text</span></span>
<span class="line"><span style="color:#6A9955;">   */</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#9CDCFE;">handlerName</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">string</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">   * The handler as a method reference. The callback accepts a single parameter:</span></span>
<span class="line"><span style="color:#6A9955;">   * </span><span style="color:#569CD6;">@param</span><span style="color:#6A9955;"> </span><span style="color:#9CDCFE;">e</span><span style="color:#6A9955;">   an object based on Event describing the event that has occurred,</span></span>
<span class="line"><span style="color:#6A9955;">   *            and it returns nothing.</span></span>
<span class="line"><span style="color:#6A9955;">   */</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#DCDCAA;">handler</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> (</span><span style="color:#9CDCFE;">e</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">Event</span><span style="color:#E6E6E6;">) </span><span style="color:#569CD6;">=&gt;</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">void</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">   * The element this listener should be bound to. By default, the listener</span></span>
<span class="line"><span style="color:#6A9955;">   * is bound to the component instance</span></span>
<span class="line"><span style="color:#6A9955;">   */</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#9CDCFE;">attachTo</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">HTMLElement</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">   * Indicates whether this listener is meant to capture normal events or</span></span>
<span class="line"><span style="color:#6A9955;">   * CustomEvents</span></span>
<span class="line"><span style="color:#6A9955;">   */</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#9CDCFE;">isCustomEvent</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">   * </span><span style="color:#569CD6;">@link</span><span style="color:#6A9955;"> https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener</span></span>
<span class="line"><span style="color:#6A9955;">   */</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#9CDCFE;">options</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> {</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">     * A boolean value indicating that events of this type will be</span></span>
<span class="line"><span style="color:#6A9955;">     * dispatched to the registered listener before being dispatched</span></span>
<span class="line"><span style="color:#6A9955;">     * to any EventTarget beneath it in the DOM tree. If not specified,</span></span>
<span class="line"><span style="color:#6A9955;">     * defaults to \`true\`.</span></span>
<span class="line"><span style="color:#6A9955;">     */</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#9CDCFE;">capture</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">     * A boolean value that, if true, indicates that the function specified</span></span>
<span class="line"><span style="color:#6A9955;">     * by listener will never call preventDefault(). If a passive listener</span></span>
<span class="line"><span style="color:#6A9955;">     * does call preventDefault(), the user agent will do nothing other than</span></span>
<span class="line"><span style="color:#6A9955;">     * generate a console warning. If not specified, defaults to false \u2013</span></span>
<span class="line"><span style="color:#6A9955;">     * except that in browsers other than Safari and Internet Explorer,</span></span>
<span class="line"><span style="color:#6A9955;">     * defaults to true for the wheel, mousewheel, touchstart and touchmove</span></span>
<span class="line"><span style="color:#6A9955;">     * events.</span></span>
<span class="line"><span style="color:#6A9955;">     */</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#9CDCFE;">passive</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">     * A boolean value indicating that the listener should be invoked at most</span></span>
<span class="line"><span style="color:#6A9955;">     * once after being added. If true, the listener would be automatically</span></span>
<span class="line"><span style="color:#6A9955;">     * removed when invoked. If not specified, defaults to false.</span></span>
<span class="line"><span style="color:#6A9955;">     */</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#9CDCFE;">once</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">     * An AbortSignal. The listener will be removed when the given AbortSignal</span></span>
<span class="line"><span style="color:#6A9955;">     * object&#39;s abort() method is called. If not specified, no AbortSignal is</span></span>
<span class="line"><span style="color:#6A9955;">     * associated with the listener.</span></span>
<span class="line"><span style="color:#6A9955;">     */</span></span>
<span class="line"><span style="color:#E6E6E6;">    </span><span style="color:#9CDCFE;">signal</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">AbortSignal</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"><span style="color:#E6E6E6;">  };</span></span>
<span class="line"><span style="color:#E6E6E6;">}</span></span>
<span class="line"></span></code></pre><pre class="shiki vp-code-light"><code><span class="line"><span style="color:#0991B6;">interface</span><span style="color:#002339;"> </span><span style="color:#0444AC;">EventListenerRegistration</span><span style="color:#002339;"> {</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">   * A string with the name of the event. It is case-sensitive</span></span>
<span class="line"><span style="color:#357B42;">   */</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#2F86D2;">name</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">string</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">   * The handler name as text</span></span>
<span class="line"><span style="color:#357B42;">   */</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#2F86D2;">handlerName</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">string</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">   * The handler as a method reference. The callback accepts a single parameter:</span></span>
<span class="line"><span style="color:#357B42;">   * </span><span style="color:#0991B6;">@param</span><span style="color:#357B42;"> </span><span style="color:#2F86D2;">e</span><span style="color:#357B42;">   an object based on Event describing the event that has occurred,</span></span>
<span class="line"><span style="color:#357B42;">   *            and it returns nothing.</span></span>
<span class="line"><span style="color:#357B42;">   */</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#7EB233;">handler</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> (</span><span style="color:#B1108E;">e</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#0444AC;">Event</span><span style="color:#002339;">) </span><span style="color:#0991B6;">=&gt;</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">void</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">   * The element this listener should be bound to. By default, the listener</span></span>
<span class="line"><span style="color:#357B42;">   * is bound to the component instance</span></span>
<span class="line"><span style="color:#357B42;">   */</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#2F86D2;">attachTo</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#0444AC;">HTMLElement</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">   * Indicates whether this listener is meant to capture normal events or</span></span>
<span class="line"><span style="color:#357B42;">   * CustomEvents</span></span>
<span class="line"><span style="color:#357B42;">   */</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#2F86D2;">isCustomEvent</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">   * </span><span style="color:#0991B6;">@link</span><span style="color:#357B42;"> https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener</span></span>
<span class="line"><span style="color:#357B42;">   */</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#2F86D2;">options</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> {</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">     * A boolean value indicating that events of this type will be</span></span>
<span class="line"><span style="color:#357B42;">     * dispatched to the registered listener before being dispatched</span></span>
<span class="line"><span style="color:#357B42;">     * to any EventTarget beneath it in the DOM tree. If not specified,</span></span>
<span class="line"><span style="color:#357B42;">     * defaults to \`true\`.</span></span>
<span class="line"><span style="color:#357B42;">     */</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#2F86D2;">capture</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">     * A boolean value that, if true, indicates that the function specified</span></span>
<span class="line"><span style="color:#357B42;">     * by listener will never call preventDefault(). If a passive listener</span></span>
<span class="line"><span style="color:#357B42;">     * does call preventDefault(), the user agent will do nothing other than</span></span>
<span class="line"><span style="color:#357B42;">     * generate a console warning. If not specified, defaults to false \u2013</span></span>
<span class="line"><span style="color:#357B42;">     * except that in browsers other than Safari and Internet Explorer,</span></span>
<span class="line"><span style="color:#357B42;">     * defaults to true for the wheel, mousewheel, touchstart and touchmove</span></span>
<span class="line"><span style="color:#357B42;">     * events.</span></span>
<span class="line"><span style="color:#357B42;">     */</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#2F86D2;">passive</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">     * A boolean value indicating that the listener should be invoked at most</span></span>
<span class="line"><span style="color:#357B42;">     * once after being added. If true, the listener would be automatically</span></span>
<span class="line"><span style="color:#357B42;">     * removed when invoked. If not specified, defaults to false.</span></span>
<span class="line"><span style="color:#357B42;">     */</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#2F86D2;">once</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#357B42;">/**</span></span>
<span class="line"><span style="color:#357B42;">     * An AbortSignal. The listener will be removed when the given AbortSignal</span></span>
<span class="line"><span style="color:#357B42;">     * object&#39;s abort() method is called. If not specified, no AbortSignal is</span></span>
<span class="line"><span style="color:#357B42;">     * associated with the listener.</span></span>
<span class="line"><span style="color:#357B42;">     */</span></span>
<span class="line"><span style="color:#002339;">    </span><span style="color:#2F86D2;">signal</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#0444AC;">AbortSignal</span><span style="color:#002339;">;</span></span>
<span class="line"><span style="color:#002339;">  };</span></span>
<span class="line"><span style="color:#002339;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br></div></div>`,12),o=[e];function t(c,r,i,y,E,b){return a(),n("div",null,o)}const m=s(p,[["render",t]]);export{u as __pageData,m as default};
