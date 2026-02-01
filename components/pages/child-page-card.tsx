import Link from 'next/link';
import Image from 'next/image';
import { PageSummary, getStrapiMediaUrl } from '@/lib/api/strapi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import MarkdownHtmlContent from '../shared/MarkdownHtmlContent';

/** Child page with required display fields */
export interface ChildPage extends PageSummary {
	fullPath: string;
	documentId: string;
	content?: string;
}

/** Props for ChildPageCard component */
interface ChildPageCardProps {
	page: ChildPage;
	className?: string;
}

/**
 * Type guard to check if children are PageSummary with required fields
 */
export function isChildPage(child: unknown): child is ChildPage {
	return (
		typeof child === 'object' &&
		child !== null &&
		'documentId' in child &&
		'fullPath' in child &&
		'title' in child
	);
}

/**
 * Renders a child page as a card with image, title, and excerpt
 * Features hover effects with lift and shadow enhancement
 */
const ChildPageCard = ({ page, className }: ChildPageCardProps) => {
	const hasImage = Boolean(page.featuredImage);

	return (
		<Link href={page.fullPath || '/'} className="group block mb-2">
			<Card
				className={cn(
					'h-full overflow-hidden hover:shadow-lg hover:border-blue-300',
					'hover:-translate-y-1 transition-all duration-200',
					className
				)}
			>
				{hasImage && page.featuredImage && (
					<div className="relative w-full aspect-video overflow-hidden">
						<Image
							src={getStrapiMediaUrl(page.featuredImage.url)}
							alt={page.featuredImage.alternativeText || page.title}
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>
				)}
				<CardHeader className={cn(hasImage ? 'pt-4' : '')}>
					<CardTitle className="text-gray-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
						<span>{page.title}</span>

						<svg
							className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</CardTitle>
					{/* {page.content && (
                        <MarkdownHtmlContent
                            content={page.content}
                            className="mb-8"
                        />
                    )} */}
				</CardHeader>
			</Card>
		</Link>
	);
};

export default ChildPageCard;

