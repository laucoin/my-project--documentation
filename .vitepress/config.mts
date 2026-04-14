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
		nav        : [
			{ text: 'Home', link: '/' },
			{ text: 'Functional', link: '/functional/' },
			{ text: 'Technical', link: '/technical/' },
			{ text: 'Glossary', link: '/glossary' },
		],
		search     : {
			provider: 'local',
		},
		sidebar    : {
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
									link: '/functional/business-objects/document/',
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
						{
							text     : 'Features',
							link     : '/functional/features/',
							collapsed: true,
							items    : [
								{
									text     : 'General',
									collapsed: true,
									items    : [
										{ text: 'Authentication', link: '/functional/features/authentication' },
										{ text: 'Roles', link: '/functional/features/roles' },
										{ text: 'Options', link: '/functional/features/options' },
										{ text: 'Pagination', link: '/functional/features/pagination' },
										{ text: 'Data Policy', link: '/functional/features/data-policy' },
									],
								},
								{
									text     : 'Maintenance',
									collapsed: true,
									items    : [
										{
											text: 'Purge Orphans — Core',
											link: '/functional/features/purge-orphan-core',
										},
										{
											text: 'Purge Orphans — Operations',
											link: '/functional/features/purge-orphan-operations',
										},
										{
											text: 'Purge Orphans — Registration',
											link: '/functional/features/purge-orphan-registration',
										},
									],
								},
								{
									text     : 'Organization',
									collapsed: true,
									items    : [
										{ text: 'Search', link: '/functional/features/search-organizations' },
										{ text: 'Create', link: '/functional/features/create-organization' },
										{ text: 'Edit', link: '/functional/features/edit-organization' },
										{ text: 'Block', link: '/functional/features/block-organization' },
										{ text: 'Unblock', link: '/functional/features/unblock-organization' },
										{ text: 'Delete', link: '/functional/features/delete-organization' },
									],
								},
								{
									text     : 'User',
									collapsed: true,
									items    : [
										{ text: 'Search', link: '/functional/features/search-users' },
										{ text: 'Block', link: '/functional/features/block-user' },
										{ text: 'Unblock', link: '/functional/features/unblock-user' },
										{ text: 'Purge', link: '/functional/features/purge-user' },
										{ text: 'Export data', link: '/functional/features/export-user-data' },
									],
								},
								{
									text     : 'Project',
									collapsed: true,
									items    : [
										{ text: 'Search', link: '/functional/features/search-projects' },
										{ text: 'Create', link: '/functional/features/create-project' },
										{ text: 'Edit', link: '/functional/features/edit-project' },
										{ text: 'Block', link: '/functional/features/block-project' },
										{ text: 'Unblock', link: '/functional/features/unblock-project' },
										{ text: 'Delete', link: '/functional/features/delete-project' },
									],
								},
								{
									text     : 'Profile',
									collapsed: true,
									items    : [
										{ text: 'Search', link: '/functional/features/search-profiles' },
										{ text: 'Edit', link: '/functional/features/edit-profile' },
										{ text: 'Block', link: '/functional/features/block-profile' },
										{ text: 'Unblock', link: '/functional/features/unblock-profile' },
										{
											text: 'Invite user to project',
											link: '/functional/features/invite-user-to-project',
										},
										{
											text: 'Answer project invitation',
											link: '/functional/features/answer-project-invitation',
										},
										{
											text: 'Create support profile',
											link: '/functional/features/create-support-profile',
										},
									],
								},
								{
									text     : 'Group',
									collapsed: true,
									items    : [
										{ text: 'Search', link: '/functional/features/search-groups' },
										{ text: 'Create', link: '/functional/features/create-group' },
										{ text: 'Edit', link: '/functional/features/edit-group' },
										{ text: 'Disable', link: '/functional/features/disable-group' },
										{ text: 'Enable', link: '/functional/features/enable-group' },
									],
								},
								{
									text     : 'Participant',
									collapsed: true,
									items    : [
										{ text: 'Search', link: '/functional/features/search-participants' },
										{ text: 'Create', link: '/functional/features/create-participant' },
										{ text: 'Edit', link: '/functional/features/edit-participant' },
										{ text: 'Disable', link: '/functional/features/disable-participant' },
										{ text: 'Enable', link: '/functional/features/enable-participant' },
										{ text: 'Purge', link: '/functional/features/purge-participant' },
										{
											text: 'Export data',
											link: '/functional/features/export-participant-data',
										},
										{ text: 'Delete', link: '/functional/features/delete-participant' },
									],
								},
								{
									text     : 'Activity',
									collapsed: true,
									items    : [
										{ text: 'Search', link: '/functional/features/search-activities' },
										{ text: 'Create', link: '/functional/features/create-activity' },
										{ text: 'Edit', link: '/functional/features/edit-activity' },
										{ text: 'Disable', link: '/functional/features/disable-activity' },
										{ text: 'Enable', link: '/functional/features/enable-activity' },
										{ text: 'Delete', link: '/functional/features/delete-activity' },
									],
								},
								{
									text     : 'Vehicle',
									collapsed: true,
									items    : [
										{ text: 'Search', link: '/functional/features/search-vehicles' },
										{ text: 'Create', link: '/functional/features/create-vehicle' },
										{ text: 'Edit', link: '/functional/features/edit-vehicle' },
										{ text: 'Disable', link: '/functional/features/disable-vehicle' },
										{ text: 'Enable', link: '/functional/features/enable-vehicle' },
										{ text: 'Delete', link: '/functional/features/delete-vehicle' },
									],
								},
								{
									text     : 'Movement',
									collapsed: true,
									items    : [
										{ text: 'Search', link: '/functional/features/search-movements' },
										{ text: 'Create', link: '/functional/features/create-movement' },
										{ text: 'Edit', link: '/functional/features/edit-movement' },
										{ text: 'Hide', link: '/functional/features/hide-movement' },
										{ text: 'Restore', link: '/functional/features/restore-movement' },
									],
								},
								{
									text     : 'Alert',
									collapsed: true,
									items    : [
										{ text: 'Search', link: '/functional/features/search-alerts' },
										{ text: 'Create', link: '/functional/features/create-alert' },
										{ text: 'Edit', link: '/functional/features/edit-alert' },
									],
								},
								{
									text     : 'Communication',
									collapsed: true,
									items    : [
										{ text: 'Create', link: '/functional/features/create-communication' },
										{ text: 'Edit', link: '/functional/features/edit-communication' },
										{ text: 'Hide', link: '/functional/features/hide-communication' },
										{ text: 'Restore', link: '/functional/features/restore-communication' },
									],
								},
							],
						},
					],
				},
			],
			'/technical/' : [
				{ text: 'Technical', link: '/technical' },
			],
			'/glossary'   : [
				{ text: 'Glossary', link: '/glossary' },
			],
		},
		socialLinks: [
			{ icon: 'linkedin', link: 'https://www.linkedin.com/in/luc-aucoin/' },
			{ icon: 'gitlab', link: 'https://gitlab.com/laucoin' },
			{ icon: 'github', link: 'https://github.com/laucoin' },
		],
	},
})
