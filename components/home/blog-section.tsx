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
		title: "Savings Account vs Current Account: What's the Difference?",
		description: 'Understand the key differences between savings and current accounts to make informed financial decisions.',
		imagePath: IMAGES.ILLUSTRATIONS.EMI_CALC,
		readTime: 4,
		href: 'https://wecredit.co.in/blog/savings-account-vs-current-account-whats-the-difference/',
	},
	{
		id: 'blog-2',
		title: 'Adjustable Rate Mortgages: An Overview',
		description: 'Learn how adjustable rate mortgages work and whether they are right for you.',
		imagePath: IMAGES.ILLUSTRATIONS.PERSONAL_LOAN,
		readTime: 4,
		href: 'https://wecredit.co.in/blog/adjustable-rate-mortgages-an-overview/',
	},
	{
		id: 'blog-3',
		title: 'Fixed Rate Mortgage: An Overview',
		description: 'Explore the benefits and drawbacks of fixed rate mortgages for home buyers.',
		imagePath: IMAGES.ILLUSTRATIONS.CREDIT_SCORE,
		readTime: 4,
		href: 'https://wecredit.co.in/blog/fixed-rate-mortgage-an-overview/',
	},
	{
		id: 'blog-4',
		title: 'How to Track Your Personal Loan Status Online',
		description: 'A step-by-step guide to checking your personal loan application status online.',
		imagePath: IMAGES.ILLUSTRATIONS.BUSINESS_LOAN_CALC,
		readTime: 4,
		href: 'https://wecredit.co.in/blog/how-to-track-your-personal-loan-status-online/',
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
						className="object-cover group-hover:scale-105 transition-transform duration-300"
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
					<span className="text-xs font-medium text-blue-600">
						{post.readTime} Mins Read
					</span>
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
		<section className="bg-white py-4 sm:py-10 md:py-12 px-4">
			{/* Section Title */}
			<motion.h2
				className="text-lg sm:text-xl md:text-2xl font-medium text-center mb-6 sm:mb-8"
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
			>
				Read . Learn . Grow
			</motion.h2>

			{/* Blog Grid - 2x2 on mobile, 4 columns on larger screens */}
			<div className="mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
				{blogPosts.map((post, index) => (
					<BlogCard key={post.id} post={post} index={index} />
				))}
			</div>
		</section>
	);
};

export default BlogSection;

