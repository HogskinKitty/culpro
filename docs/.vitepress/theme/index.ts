import DefaultTheme from 'vitepress/theme'
import './style/index.css'
import mediumZoom from 'medium-zoom';
import {nextTick, onMounted, watch} from 'vue';
import {useRoute} from 'vitepress';

export default {
  extends: DefaultTheme,

  setup() {
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom('.main img', {background: 'var(--vp-c-bg)'}); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    onMounted(() => {
      initZoom();
    });
    watch(
        () => route.path,
        () => nextTick(() => initZoom())
    );
  },

  // 看板娘
  // @ts-ignore
  async enhanceApp() {

    // @ts-ignore
    if (!import.meta.env.SSR) {

      // let modelPath: string;
      //
      // if (true) {
      //   modelPath = '/live2d-models/models/cat-black/model.json';
      // } else {
      //   modelPath = '/live2d-models/models/cat-white/model.json';
      // }

      // @ts-ignore
      const {loadOml2d} = await import('oh-my-live2d');

      loadOml2d({
        statusBar: {
          disable: true,
          loadSuccessMessage: '麻麻酱我来咯',
        },
        menus: {
          disable: true,
        },
        dockedPosition: 'left',
        primaryColor: '#546ec5',
        models: [
          {
            path: 'https://model.oml2d.com/cat-black/model.json',
            scale: 0.15,
            position: [0, 20],
            stageStyle: {
              height: 350
            }
          },
          {
            path: 'https://model.oml2d.com/cat-black/model.json',
            scale: 0.15,
            position: [0, 20],
            stageStyle: {
              height: 350
            }
          },
        ]
      });
    }
  }
}
