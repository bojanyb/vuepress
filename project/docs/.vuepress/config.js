module.exports = {
    title: '个人主页', 
    description: '杨一博的博客',
    head: [
        ['link', { rel: 'icon', href: '/img/logo.ico' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
    ],
    themeConfig: {
        nav: [
            { text: '主页', link: '/' },
            { text: '博文',
              items: [
                { text: '前端', link: '/frontend/' },
                { text: 'ios', link: '/ios/' },
                { text: 'Web', link: '/web/' }
              ] 
            },
            { text: '关于', link: '/about/' },
            { text: 'Github', link: 'https://www.github.com/codeteenager' },
        ],
        sidebar: [
            {
                title: "前端基础",
                collapsable: true,
                children:[
                    ['/frontend/htmlCss.md', 'HTML、CSS'],
                    ['/frontend/ES5.md', 'ES5'],
                    ['/frontend/ES6.md', 'ES6'],
                    ['/frontend/vue.md', 'VUE'],
                ]
            },
            {
                title: "浏览器基础",
                collapsable: true,
                children:[
                    ['/frontend/htmlCss.md', 'HTML、CSS'],
                    ['/frontend/ES5.md', 'ES5'],
                    ['/frontend/ES6.md', 'ES6'],
                    ['/frontend/vue.md', 'VUE'],
                ]
            },
            {
                title: "网络基础",
                collapsable: true,
                children:[
                    ['/frontend/htmlCss.md', 'HTML、CSS'],
                    ['/frontend/ES5.md', 'ES5'],
                    ['/frontend/ES6.md', 'ES6'],
                    ['/frontend/vue.md', 'VUE'],
                ]
            },
            ['/frontend/', '前端'],
            ['/ios/', 'test'],
            ['/ios/', '发布新框架'],
            ['/ios/', '问题反馈'],
            {
                title: "一个列表",
                collapsable: true,
                children:[
                    ['/ios/test.md', '子项'],
                ]
            },
        ],
        sidebarDepth: 2,
        lastUpdated: 'Last Updated', 
    },
    serviceWorker: true,
}
