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
								{ text: 'Organisation', link: '/functional/business-objects/organisation' },
								{ text: 'Project', link: '/functional/business-objects/project' },
								{ text: 'Group', link: '/functional/business-objects/group' },
								{ text: 'Participant', link: '/functional/business-objects/participant' },
								{ text: 'Activity', link: '/functional/business-objects/activity' },
								{ text: 'Vehicle', link: '/functional/business-objects/vehicle' },
								{ text: 'Options', link: '/functional/business-objects/options' },
							],
						},
						{
							text     : 'Operations',
							link     : '/functional/operations/',
							collapsed: true,
							items    : [
								{ text: 'Movement', link: '/functional/operations/movement' },
								{ text: 'Alert', link: '/functional/operations/alert' },
							],
						},
						{
							text     : 'Registration',
							link     : '/functional/registration/',
							collapsed: true,
							items    : [
								{ text: 'Registration period', link: '/functional/registration/registration-period' },
								{ text: 'Registration request', link: '/functional/registration/registration-request' },
							],
						},
						{ text: 'Roles', link: '/functional/roles' },
						{ text: 'Statistics', link: '/functional/statistics' },
						{ text: 'Data Policy', link: '/functional/data-policy' },
					],
				},
			],
			'/technical/' : [
				{
					text : 'Technical',
					link : '/technical/',
					items: [
						{
							text     : 'Architecture',
							link     : '/technical/architecture/',
							collapsed: false,
							items    : [
								{
									text     : 'C4 Model',
									link     : '/technical/architecture/c4/',
									collapsed: false,
									items    : [
										{
											text: 'Level 1 – System Context',
											link: '/technical/architecture/c4/context',
										},
										{
											text: 'Level 2 – Containers',
											link: '/technical/architecture/c4/containers',
										},
										{
											text     : 'Level 3 – Components',
											link     : '/technical/architecture/c4/components/',
											collapsed: false,
											items    : [
												{
													text: 'Frontend',
													link: '/technical/architecture/c4/components/frontend',
												},
												{ text: 'BFF', link: '/technical/architecture/c4/components/bff' },
												{ text: 'Core', link: '/technical/architecture/c4/components/core' },
												{
													text: 'Operation',
													link: '/technical/architecture/c4/components/operation',
												},
												{
													text: 'Registration',
													link: '/technical/architecture/c4/components/registration',
												},
											],
										},
									],
								},
							],
						},
						{ text: 'Security', link: '/technical/security' },
						{ text: 'Database', link: '/technical/database' },
						{
							text     : 'Decision Records',
							link     : '/technical/adr/',
							collapsed: true,
							items    : [
								{ text: '001 – Modular Monolith', link: '/technical/adr/001-modular-monolith' },
								{ text: '002 – BFF Pattern', link: '/technical/adr/002-bff' },
								{ text: '003 – Schema per Module', link: '/technical/adr/003-schema-per-module' },
								{ text: '004 – Reactive Stack', link: '/technical/adr/004-reactive-stack' },
								{
									text: '005 – Keycloak Organizations',
									link: '/technical/adr/005-keycloak-organizations',
								},
								{ text: '006 – Nuxt Layers', link: '/technical/adr/006-nuxt-layers' },
							],
						},
						{
							text     : 'Coding Guidelines',
							link     : '/technical/guidelines/',
							collapsed: true,
							items    : [
								{ text: 'Database', link: '/technical/guidelines/database' },
								{ text: 'Spring & Kotlin', link: '/technical/guidelines/spring' },
								{ text: 'Security', link: '/technical/guidelines/security' },
								{ text: 'Frontend', link: '/technical/guidelines/frontend' },
								{ text: 'Coding Style', link: '/technical/guidelines/coding-style' },
							],
						},
					],
				},
			],
		},

		socialLinks: [
			{ icon: 'linkedin', link: 'https://www.linkedin.com/in/luc-aucoin/' },
			{ icon: 'gitlab', link: 'https://gitlab.com/laucoin' },
			{ icon: 'github', link: 'https://github.com/laucoin' },
		],
	},
})
