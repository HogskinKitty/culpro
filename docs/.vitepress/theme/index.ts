import DefaultTheme from 'vitepress/theme'
import './style/index.css'
import mediumZoom from 'medium-zoom';
import { onMounted, ref, watch, nextTick } from 'vue';
import { useData, useRoute } from 'vitepress';

// Live2D 模型配置
const MODEL_CONFIGS = {
  DARK: 'https://model.oml2d.com/cat-black/model.json',
  LIGHT: 'https://model.oml2d.com/cat-white/model.json',
  DEFAULT_SCALE: 0.15,
  DEFAULT_POSITION: [0, 20] as [number, number],
  DEFAULT_HEIGHT: 350
};

export default {
  extends: DefaultTheme,

  setup() {
    const route = useRoute();
    const { isDark: dark } = useData();
    const oml2dInstance = ref<any>(null);
    const isModelLoading = ref(false);

    // 模型路径状态
    let modelPath = dark.value ? MODEL_CONFIGS.DARK : MODEL_CONFIGS.LIGHT;

    // 初始化图片缩放功能
    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' });
    };

    // 更新模型路径
    const updateModelPath = (isDark: boolean) => {
      modelPath = isDark ? MODEL_CONFIGS.DARK : MODEL_CONFIGS.LIGHT;
    };

    // 创建 Live2D 实例
    const createLive2dInstance = async () => {
      if (isModelLoading.value) return;

      try {
        isModelLoading.value = true;
        const { loadOml2d } = await import('oh-my-live2d');
        oml2dInstance.value = loadOml2d({
          statusBar: {
            disable: true,
            loadSuccessMessage: '麻麻酱我来咯',
          },
          menus: {
            disable: true,
          },
          dockedPosition: 'left',
          primaryColor: '#546ec5',
          models: [{
            name: 'cat',
            path: modelPath,
            scale: MODEL_CONFIGS.DEFAULT_SCALE,
            position: MODEL_CONFIGS.DEFAULT_POSITION,
            stageStyle: {
              height: MODEL_CONFIGS.DEFAULT_HEIGHT
            }
          }]
        });
      } finally {
        isModelLoading.value = false;
      }
    };

    // 清理 Live2D 实例
    const cleanupLive2dInstance = () => {
      if (isModelLoading.value) return;

      const containers = document.querySelectorAll('[id^="oml2d"]');
      containers.forEach(container => container.remove());

      // 清理可能的残留canvas元素
      const canvases = document.querySelectorAll('canvas[id^="live2d"]');
      canvases.forEach(canvas => canvas.remove());

      // 清理可能的残留style标签
      const styles = document.querySelectorAll('style[id^="oml2d"]');
      styles.forEach(style => style.remove());
    };

    // 初始化
    onMounted(() => {
      initZoom();
      createLive2dInstance();
    });

    // 监听路由变化，重新初始化图片缩放
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );

    // 使用防抖处理主题切换
    let themeChangeTimeout: ReturnType<typeof setTimeout>;

    // 监听主题变化
    watch(dark, async (newValue) => {
      if (isModelLoading.value) return;

      // 清除之前的定时器
      clearTimeout(themeChangeTimeout);

      // 设置新的定时器
      themeChangeTimeout = setTimeout(async () => {
        cleanupLive2dInstance();
        updateModelPath(newValue);
        await nextTick();
        createLive2dInstance();
      }, 300); // 300ms 的防抖延迟
    });
  }
}
