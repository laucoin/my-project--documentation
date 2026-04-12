import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	head       : [ [ 'link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' } ] ],
	title      : 'My Project',
	description: 'Allow management of group care for minors project.',
	markdown   : {
		config(md) {
			md.use((it) => {
				const fence = it.renderer.rules.fence!.bind(it.renderer.rules)
				it.renderer.rules.fence = (tokens, idx, options, env, self) => {
					const token = tokens[idx]
					if (token.info.trim() === 'mermaid') {
						const encoded = Buffer.from(token.content).toString('base64')
						return `<MermaidChart code="${encoded}" />\n`
					}
					return fence(tokens, idx, options, env, self)
				}
			})
		},
	},

	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Functional', link: '/functional/' },
			{ text: 'Technical', link: '/technical/' },
		],

		sidebar: {
			'/functional/': [
				{
					text : 'Functional',
					link : '/functional/',
					items: [
						{
							text     : 'Business Objects',
							link     : '/functional/business-objects/',
							collapsed: true,
							items    : [
								{
									text     : 'Core',
									link     : '/functional/business-objects/core',
									collapsed: true,
									items    : [
										{
											text: 'Organization',
											link: '/functional/business-objects/core/organization',
										},
										{ text: 'Project', link: '/functional/business-objects/core/project' },
										{ text: 'Profile', link: '/functional/business-objects/core/profile' },
										{ text: 'User', link: '/functional/business-objects/core/user' },
										{ text: 'Group', link: '/functional/business-objects/core/group' },
										{ text: 'Participant', link: '/functional/business-objects/core/participant' },
										{ text: 'Activity', link: '/functional/business-objects/core/activity' },
										{ text: 'Vehicle', link: '/functional/business-objects/core/vehicle' },
									],
								},
								{
									text: 'Document',
									link: '/functional/business-objects/document',
								},
								{
									text     : 'Operations',
									link     : '/functional/business-objects/operations',
									collapsed: true,
									items    : [
										{ text: 'Movement', link: '/functional/business-objects/operations/movement' },
										{ text: 'Alert', link: '/functional/business-objects/operations/alert' },
										{
											text: 'Communication',
											link: '/functional/business-objects/operations/communication',
										},
									],
								},
								{
									text: 'Registration',
									link: '/functional/business-objects/registration',
								},
							],
						},
						{ text: 'Data Policy', link: '/functional/data-policy' },
						{ text: 'Options', link: '/functional/options' },
						{ text: 'Roles', link: '/functional/roles' },
					],
				},
			],
			'/technical/' : [
				{ text: 'Technical', link: '/technical' },
			],
		},

		socialLinks: [
			{ icon: 'linkedin', link: 'https://www.linkedin.com/in/luc-aucoin/' },
			{ icon: 'gitlab', link: 'https://gitlab.com/laucoin' },
			{ icon: 'github', link: 'https://github.com/laucoin' },
		],
	},
})
