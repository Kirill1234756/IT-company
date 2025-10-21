// Local type for service items (kept self-contained to avoid external deps)
interface Service {
    id: number
    title: string
    description: string
    priceFrom: string
    icon: string
    iconBg: string
    category: 'Growth' | 'Strategy' | 'Development'
}

export const growthServices: Service[] = [
    {
        id: 1,
        title: 'Promoting',
        description:
            "An essential element of any company's development in digital, allowing to attract customers / buyers for any product / service / product in the market. High-quality promotion online is the key to successful business for any industry in current conditions.",
        priceFrom: '€400',
        icon: '✅',
        iconBg: 'from-green-50 to-emerald-100',
        category: 'Growth',
    },
    {
        id: 2,
        title: 'Drawing up a marketing strategy',
        description:
            'Developing a business development path in the market and increasing its competitiveness. Defining the target audience, analyzing the market, competitors and trends, promotion channels and performance metrics.',
        priceFrom: '€500',
        icon: '📣',
        iconBg: 'from-blue-50 to-indigo-100',
        category: 'Growth',
    },
    {
        id: 3,
        title: 'Marketing campaign audit',
        description:
            'Improving the efficiency of marketing activities. The service includes analyzing the results of configured campaigns, assessing the effectiveness of marketing channels and metrics, identifying strengths and weaknesses, and adjusting the marketing strategy.',
        priceFrom: '€500',
        icon: '📄',
        iconBg: 'from-purple-50 to-violet-100',
        category: 'Growth',
    },
    {
        id: 4,
        title: 'Research for business development',
        description:
            'We determine the needs and preferences of customers, identify market features, and analyze competitors. We conduct marketing research, analyze statistical data, and other sources.',
        priceFrom: '€700',
        icon: '🔬',
        iconBg: 'from-orange-50 to-amber-100',
        category: 'Growth',
    },
    {
        id: 5,
        title: 'Market analysis',
        description:
            'This is an important tool that allows us to obtain complete information about competitors, prices, demand and market trends. Based on this information, we can develop an effective business promotion strategy and increase revenue.',
        priceFrom: '€700',
        icon: '🔍',
        iconBg: 'from-cyan-50 to-blue-100',
        category: 'Growth',
    },
    {
        id: 6,
        title: 'Competitor analysis',
        description:
            "Competitor analysis allows us to obtain comprehensive information about competitors, their strategies and strengths. This is an essential tool for developing an effective product promotion strategy and increasing a company's competitiveness.",
        priceFrom: '€500',
        icon: '📊',
        iconBg: 'from-indigo-50 to-purple-100',
        category: 'Growth',
    },
]

export const strategyServices: Service[] = [
    {
        id: 7,
        title: 'Drawing up a business plan',
        description:
            'Creating a business plan is an important process that allows you to determine the strategy for business development, its goals and objectives, develop a model, and also measure the achievement of these goals.',
        priceFrom: '€1000',
        icon: '📋',
        iconBg: 'from-red-50 to-rose-100',
        category: 'Strategy',
    },
    {
        id: 8,
        title: 'Drawing up a preliminary marketing strategy',
        description: 'Plan for promoting a product/service in the market.',
        priceFrom: '€500',
        icon: '💼',
        iconBg: 'from-blue-50 to-indigo-100',
        category: 'Strategy',
    },
    {
        id: 9,
        title: 'Branding',
        description:
            "Building and maintaining a brand image, creating a unique concept and positioning that will attract and retain customers, as well as increase a company's profits.",
        priceFrom: '€1100',
        icon: '🏷️',
        iconBg: 'from-purple-50 to-violet-100',
        category: 'Strategy',
    },
]

export const developmentServices: Service[] = [
    {
        id: 10,
        title: 'Site development',
        description:
            'We offer a full cycle of developing websites of any complexity. Our team of professionals will create a unique design and functionality suitable for your business.',
        priceFrom: '€2500',
        icon: '⚙️',
        iconBg: 'from-indigo-50 to-blue-100',
        category: 'Development',
    },
    {
        id: 11,
        title: 'Site integration with external services',
        description:
            'Automation and simplification of order processing in the company. Integration will significantly speed up order processing and increase the convenience of purchase for customers.',
        priceFrom: '€700',
        icon: '🔗',
        iconBg: 'from-cyan-50 to-teal-100',
        category: 'Development',
    },
    {
        id: 12,
        title: 'Automation of business processes',
        description:
            'Services that aim to improve the overall operation of a company. Creating an efficient system for managing and controlling business processes, automating work with documents, and optimizing team management.',
        priceFrom: '€2600',
        icon: '📈',
        iconBg: 'from-green-50 to-emerald-100',
        category: 'Development',
    },
    {
        id: 13,
        title: 'Integration with CRM',
        description:
            'Integration with CRM simplifies interaction with customers and increases sales efficiency. Automation of order processing processes, control of the level of service, management of marketing campaigns.',
        priceFrom: '€1200',
        icon: '🚀',
        iconBg: 'from-orange-50 to-red-100',
        category: 'Development',
    },
]


















