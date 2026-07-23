'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES } from '@/lib/constants/images';

/** Blog post configuration */
interface BlogPost {
	id: string;
	title: string;
	description: string;
	imagePath: string;
	readTime: number;
	href: string;
}

/** Static blog posts data */
const blogPosts: BlogPost[] = [
	{
		id: 'blog-1',
		title: '7-Day Loan Apps: Quick Access to Short-Term Cash',
		description: 'Explore top short-term loan apps offering quick approval and 7-day repayment.',
		imagePath: IMAGES.ILLUSTRATIONS.EMI_CALC,
		readTime: 4,
		href: 'https://wecredit.co.in/blog/7-day-loan-apps-quick-and-easy-access-to-short-term-loans/',
	},
	{
		id: 'blog-2',
		title: '15-Day Loan Apps for Instant Cash When Needed',
		description: 'Compare loan apps offering flexible 15-day repayment for urgent expenses.',
		imagePath: IMAGES.ILLUSTRATIONS.PERSONAL_LOAN,
		readTime: 4,
		href: 'https://wecredit.co.in/blog/14-day-loan-apps-in-india-instant-cash/',
	},
	{
		id: 'blog-3',
		title: 'Get ₹10,000 Loan Without a CIBIL Score',
		description: 'Discover how lenders approve urgent loans based on income, not your credit score.',
		imagePath: IMAGES.ILLUSTRATIONS.CREDIT_SCORE,
		readTime: 4,
		href: 'https://wecredit.co.in/blog/10000-loan-without-cibil/',
	},
	{
		id: 'blog-4',
		title: 'Quick ₹5,000 Loan for Students — No Credit Score Needed',
		description: 'See how students can get fast, no-CIBIL loans for urgent college expenses.',
		imagePath: IMAGES.ILLUSTRATIONS.BUSINESS_LOAN_CALC,
		readTime: 4,
		href: 'https://wecredit.co.in/blog/quick-rs-5000-loan-for-students-no-credit-score/',
	},
];

/** Props for BlogCard component */
interface BlogCardProps {
	post: BlogPost;
	index: number;
}

/**
 * Single blog card with image, title, description, and read time
 */
const BlogCard = ({ post, index }: BlogCardProps): React.ReactNode => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 15 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
		>
			<Link
				href={post.href}
				target="_blank"
				rel="noopener noreferrer"
				className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
			>
				{/* Image Container */}
				<div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
					<Image
						src={post.imagePath}
						alt={post.title}
						fill
						className="object-contain group-hover:scale-105 transition-transform duration-300"
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
					/>
				</div>

				{/* Content */}
				<div className="p-3 sm:p-4">
					<h3 className="text-sm sm:text-base font-medium mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
						{post.title}
					</h3>
					<p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2">
						{post.description}
					</p>
					{/* <span className="text-xs font-medium text-blue-600">
						{post.readTime} Mins Read
					</span> */}
				</div>
			</Link>
		</motion.div>
	);
};

/**
 * Blog section with grid of blog post cards
 * Displays recent articles and insights
 */
const BlogSection = (): React.ReactNode => {
	return (
		<section className="bg-white py-8 lg:py-10">
			<div className="mx-auto max-w-7xl xl:px-0 px-8">
				{/* Section Title */}
				<motion.h2
					className="text-xl font-semibold text-gray-900 text-center mb-8"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
				>
					Read . Learn . Grow
				</motion.h2>




				<div className="max-w-7xl mx-auto">
					<div
						key="blog-list"
						className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 lg:mx-0 lg:px-0 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 lg:overflow-visible lg:pb-0"
					>
						{blogPosts.map((post, index) => (
							<div
								key={post.id}
								className="w-full lg:min-w-0 snap-start shrink-0 lg:shrink"
							>
								<BlogCard post={post} index={index} />
							</div>
						))}
					</div>
					<div className="mt-6 flex items-center justify-center">
						<Link
							href="/blog/"
							className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800"
						>
							Read More
						</Link>
					</div>
				</div>
			</div>
		</section>




	);
};

export default BlogSection;

