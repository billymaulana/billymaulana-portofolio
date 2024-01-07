import { p as publicAssetsURL } from '../../handlers/renderer.mjs';
import { useSSRContext, defineComponent, withAsyncContext, computed, mergeProps, unref, ref, toValue as toValue$1, reactive, shallowRef, toRef, getCurrentInstance, onServerPrefetch, isRef, watch, readonly, getCurrentScope, onScopeDispose } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderSuspense } from 'vue/server-renderer';
import { _ as _export_sfc, i as useRouter, h as fetchDefaults, f as asyncDataDefaults, g as useNuxtApp, c as createError } from '../server.mjs';
import { x as hash } from '../../nitro/vercel.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';

const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _a;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  const nuxt = useNuxtApp();
  const getDefault = () => null;
  const getDefaultCachedData = () => nuxt.isHydrating ? nuxt.payload.data[key] : nuxt.static.data[key];
  options.server = options.server ?? true;
  options.default = options.default ?? getDefault;
  options.getCachedData = options.getCachedData ?? getDefaultCachedData;
  options.lazy = options.lazy ?? false;
  options.immediate = options.immediate ?? true;
  options.deep = options.deep ?? asyncDataDefaults.deep;
  options.dedupe = options.dedupe ?? "cancel";
  const hasCachedData = () => ![null, void 0].includes(options.getCachedData(key));
  if (!nuxt._asyncData[key] || !options.immediate) {
    (_a = nuxt.payload._errors)[key] ?? (_a[key] = null);
    const _ref = options.deep ? ref : shallowRef;
    nuxt._asyncData[key] = {
      data: _ref(options.getCachedData(key) ?? options.default()),
      pending: ref(!hasCachedData()),
      error: toRef(nuxt.payload._errors, key),
      status: ref("idle")
    };
  }
  const asyncData = { ...nuxt._asyncData[key] };
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      if (isDefer(opts.dedupe ?? options.dedupe)) {
        return nuxt._asyncDataPromises[key];
      }
      nuxt._asyncDataPromises[key].cancelled = true;
    }
    if ((opts._initial || nuxt.isHydrating && opts._initial !== false) && hasCachedData()) {
      return Promise.resolve(options.getCachedData(key));
    }
    asyncData.pending.value = true;
    asyncData.status.value = "pending";
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxt));
        } catch (err) {
          reject(err);
        }
      }
    ).then((_result) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      nuxt.payload.data[key] = result;
      asyncData.data.value = result;
      asyncData.error.value = null;
      asyncData.status.value = "success";
    }).catch((error) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      asyncData.error.value = createError(error);
      asyncData.data.value = unref(options.default());
      asyncData.status.value = "error";
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      delete nuxt._asyncDataPromises[key];
    });
    nuxt._asyncDataPromises[key] = promise;
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxt.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function useRequestFetch() {
  var _a;
  return ((_a = useRequestEvent()) == null ? void 0 : _a.$fetch) || globalThis.$fetch;
}
function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _request = computed(() => {
    let r = request;
    if (typeof r === "function") {
      r = r();
    }
    return toValue$1(r);
  });
  const _key = opts.key || hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(opts)]);
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useFetch] key must be a string: " + _key);
  }
  if (!request) {
    throw new Error("[nuxt] [useFetch] request is missing.");
  }
  const key = _key === autoKey ? "$f" + _key : _key;
  if (!opts.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    watch: watch2,
    immediate,
    getCachedData,
    deep,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchDefaults,
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    immediate,
    getCachedData,
    deep,
    watch: watch2 === false ? [] : [_fetchOptions, _request, ...watch2 || []]
  };
  let controller;
  const asyncData = useAsyncData(key, () => {
    var _a;
    (_a = controller == null ? void 0 : controller.abort) == null ? void 0 : _a.call(controller);
    controller = typeof AbortController !== "undefined" ? new AbortController() : {};
    const timeoutLength = toValue$1(opts.timeout);
    if (timeoutLength) {
      setTimeout(() => controller.abort(), timeoutLength);
    }
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch) {
      const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue$1(opts.baseURL) || toValue$1(opts.baseURL)[0] === "/");
      if (isLocalFetch) {
        _$fetch = useRequestFetch();
      }
    }
    return _$fetch(_request.value, { signal: controller.signal, ..._fetchOptions });
  }, _asyncDataOptions);
  return asyncData;
}
function generateOptionSegments(opts) {
  var _a;
  const segments = [
    ((_a = toValue$1(opts.method)) == null ? void 0 : _a.toUpperCase()) || "GET",
    toValue$1(opts.baseURL)
  ];
  for (const _obj of [opts.params || opts.query]) {
    const obj = toValue$1(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue$1(key)] = toValue$1(value);
    }
    segments.push(unwrapped);
  }
  return segments;
}
const _imports_0 = "" + publicAssetsURL("nuxt.png");
const _imports_1 = "" + publicAssetsURL("vite.png");
const _sfc_main$3 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    "inline-flex": "",
    "text-2xl": "",
    "font-300": "",
    "cursor-default": ""
  }, _attrs))}><div flex flex-col children:mx-auto><img w-18 h-18 inline-block${ssrRenderAttr("src", _imports_0)}><span text-green5 mt--2>Nuxt 3</span></div><div text="3xl gray4" m="x-4 y-auto" transition-all-500 transform hover:rotate-135 i-carbon-add></div><div flex flex-col children:mx-auto><img w-18 h-18 inline-block${ssrRenderAttr("src", _imports_1)}><span text-purple5 mt--2>Vite</span></div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Logos.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1]]);
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
const isClient = false;
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
function useIntervalFn(cb, interval = 1e3, options = {}) {
  const {
    immediate = true,
    immediateCallback = false
  } = options;
  let timer = null;
  const isActive = ref(false);
  function clean() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function pause() {
    isActive.value = false;
    clean();
  }
  function resume() {
    const intervalValue = toValue(interval);
    if (intervalValue <= 0)
      return;
    isActive.value = true;
    if (immediateCallback)
      cb();
    clean();
    timer = setInterval(cb, intervalValue);
  }
  if (immediate && isClient)
    resume();
  if (isRef(interval) || typeof interval === "function") {
    const stopWatch = watch(interval, () => {
      if (isActive.value && isClient)
        resume();
    });
    tryOnScopeDispose(stopWatch);
  }
  tryOnScopeDispose(pause);
  return {
    isActive,
    pause,
    resume
  };
}
const defaultWindow = void 0;
function useRafFn(fn, options = {}) {
  const {
    immediate = true,
    fpsLimit = void 0,
    window: window2 = defaultWindow
  } = options;
  const isActive = ref(false);
  const intervalLimit = fpsLimit ? 1e3 / fpsLimit : null;
  let previousFrameTimestamp = 0;
  let rafId = null;
  function loop(timestamp2) {
    if (!isActive.value || !window2)
      return;
    const delta = timestamp2 - (previousFrameTimestamp || timestamp2);
    if (intervalLimit && delta < intervalLimit) {
      rafId = window2.requestAnimationFrame(loop);
      return;
    }
    fn({ delta, timestamp: timestamp2 });
    previousFrameTimestamp = timestamp2;
    rafId = window2.requestAnimationFrame(loop);
  }
  function resume() {
    if (!isActive.value && window2) {
      isActive.value = true;
      rafId = window2.requestAnimationFrame(loop);
    }
  }
  function pause() {
    isActive.value = false;
    if (rafId != null && window2) {
      window2.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  if (immediate)
    resume();
  tryOnScopeDispose(pause);
  return {
    isActive: readonly(isActive),
    pause,
    resume
  };
}
function useNow(options = {}) {
  const {
    controls: exposeControls = false,
    interval = "requestAnimationFrame"
  } = options;
  const now = ref(/* @__PURE__ */ new Date());
  const update = () => now.value = /* @__PURE__ */ new Date();
  const controls = interval === "requestAnimationFrame" ? useRafFn(update, { immediate: true }) : useIntervalFn(update, interval, { immediate: true });
  if (exposeControls) {
    return {
      now,
      ...controls
    };
  } else {
    return now;
  }
}
const DEFAULT_UNITS = [
  { max: 6e4, value: 1e3, name: "second" },
  { max: 276e4, value: 6e4, name: "minute" },
  { max: 72e6, value: 36e5, name: "hour" },
  { max: 5184e5, value: 864e5, name: "day" },
  { max: 24192e5, value: 6048e5, name: "week" },
  { max: 28512e6, value: 2592e6, name: "month" },
  { max: Number.POSITIVE_INFINITY, value: 31536e6, name: "year" }
];
const DEFAULT_MESSAGES = {
  justNow: "just now",
  past: (n) => n.match(/\d/) ? `${n} ago` : n,
  future: (n) => n.match(/\d/) ? `in ${n}` : n,
  month: (n, past) => n === 1 ? past ? "last month" : "next month" : `${n} month${n > 1 ? "s" : ""}`,
  year: (n, past) => n === 1 ? past ? "last year" : "next year" : `${n} year${n > 1 ? "s" : ""}`,
  day: (n, past) => n === 1 ? past ? "yesterday" : "tomorrow" : `${n} day${n > 1 ? "s" : ""}`,
  week: (n, past) => n === 1 ? past ? "last week" : "next week" : `${n} week${n > 1 ? "s" : ""}`,
  hour: (n) => `${n} hour${n > 1 ? "s" : ""}`,
  minute: (n) => `${n} minute${n > 1 ? "s" : ""}`,
  second: (n) => `${n} second${n > 1 ? "s" : ""}`,
  invalid: ""
};
function DEFAULT_FORMATTER(date) {
  return date.toISOString().slice(0, 10);
}
function useTimeAgo(time, options = {}) {
  const {
    controls: exposeControls = false,
    updateInterval = 3e4
  } = options;
  const { now, ...controls } = useNow({ interval: updateInterval, controls: true });
  const timeAgo = computed(() => formatTimeAgo(new Date(toValue(time)), options, toValue(now)));
  if (exposeControls) {
    return {
      timeAgo,
      ...controls
    };
  } else {
    return timeAgo;
  }
}
function formatTimeAgo(from, options = {}, now = Date.now()) {
  var _a;
  const {
    max,
    messages = DEFAULT_MESSAGES,
    fullDateFormatter = DEFAULT_FORMATTER,
    units = DEFAULT_UNITS,
    showSecond = false,
    rounding = "round"
  } = options;
  const roundFn = typeof rounding === "number" ? (n) => +n.toFixed(rounding) : Math[rounding];
  const diff = +now - +from;
  const absDiff = Math.abs(diff);
  function getValue2(diff2, unit) {
    return roundFn(Math.abs(diff2) / unit.value);
  }
  function format(diff2, unit) {
    const val = getValue2(diff2, unit);
    const past = diff2 > 0;
    const str = applyFormat(unit.name, val, past);
    return applyFormat(past ? "past" : "future", str, past);
  }
  function applyFormat(name, val, isPast) {
    const formatter = messages[name];
    if (typeof formatter === "function")
      return formatter(val, isPast);
    return formatter.replace("{0}", val.toString());
  }
  if (absDiff < 6e4 && !showSecond)
    return messages.justNow;
  if (typeof max === "number" && absDiff > max)
    return fullDateFormatter(new Date(from));
  if (typeof max === "string") {
    const unitMax = (_a = units.find((i) => i.name === max)) == null ? void 0 : _a.max;
    if (unitMax && absDiff > unitMax)
      return fullDateFormatter(new Date(from));
  }
  for (const [idx, unit] of units.entries()) {
    const val = getValue2(diff, unit);
    if (val <= 0 && units[idx - 1])
      return format(diff, units[idx - 1]);
    if (absDiff < unit.max)
      return format(diff, unit);
  }
  return messages.invalid;
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "PageView",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/pageview", "$GYaFMVMIJ4")), __temp = await __temp, __restore(), __temp);
    const time = useTimeAgo(computed(() => data.value.startAt));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ "text-gray:80": "" }, _attrs))}><h1>Under Construction</h1><span font-500 text-gray>${ssrInterpolate(unref(data).pageview)}</span> page views since <span text-gray>${ssrInterpolate(unref(time))}</span></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PageView.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "InputEntry",
  __ssrInlineRender: true,
  setup(__props) {
    const name = ref("");
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><input id="input"${ssrRenderAttr("value", unref(name))} placeholder="What&#39;s your name?" type="text" autocomplete="false" p="x-4 y-2" m="t-5" w="250px" text="center" bg="transparent" border="~ rounded gray-200 dark:gray-700" outline="none active:none"><div><button class="m-3 text-sm btn"${ssrIncludeBooleanAttr(!unref(name)) ? " disabled" : ""}> GO </button></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InputEntry.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Logos = __nuxt_component_0;
  const _component_PageView = _sfc_main$2;
  const _component_InputEntry = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Logos, { "mb-6": "" }, null, _parent));
  ssrRenderSuspense(_push, {
    fallback: () => {
      _push(`<div op50 italic><span animate-pulse>Loading...</span></div>`);
    },
    default: () => {
      _push(ssrRenderComponent(_component_PageView, null, null, _parent));
    },
    _: 1
  });
  _push(ssrRenderComponent(_component_InputEntry, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-7o0Knlut.mjs.map
