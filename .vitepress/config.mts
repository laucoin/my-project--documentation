import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title      : 'My Project',
	description: 'My project allow management of group care for minors project management.',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Functional', link: '/functional' },
			{ text: 'Technical', link: '/technical' },
		],

		sidebar: [
			{
				text : 'Functional',
				link : '/functional',
				items: [],
			},
			{
				text : 'Technical',
				link : '/technical',
				items: [],
			},
		],

		socialLinks: [
			{ icon: 'linkedin', link: 'https://www.linkedin.com/in/luc-aucoin/' },
			{ icon: 'gitlab', link: 'https://gitlab.com/laucoin' },
			{ icon: 'github', link: 'https://github.com/laucoin' },
		],
	},
})
