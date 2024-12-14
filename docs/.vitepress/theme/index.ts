import DefaultTheme from 'vitepress/theme'
import './style/index.css'
import mediumZoom from 'medium-zoom';
import { onMounted, ref, watch, nextTick } from 'vue';
import { useData, useRoute } from 'vitepress';

/**
 * Live2D 模型配置
 */
const MODEL_CONFIGS = {
  // 模型路径配置，索引对应主题状态
  PATHS: [
    'https://model.oml2d.com/cat-black/model.json',   // 索引 0：暗色模型
    'https://model.oml2d.com/cat-white/model.json'   // 索引 1：亮色模型
  ],
  // 模型基础配置
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

    /**
     * 初始化图片缩放功能
     */
    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' });
    };

    /**
     * 创建 Live2D 实例并初始化模型
     */
    const createLive2dInstance = async () => {
      if (isModelLoading.value) return;

      try {
        isModelLoading.value = true;
        const { loadOml2d } = await import('oh-my-live2d');

        // 创建实例
        oml2dInstance.value = loadOml2d({
          // 状态栏配置
          statusBar: {
            disable: true,
            loadSuccessMessage: '麻麻酱我来咯',
          },
          // 菜单配置
          menus: {
            disable: true,
          },
          // 位置和样式
          dockedPosition: 'left',
          primaryColor: '#546ec5',
          // 模型配置
          models: [{
            name: 'cat',
            path: MODEL_CONFIGS.PATHS,  // 使用路径数组
            scale: MODEL_CONFIGS.DEFAULT_SCALE,
            position: MODEL_CONFIGS.DEFAULT_POSITION,
            stageStyle: {
              height: MODEL_CONFIGS.DEFAULT_HEIGHT
            }
          }]
        });

        // 加载对应主题的模型
        await oml2dInstance.value.loadModelByIndex(dark.value ? 0 : 1);
      } finally {
        isModelLoading.value = false;
      }
    };

    // 初始化
    onMounted(() => {
      initZoom();
      createLive2dInstance();
    });

    /**
     * 监听主题变化，切换模型
     */
    watch(dark, async (newValue) => {
      if (isModelLoading.value || !oml2dInstance.value) return;

      try {
        // 使用 loadNextModelClothes 切换模型外观
        await oml2dInstance.value.loadNextModelClothes();

        // 显示切换提示
        oml2dInstance.value.tipsMessage(
          newValue ? '切换到暗色模式啦~' : '切换到亮色模式啦~',
          3000  // 只保留持续时间参数
        );
      } catch (error) {
        console.error('模型切换失败:', error);
      }
    });
  }
}
