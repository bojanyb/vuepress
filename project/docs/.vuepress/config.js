module.exports = {
    title: 'LearningSpace', 
    description: '我的学习空间',
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
                title: "编程基础",
                collapsable: true,
                children:[
                    ['/frontend/HTML(5).md', 'HTML(5)'],
                    ['/frontend/CSS(3).md', 'CSS(3)'],
                    ['/frontend/JavaScript(ES6).md', 'JavaScript(ES6)']
                ]
            },
            {
                title: "工作实战",
                collapsable: true,
                children:[
                    ['/frontend/practice.md', '实践'],
                    ['/frontend/vue-admin.md', 'Vue-admin'],
                    ['/frontend/webpack.md', 'Webpack'],

                ]
            },
            {
                title: "进阶之路",
                collapsable: true,
                children:[
                    ['/frontend/vue3.0+ts.md', 'Vue3.0 + ts'],
                    ['/frontend/vue+node.js.md', 'Node']
                ]
            },
            {
                title: "计算机基础",
                collapsable: true,
                children:[
                    ['/frontend/General Education/operating system.md', '操作系统'],
                ]
            },
            {
                title: "技术之外",
                collapsable: true,
                children:[
                ]
            },
            ['/ios/', '问题反馈'],
            // {
            //     title: "一个列表",
            //     collapsable: true,
            //     children:[
            //         ['/ios/test.md', '子项'],
            //     ]
            // },
        ],
        sidebarDepth: 2,
        lastUpdated: 'Last Updated', 
    },
    serviceWorker: true,
}
