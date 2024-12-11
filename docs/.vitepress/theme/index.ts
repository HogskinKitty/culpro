/* .vitepress/theme/index.ts */
import DefaultTheme from 'vitepress/theme'
import './style/index.css'

export default {
  extends: DefaultTheme,

  // 看板娘
  // @ts-ignore
  async enhanceApp() {

    // @ts-ignore
    if (!import.meta.env.SSR) {

      let modelPath: string;

      if (true) {
        modelPath = '/live2d-models/models/cat-black/model.json';
      } else {
        modelPath = '/live2d-models/models/cat-white/model.json';
      }

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
